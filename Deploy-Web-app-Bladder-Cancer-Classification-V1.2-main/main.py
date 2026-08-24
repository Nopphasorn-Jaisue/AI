import base64
from io import BytesIO
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from torchvision import transforms
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "Model"
DIST_DIR = BASE_DIR / "dist"
INDEX_HTML = DIST_DIR / "index.html"

CLASS_NAMES = ["T1", "T2", "T3", "T4"]

# OpenCV draws on BGR images.
STAGE_COLORS = {
    "T1": (0, 200, 0),
    "T2": (0, 255, 255),
    "T3": (0, 128, 255),
    "T4": (0, 0, 255),
}


app = FastAPI(title="Bladder Cancer Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# After `npm run build`, FastAPI can serve the generated React files.
# During development, Vite serves React and proxies `/api/*` to this app.
app.mount(
    "/assets",
    StaticFiles(directory=str(DIST_DIR / "assets"), check_dir=False),
    name="assets",
)
app.mount(
    "/img",
    StaticFiles(directory=str(BASE_DIR / "img"), check_dir=False),
    name="img",
)


def load_classification_model(model_path: Path) -> Any:
    if not model_path.exists():
        raise RuntimeError(f"Classification model not found: {model_path}")

    try:
        model = torch.load(model_path, map_location="cpu", weights_only=False)
    except TypeError:
        model = torch.load(model_path, map_location="cpu")

    if not hasattr(model, "eval"):
        raise RuntimeError("Classification model file did not contain a torch model.")

    model.eval()
    return model


yolo_model_path = MODEL_DIR / "best.pt"
cls_model_path = MODEL_DIR / "resnet101_web_model_v.1.pt"

if not yolo_model_path.exists():
    raise RuntimeError(f"YOLO model not found: {yolo_model_path}")

yolo_model = YOLO(str(yolo_model_path))
cls_model = load_classification_model(cls_model_path)

image_transform = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485, 0.456, 0.406],
            [0.229, 0.224, 0.225],
        ),
    ]
)


def encode_bgr_jpeg(image_bgr: np.ndarray) -> str:
    ok, buffer = cv2.imencode(".jpg", image_bgr)
    if not ok:
        raise ValueError("Could not encode result image.")
    return base64.b64encode(buffer).decode("utf-8")


def clamp_box(box: np.ndarray, width: int, height: int) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = [int(round(float(value))) for value in box[:4]]
    x1 = max(0, min(x1, width - 1))
    y1 = max(0, min(y1, height - 1))
    x2 = max(0, min(x2, width))
    y2 = max(0, min(y2, height))
    return x1, y1, x2, y2


def detect_and_predict(image_rgb: np.ndarray) -> dict[str, Any]:
    draw_image = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)
    height, width = image_rgb.shape[:2]

    results = yolo_model(image_rgb)
    boxes = (
        results[0].boxes.xyxy.cpu().numpy()
        if results and results[0].boxes is not None
        else np.empty((0, 4))
    )

    predictions: list[dict[str, Any]] = []
    all_probs: list[list[float]] = []

    for box in boxes:
        x1, y1, x2, y2 = clamp_box(box, width, height)
        if x2 <= x1 or y2 <= y1:
            continue

        roi = image_rgb[y1:y2, x1:x2]
        if roi.size == 0:
            continue

        roi_pil = Image.fromarray(roi)
        roi_tensor = image_transform(roi_pil).unsqueeze(0)

        with torch.no_grad():
            logits = cls_model(roi_tensor)
            probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

        all_probs.append(probs.tolist())

        idx = int(np.argmax(probs))
        stage = CLASS_NAMES[idx]
        confidence = float(probs[idx])
        predictions.append(
            {
                "stage": stage,
                "confidence": confidence,
                "box": [x1, y1, x2, y2],
            }
        )

        color = STAGE_COLORS.get(stage, (255, 255, 255))
        cv2.rectangle(draw_image, (x1, y1), (x2, y2), color, 2)

        label = f"{stage} {confidence * 100:.1f}%"
        (text_width, text_height), _ = cv2.getTextSize(
            label,
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            2,
        )
        label_top = max(0, y1 - text_height - 8)
        cv2.rectangle(
            draw_image,
            (x1, label_top),
            (min(width, x1 + text_width + 8), y1),
            color,
            -1,
        )
        cv2.putText(
            draw_image,
            label,
            (x1 + 4, max(text_height + 2, y1 - 5)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2,
        )

    if all_probs:
        avg_probs = np.mean(np.array(all_probs), axis=0)
        percentages = {
            stage: float(probability) * 100
            for stage, probability in zip(CLASS_NAMES, avg_probs)
        }
        dominant_stage = CLASS_NAMES[int(np.argmax(avg_probs))]
    else:
        percentages = {stage: 0.0 for stage in CLASS_NAMES}
        dominant_stage = None

    return {
        "predictions": predictions,
        "percentages": percentages,
        "dominant_stage": dominant_stage,
        "result_image": encode_bgr_jpeg(draw_image),
    }


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/predict")
async def predict(file: UploadFile = File(...)) -> dict[str, Any]:
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="No image file was uploaded.")

    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.") from exc

    try:
        return detect_and_predict(np.array(image))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    if INDEX_HTML.exists():
        return FileResponse(INDEX_HTML)

    return JSONResponse(
        status_code=404,
        content={
            "message": (
                "React build not found. Run `npm run dev` for the frontend "
                "or `npm run build` before serving the app with FastAPI."
            )
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)