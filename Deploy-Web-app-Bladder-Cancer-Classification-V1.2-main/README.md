# Deploy-Web-app-Bladder-Cancer-Classification-V1.2

## ระบบตรวจจับและจัดระยะมะเร็งกระเพาะปัสสาวะด้วย AI

ระบบตรวจจับและจัดระยะมะเร็งกระเพาะปัสสาวะจากภาพ MRI โดยใช้ปัญญาประดิษฐ์ สามารถจัดระยะโรคเป็น T1, T2, T3, และ T4 พร้อมแสดงผลการวิเคราะห์และความมั่นใจของการทำนาย

## คุณสมบัติ

- **การตรวจจับด้วย AI**: ใช้โมเดล YOLO สำหรับการตรวจจับวัตถุและ ResNet101 สำหรับการจำแนก
- **การจำแนกระยะโรคหลายระยะ**: จำแนกมะเร็งกระเพาะปัสสาวะเป็นระยะ T1, T2, T3, T4
- **การวิเคราะห์ภาพ**: แสดงกรอบ bounding box พร้อมคะแนนความมั่นใจบนพื้นที่ที่ตรวจพบ
- **การทำนายแบบเรียลไทม์**: Backend FastAPI สำหรับประมวลผลภาพอย่างรวดเร็ว
- **UI ทันสมัย**: Frontend พัฒนาด้วย React, TypeScript และ TailwindCSS
- **การแสดงผล 3D**: การแสดงผล 3D แบบโต้ตอบโดยใช้ React Three Fiber
- **รองรับหลายอุปกรณ์**: ใช้งานได้ทั้งบนเดสก์ท็อปและมือถือ

## เทคโนโลยีที่ใช้

### Backend
- **FastAPI**: เฟรมเวิร์กเว็บ Python ที่ทันสมัย
- **PyTorch**: เฟรมเวิร์ก Deep Learning
- **YOLO (Ultralytics)**: โมเดลการตรวจจับวัตถุ
- **ResNet101**: โมเดลการจำแนกภาพ
- **OpenCV**: การประมวลผลภาพ
- **Uvicorn**: ASGI Server

### Frontend
- **React 19**: ไลบรารี UI
- **TypeScript**: JavaScript ที่มีการกำหนดประเภทข้อมูล
- **Vite**: เครื่องมือ Build และ Dev Server
- **TailwindCSS**: เฟรมเวิร์ก CSS แบบ Utility-first
- **React Three Fiber**: การแสดงผล 3D ใน React
- **Lucide React**: ไลบรารีไอคอน
- **Motion**: ไลบรารีแอนิเมชัน

## การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Python 3.8+
- Node.js 18+
- npm หรือ yarn

### การติดตั้ง Backend

1. ติดตั้ง dependencies ของ Python:
```bash
pip install fastapi uvicorn torch torchvision opencv-python pillow ultralytics
```

2. ตรวจสอบให้แน่ใจว่าไฟล์โมเดลอยู่ในโฟลเดอร์ `Model/`:
- `best.pt` - โมเดล YOLO สำหรับการตรวจจับ
- `resnet101_web_model_v.1.pt` - โมเดลการจำแนก

### การติดตั้ง Frontend

1. ติดตั้ง dependencies ของ Node.js:
```bash
npm install
```

2. Build frontend:
```bash
npm run build
```

## การใช้งาน

### โหมดพัฒนา (Development Mode)

1. เริ่มต้น Backend API:
```bash
npm run dev:api
# หรือ
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

2. เริ่มต้น Frontend development server:
```bash
npm run dev
```

3. เปิด http://localhost:3000 ในเบราว์เซอร์

### โหมดการใช้งานจริง (Production Mode)

1. Build frontend:
```bash
npm run build
```

2. เริ่มต้น Backend server:
```bash
npm run start
# หรือ
python main.py
```

3. เปิด http://localhost:8000 ในเบราว์เซอร์

## API Endpoints

- `GET /api/health` - Endpoint ตรวจสอบสถานะระบบ
- `POST /api/predict` - อัปโหลดภาพเพื่อทำนาย
  - รับ: ไฟล์ภาพ (multipart/form-data)
  - ส่งคืน: JSON พร้อมการทำนาย, เปอร์เซ็นต์, ระยะโรคหลัก, และภาพผลลัพธ์

## คลาสของโมเดล

- **T1**: เนื้องอกลุกล้ำเข้าสู่ submucosa
- **T2**: เนื้องอกลุกล้ำเข้าสู่ muscularis propria
- **T3**: เนื้องอกลุกล้ำเข้าสู่เนื้อเยื่อรอบกระเพาะปัสสาวะ
- **T4**: เนื้องอกลุกล้ำเข้าสู่โครงสร้างที่อยู่ใกล้เคียง

## โครงสร้างโปรเจกต์

```
Web-Bladder-Cancer-main/
├── Model/                  # ไฟล์โมเดล AI
│   ├── best.pt            # โมเดล YOLO สำหรับการตรวจจับ
│   └── resnet101_web_model_v.1.pt  # โมเดลการจำแนก
├── src/                    # ซอร์สโค้ด Frontend
│   ├── components/         # คอมโพเนนต์ React
│   ├── 3d/                 # คอมโพเนนต์การแสดงผล 3D
│   ├── lib/                # ฟังก์ชัน Utility
│   ├── App.tsx             # คอมโพเนนต์ App หลัก
│   ├── main.tsx            # จุดเริ่มต้น
│   └── index.css           # สไตล์ทั่วไป
├── dist/                   # ไฟล์ Frontend ที่ Build แล้ว
├── img/                    # รูปภาพสถิติ
├── main.py                 # Backend FastAPI
├── index.html              # Template HTML
├── package.json            # Dependencies ของ Node.js
├── vite.config.ts          # การตั้งค่า Vite
└── tailwind.config.js      # การตั้งค่า TailwindCSS
```

## ใบอนุญาต

โปรเจกต์นี้สร้างขึ้นเพื่อการศึกษาและการวิจัย
