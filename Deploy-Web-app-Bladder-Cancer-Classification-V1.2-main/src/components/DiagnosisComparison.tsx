import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitCompare,
  Upload,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Calendar,
  Activity,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
  Split,
  Sparkles,
  Info,
  Maximize2,
  FileText,
  FileBadge
} from "lucide-react";
import { playClick, playStageSelect } from "../lib/sound";
import { useLanguage } from "../lib/i18n";

export interface ScanRecord {
  id: string;
  title: string;
  date: string;
  stage: "T1" | "T2" | "T3" | "T4";
  substage: string;
  virads: number;
  muscleStatus: "Intact" | "Superficially Invaded" | "Deeply Invaded" | "Extravesical Spread";
  lesionSize: { width: number; height: number; area: number }; // mm
  confidence: number;
  imageUrl: string;
  annotatedUrl?: string;
  roi: { x: number; y: number; w: number; h: number }; // percentage 0-100
}

export interface ComparisonCase {
  id: string;
  nameTh: string;
  nameEn: string;
  patientId: string;
  trajectory: "progression" | "regression" | "stable";
  prev: ScanRecord;
  curr: ScanRecord;
  clinicalNoteTh: string;
  clinicalNoteEn: string;
}

// Generate realistic anatomical MRI canvas representations
function generateMriDataUrl(
  stage: string,
  roi: { x: number; y: number; w: number; h: number },
  isAnnotated: boolean,
  color: string
): string {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Dark background gradient
  const bgGrad = ctx.createRadialGradient(240, 240, 20, 240, 240, 240);
  bgGrad.addColorStop(0, "#080e1a");
  bgGrad.addColorStop(0.5, "#0f172a");
  bgGrad.addColorStop(1, "#020617");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 480);

  // Pelvic bone & surrounding soft tissue shadows
  ctx.fillStyle = "#1e293b22";
  ctx.beginPath();
  ctx.ellipse(240, 240, 220, 200, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bladder outer muscularis wall
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.ellipse(240, 240, 160, 140, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Bladder lumen (fluid/urine filled dark region)
  ctx.fillStyle = "#030712";
  ctx.beginPath();
  ctx.ellipse(240, 240, 150, 130, 0, 0, Math.PI * 2);
  ctx.fill();

  // Submucosa layer outline
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(240, 240, 148, 128, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Tumor mass calculation
  const tx = (roi.x / 100) * 480;
  const ty = (roi.y / 100) * 480;
  const tw = (roi.w / 100) * 480;
  const th = (roi.h / 100) * 480;

  // Tumor lesion texture
  const tumorGrad = ctx.createRadialGradient(tx + tw / 2, ty + th / 2, 5, tx + tw / 2, ty + th / 2, Math.max(tw, th));
  tumorGrad.addColorStop(0, "#94a3b8");
  tumorGrad.addColorStop(0.5, "#64748b");
  tumorGrad.addColorStop(1, "#334155");
  ctx.fillStyle = tumorGrad;

  ctx.beginPath();
  ctx.ellipse(tx + tw / 2, ty + th / 2, tw / 2, th / 2, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // If muscle invasion, draw extension into wall
  if (stage === "T2" || stage === "T3" || stage === "T4") {
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.ellipse(tx + tw * 0.7, ty + th * 0.7, tw * 0.4, th * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw OpenCV annotation overlay if requested
  if (isAnnotated) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(tx, ty, tw, th);

    // Label pill
    ctx.fillStyle = color;
    const label = `${stage} Lesion (${Math.round(tw * 0.6)}mm)`;
    ctx.font = "bold 13px sans-serif";
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(tx, Math.max(0, ty - 22), textWidth + 14, 22);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(label, tx + 7, Math.max(16, ty - 6));
  }

  return canvas.toDataURL("image/jpeg", 0.9);
}

const PRESET_CASES: ComparisonCase[] = [
  {
    id: "case-progression-1",
    nameTh: "เคสที่ 1: การลุกลามเข้าสู่ชั้นกล้ามเนื้อ (T1 ➔ T2b)",
    nameEn: "Case 1: Progression into Deep Muscle (T1 ➔ T2b)",
    patientId: "HN-4902188",
    trajectory: "progression",
    prev: {
      id: "scan-prev-1",
      title: "Baseline Scan (การตรวจก่อนหน้า)",
      date: "2026-01-14",
      stage: "T1",
      substage: "T1 (Lamina Propria)",
      virads: 2,
      muscleStatus: "Intact",
      lesionSize: { width: 13.8, height: 11.2, area: 154.5 },
      confidence: 94.8,
      roi: { x: 38, y: 34, w: 18, h: 16 },
      imageUrl: "",
      annotatedUrl: ""
    },
    curr: {
      id: "scan-curr-1",
      title: "Follow-up Scan (การตรวจติดตามปัจจุบัน)",
      date: "2026-08-24",
      stage: "T2",
      substage: "T2b (Deep Muscularis Propria)",
      virads: 5,
      muscleStatus: "Deeply Invaded",
      lesionSize: { width: 29.4, height: 24.6, area: 723.2 },
      confidence: 96.2,
      roi: { x: 34, y: 30, w: 32, h: 28 },
      imageUrl: "",
      annotatedUrl: ""
    },
    clinicalNoteTh:
      "พบการขยายตัวของก้อนเนื้อเพิ่มขึ้นอย่างมีนัยสำคัญ (+368% พื้นที่) พร้อมการแทรกซึมทะลุผ่านชั้น Lamina Propria เข้าสู่ชั้นกล้ามเนื้อ Detrusor Muscle ชั้นลึก สอดคล้องกับ VI-RADS Score ปรับเพิ่มจาก 2 เป็น 5 แนะนำส่งปรึกษา Multidisciplinary Tumor Board เพื่อพิจารณาให้ Neoadjuvant Chemotherapy (NAC) ร่วมกับ Radical Cystectomy",
    clinicalNoteEn:
      "Significant tumor growth observed (+368% cross-sectional area) with definitive interruption of the low-signal muscularis propria ring (VI-RADS 2 ➔ 5). Findings indicate transition from NMIBC to MIBC (T1 ➔ T2b). Recommendation: Urgent Multidisciplinary Tumor Board review for Neoadjuvant Chemotherapy followed by Radical Cystectomy."
  },
  {
    id: "case-regression-2",
    nameTh: "เคสที่ 2: การตอบสนองต่อการรักษาหลังเคมีบำบัด (T3a ➔ T1)",
    nameEn: "Case 2: Tumor Regression After Systemic Therapy (T3a ➔ T1)",
    patientId: "HN-3881024",
    trajectory: "regression",
    prev: {
      id: "scan-prev-2",
      title: "Pre-treatment Scan (ก่อนรับการรักษา)",
      date: "2025-11-10",
      stage: "T3",
      substage: "T3a (Microscopic Perivesical Fat)",
      virads: 5,
      muscleStatus: "Extravesical Spread",
      lesionSize: { width: 34.2, height: 28.5, area: 974.7 },
      confidence: 93.5,
      roi: { x: 32, y: 28, w: 36, h: 32 },
      imageUrl: "",
      annotatedUrl: ""
    },
    curr: {
      id: "scan-curr-2",
      title: "Post-Neoadjuvant Chemo (หลังเคมีบำบัด)",
      date: "2026-08-20",
      stage: "T1",
      substage: "T1 (Minimal Residual Mass)",
      virads: 2,
      muscleStatus: "Intact",
      lesionSize: { width: 9.1, height: 7.4, area: 67.3 },
      confidence: 97.1,
      roi: { x: 42, y: 40, w: 12, h: 10 },
      imageUrl: "",
      annotatedUrl: ""
    },
    clinicalNoteTh:
      "ก้อนเนื้อตอบสนองต่อการรักษาเคมีบำบัดอย่างดีเยี่ยม ขนาดยุบลง 93.1% โดยชั้นกล้ามเนื้อ Detrusor Muscle ฟื้นตัวเป็นขอบเรียบ ไม่พบการลุกลามออกนอกกระเพาะปัสสาวะ แนะนำพิจารณา Restaging TURBT หรือ Bladder Preservation Protocol",
    clinicalNoteEn:
      "Exceptional response to systemic neoadjuvant chemotherapy with 93.1% volume reduction. Muscularis propria ring signal restored with no residual extravesical fat stranding. Recommendation: Consider Restaging TURBT or Bladder Preservation Protocol with close surveillance."
  },
  {
    id: "case-stable-3",
    nameTh: "เคสที่ 3: รอยโรคคงที่ในการตรวจติดตาม (T2a ➔ T2a)",
    nameEn: "Case 3: Stable Disease on Diagnostic Surveillance (T2a ➔ T2a)",
    patientId: "HN-5120931",
    trajectory: "stable",
    prev: {
      id: "scan-prev-3",
      title: "Initial Staging Scan (การตรวจครั้งแรก)",
      date: "2026-03-05",
      stage: "T2",
      substage: "T2a (Superficial Muscle Invasion)",
      virads: 4,
      muscleStatus: "Superficially Invaded",
      lesionSize: { width: 18.2, height: 15.0, area: 273.0 },
      confidence: 95.0,
      roi: { x: 36, y: 35, w: 22, h: 18 },
      imageUrl: "",
      annotatedUrl: ""
    },
    curr: {
      id: "scan-curr-3",
      title: "Follow-up Scan (การตรวจติดตาม 5 เดือน)",
      date: "2026-08-24",
      stage: "T2",
      substage: "T2a (Superficial Muscle Invasion)",
      virads: 4,
      muscleStatus: "Superficially Invaded",
      lesionSize: { width: 18.8, height: 15.5, area: 291.4 },
      confidence: 95.4,
      roi: { x: 36, y: 35, w: 23, h: 19 },
      imageUrl: "",
      annotatedUrl: ""
    },
    clinicalNoteTh:
      "ขนาดและลักษณะการลุกลามของก้อนเนื้อคงที่ ไม่พบการแพร่กระจายไปยังชั้นไขมันรอบกระเพาะปัสสาวะ (Perivesical Fat) ดำเนินการตามแผนการรักษาและนัดติดตามผลตามรอบ",
    clinicalNoteEn:
      "Stable lesion dimensions (+6.7% slight variance) confined to the inner half of the muscularis propria with intact outer perivesical boundary. Continue scheduled definitive therapy protocol."
  }
];

export const DiagnosisComparison: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-progression-1");
  const [viewMode, setViewMode] = useState<"side-by-side" | "split-slider" | "heatmap">("side-by-side");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Custom scans
  const [customPrev, setCustomPrev] = useState<ScanRecord | null>(null);
  const [customCurr, setCustomCurr] = useState<ScanRecord | null>(null);

  const prevFileInputRef = useRef<HTMLInputElement>(null);
  const currFileInputRef = useRef<HTMLInputElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Load selected case
  const activeCase = PRESET_CASES.find((c) => c.id === selectedCaseId) || PRESET_CASES[0];
  const prevRecord = isCustomMode && customPrev ? customPrev : activeCase.prev;
  const currRecord = isCustomMode && customCurr ? customCurr : activeCase.curr;

  // Generate image URLs dynamically if not set
  const prevImgUrl =
    prevRecord.imageUrl ||
    generateMriDataUrl(
      prevRecord.stage,
      prevRecord.roi,
      showAnnotations,
      prevRecord.stage === "T1" ? "#10B981" : prevRecord.stage === "T2" ? "#F59E0B" : "#EF4444"
    );
  const currImgUrl =
    currRecord.imageUrl ||
    generateMriDataUrl(
      currRecord.stage,
      currRecord.roi,
      showAnnotations,
      currRecord.stage === "T1" ? "#10B981" : currRecord.stage === "T2" ? "#F59E0B" : "#EF4444"
    );

  // Calculate metrics diff
  const sizeDiffPercent = (
    ((currRecord.lesionSize.area - prevRecord.lesionSize.area) / prevRecord.lesionSize.area) *
    100
  ).toFixed(1);
  const isGrowth = currRecord.lesionSize.area > prevRecord.lesionSize.area;
  const isRegression = currRecord.lesionSize.area < prevRecord.lesionSize.area;

  const stageOrder = { T1: 1, T2: 2, T3: 3, T4: 4 };
  const stageDiff = stageOrder[currRecord.stage] - stageOrder[prevRecord.stage];

  // Slider drag events
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "prev" | "curr") => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const simulatedStage: "T1" | "T2" | "T3" | "T4" = target === "prev" ? "T1" : "T2";
      const newScan: ScanRecord = {
        id: `custom-${target}-${Date.now()}`,
        title: target === "prev" ? "Custom Baseline Scan" : "Custom Follow-up Scan",
        date: new Date().toISOString().split("T")[0],
        stage: simulatedStage,
        substage: `${simulatedStage} (Patient Upload)`,
        virads: target === "prev" ? 2 : 4,
        muscleStatus: target === "prev" ? "Intact" : "Superficially Invaded",
        lesionSize: { width: target === "prev" ? 14.5 : 22.0, height: 12.0, area: target === "prev" ? 174 : 264 },
        confidence: 95.2,
        roi: { x: 35, y: 35, w: target === "prev" ? 18 : 28, h: target === "prev" ? 16 : 24 },
        imageUrl: dataUrl
      };

      if (target === "prev") setCustomPrev(newScan);
      else setCustomCurr(newScan);
      setIsCustomMode(true);
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 print:m-0 print:p-0">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t("compHeaderTitle")}
              </h2>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-indigo-200">
                Longitudinal AI Engine
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed font-medium">
              {t("compHeaderSubtitle")}
            </p>
          </div>
        </div>

        {/* Top Print / Export Actions */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>{t("compExportReport")}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector & View Mode Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Preset Selector */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("compPresetCases")}</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
            {PRESET_CASES.map((item) => {
              const isSelected = selectedCaseId === item.id && !isCustomMode;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playStageSelect(item.curr.stage);
                    setSelectedCaseId(item.id);
                    setIsCustomMode(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border flex flex-col gap-0.5 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                  }`}
                >
                  <span className="truncate">{language === "th" ? item.nameTh : item.nameEn}</span>
                  <span
                    className={`text-[10px] font-semibold ${
                      isSelected
                        ? "text-blue-100"
                        : item.trajectory === "progression"
                        ? "text-rose-600"
                        : item.trajectory === "regression"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {item.prev.stage} ➔ {item.curr.stage} (
                    {item.trajectory === "progression"
                      ? language === "th"
                        ? "ลุกลาม"
                        : "Progression"
                      : item.trajectory === "regression"
                      ? language === "th"
                        ? "ยุบตัว"
                        : "Regression"
                      : language === "th"
                      ? "คงที่"
                      : "Stable"}
                    )
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Controls */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
          {/* Mode Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 w-full">
            <button
              type="button"
              onClick={() => {
                playClick();
                setViewMode("side-by-side");
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                viewMode === "side-by-side"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Split className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === "th" ? "เทียบเคียงคู่" : "Side-by-Side"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setViewMode("split-slider");
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                viewMode === "split-slider"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === "th" ? "สไลเดอร์รูด" : "Split Slider"}</span>
            </button>
          </div>

          {/* Toggle Annotation Overlay */}
          <button
            type="button"
            onClick={() => {
              playClick();
              setShowAnnotations(!showAnnotations);
            }}
            className={`p-2 rounded-xl border text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              showAnnotations
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}
            title="Toggle ROI Bounding Boxes"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trajectory Banner */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
          activeCase.trajectory === "progression"
            ? "bg-gradient-to-r from-rose-50 via-white to-amber-50/50 border-rose-200"
            : activeCase.trajectory === "regression"
            ? "bg-gradient-to-r from-emerald-50 via-white to-teal-50/50 border-emerald-200"
            : "bg-gradient-to-r from-amber-50 via-white to-slate-50 border-amber-200"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
              activeCase.trajectory === "progression"
                ? "bg-rose-600 shadow-rose-500/25"
                : activeCase.trajectory === "regression"
                ? "bg-emerald-600 shadow-emerald-500/25"
                : "bg-amber-600 shadow-amber-500/25"
            }`}
          >
            {activeCase.trajectory === "progression" ? (
              <TrendingUp className="w-6 h-6" />
            ) : activeCase.trajectory === "regression" ? (
              <TrendingDown className="w-6 h-6" />
            ) : (
              <Minus className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  activeCase.trajectory === "progression"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : activeCase.trajectory === "regression"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                }`}
              >
                {activeCase.trajectory === "progression"
                  ? t("compStatusProgression")
                  : activeCase.trajectory === "regression"
                  ? t("compStatusRegression")
                  : t("compStatusStable")}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Patient MRN: <strong className="text-slate-800">{activeCase.patientId}</strong>
              </span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm mt-1.5 font-semibold leading-relaxed">
              {language === "th" ? activeCase.clinicalNoteTh : activeCase.clinicalNoteEn}
            </p>
          </div>
        </div>

        {/* Quick Delta Metrics */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">TNM Shift</span>
            <span
              className={`block text-sm sm:text-base font-black ${
                stageDiff > 0 ? "text-rose-600" : stageDiff < 0 ? "text-emerald-600" : "text-slate-700"
              }`}
            >
              {prevRecord.stage} ➔ {currRecord.stage}
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Size Delta</span>
            <span
              className={`block text-sm sm:text-base font-black ${
                isGrowth ? "text-rose-600" : isRegression ? "text-emerald-600" : "text-slate-700"
              }`}
            >
              {isGrowth ? `+${sizeDiffPercent}%` : `${sizeDiffPercent}%`}
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">VI-RADS</span>
            <span className="block text-sm sm:text-base font-black text-indigo-700">
              {prevRecord.virads} ➔ {currRecord.virads}
            </span>
          </div>
        </div>
      </div>

      {/* Main Image Workstation View */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Previous Scan Panel */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t("compPreviousScan")}</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {prevRecord.date} • {prevRecord.substage}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={prevFileInputRef}
                  onChange={(e) => handleCustomUpload(e, "prev")}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => prevFileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1"
                  title="Upload custom baseline MRI"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </div>
            </div>

            {/* MRI Frame */}
            <div className="relative aspect-square w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center group">
              <img
                src={prevImgUrl}
                alt="Previous MRI scan"
                className="w-full h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white border border-white/10">
                Baseline MRI • {prevRecord.date}
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-emerald-400 border border-white/10">
                {prevRecord.stage} (Score: VI-RADS {prevRecord.virads})
              </div>
            </div>

            {/* Clinical Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Stage</span>
                <span className="block text-xs sm:text-sm font-black text-slate-900">{prevRecord.stage}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">VI-RADS</span>
                <span className="block text-xs sm:text-sm font-black text-indigo-600">
                  Category {prevRecord.virads}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Detrusor</span>
                <span className="block text-xs sm:text-sm font-black text-slate-800">{prevRecord.muscleStatus}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Dimension</span>
                <span className="block text-xs sm:text-sm font-black text-slate-900">
                  {prevRecord.lesionSize.width} mm
                </span>
              </div>
            </div>
          </div>

          {/* Current Scan Panel */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t("compCurrentScan")}</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {currRecord.date} • {currRecord.substage}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={currFileInputRef}
                  onChange={(e) => handleCustomUpload(e, "curr")}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => currFileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1"
                  title="Upload custom follow-up MRI"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </div>
            </div>

            {/* MRI Frame */}
            <div className="relative aspect-square w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center group">
              <img
                src={currImgUrl}
                alt="Current MRI scan"
                className="w-full h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white border border-white/10">
                Follow-up MRI • {currRecord.date}
              </div>
              <div
                className={`absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black border border-white/10 ${
                  currRecord.stage === "T1"
                    ? "text-emerald-400"
                    : currRecord.stage === "T2"
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {currRecord.stage} (Score: VI-RADS {currRecord.virads})
              </div>
            </div>

            {/* Clinical Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Stage</span>
                <span
                  className={`block text-xs sm:text-sm font-black ${
                    currRecord.stage === "T1"
                      ? "text-emerald-600"
                      : currRecord.stage === "T2"
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {currRecord.stage}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">VI-RADS</span>
                <span className="block text-xs sm:text-sm font-black text-indigo-600">
                  Category {currRecord.virads}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Detrusor</span>
                <span
                  className={`block text-xs sm:text-sm font-black ${
                    currRecord.muscleStatus === "Intact" ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {currRecord.muscleStatus}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Dimension</span>
                <span className="block text-xs sm:text-sm font-black text-slate-900">
                  {currRecord.lesionSize.width} mm
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Split-Slider Interactive Comparison Mode */
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {language === "th" ? "สไลเดอร์เปรียบเทียบรอยโรค (Split Comparison Slider)" : "Interactive Split-Screen Slider"}
              </h3>
              <p className="text-xs text-slate-500">
                {language === "th"
                  ? "เลื่อนแถบสไลเดอร์ซ้าย-ขวา เพื่อสังเกตการเปลี่ยนแปลงของขอบเขตเนื้องอกและความหนาของผนังกระเพาะปัสสาวะ"
                  : "Drag the slider handle horizontally to reveal morphological tissue transitions between baseline and follow-up scans"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {sliderPos.toFixed(0)}% Baseline / {(100 - sliderPos).toFixed(0)}% Follow-up
              </span>
            </div>
          </div>

          <div
            ref={sliderContainerRef}
            onMouseMove={(e) => isDraggingSlider && handleSliderMove(e.clientX)}
            onTouchMove={handleTouchMove}
            className="relative aspect-video sm:aspect-[21/9] max-h-[500px] w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl select-none cursor-ew-resize"
          >
            {/* Background Current Scan (Full) */}
            <img
              src={currImgUrl}
              alt="Follow-up scan"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400 border border-white/10">
              Follow-up: {currRecord.stage} ({currRecord.date})
            </div>

            {/* Foreground Baseline Scan (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={prevImgUrl}
                alt="Baseline scan"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ width: "100%", maxWidth: "none" }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 border border-white/10">
                Baseline: {prevRecord.stage} ({prevRecord.date})
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.8)]"
              style={{ left: `${sliderPos}%` }}
              onMouseDown={() => setIsDraggingSlider(true)}
              onTouchStart={() => setIsDraggingSlider(true)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white -translate-x-1/2 cursor-grab active:cursor-grabbing">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Guidance & Recommendation Plan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200/60">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{t("compClinicalAdvice")}</h3>
            <p className="text-xs text-slate-500">
              {language === "th"
                ? "แนวทางเวชปฏิบัติอ้างอิงตาม EAU & NCCN Guidelines 2026 สำหรับมะเร็งกระเพาะปัสสาวะ"
                : "Standard-of-Care recommendations adapted from EAU & NCCN 2026 Bladder Cancer Guidelines"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
              1. Surgical & Diagnostic Path
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currRecord.stage === "T1"
                ? "ทำการส่องกล้องตัดเนื้องอกซ้ำ (Re-TURBT) ภายใน 2–6 สัปดาห์ เพื่อยืนยันว่าไม่มีรอยโรคหลงเหลือในชั้นกล้ามเนื้อ"
                : "ประเมินระยะการแพร่กระจายด้วย CECT Chest/Abdomen/Pelvis ก่อนวางแผนผ่าตัด Radical Cystectomy ร่วมกับ Pelvic Lymphadenectomy"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
              2. Systemic & Adjuvant Therapy
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currRecord.stage === "T1"
                ? "พิจารณาให้ยา Intravesical BCG Induction (6 สัปดาห์) ตามด้วย Maintenance Course สำหรับ High-risk NMIBC"
                : "พิจารณาให้ Cisplatin-based Neoadjuvant Chemotherapy (NAC) 4 รอบเพื่อเพิ่ม Overall Survival"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
              3. Surveillance & Follow-up
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              นัดตรวจติดตามด้วย Multiparametric MRI (VI-RADS protocol) ร่วมกับ Cystoscopy ทุกๆ 3 เดือนในปีแรก เพื่อเฝ้าระวังการเกิดซ้ำ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
