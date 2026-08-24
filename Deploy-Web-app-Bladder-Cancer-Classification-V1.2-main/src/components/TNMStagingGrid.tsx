import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { TNMScene, ANATOMICAL_LAYERS } from "../3d/TNMScene";
import { 
  Layers, 
  MonitorPlay, 
  Eye, 
  RotateCw, 
  RotateCcw,
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  Scissors, 
  Flame, 
  Grid as GridIcon, 
  Crosshair, 
  X, 
  Gauge, 
  Sparkle, 
  Stethoscope, 
  Calculator,
  CheckCircle2,
  ExternalLink,
  Lock,
  Unlock,
  Compass
} from "lucide-react";
import { playClick, playStageSelect } from "../lib/sound";
import { useLanguage } from "../lib/i18n";

interface StageInfo {
  id: string;
  name: string;
  nameTh: string;
  category: "NMIBC" | "MIBC";
  desc: string;
  descTh: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  viradsScore: number;
  depthMm: string;
  detrusorIntegrity: number; // 0-100%
  treatment: string;
  treatmentTh: string;
  fiveYearSurvival: string;
  recurrenceRisk: string;
  recurrenceRiskTh: string;
  biopsyNote: string;
  biopsyNoteTh: string;
}

const STAGES: StageInfo[] = [
  { 
    id: "T1", 
    name: "Subepithelial Connective Tissue",
    nameTh: "ชั้นเนื้อเยื่อเกี่ยวพันใต้เยื่อบุผิว (Lamina Propria)",
    category: "NMIBC",
    desc: "Tumor invades the subepithelial connective tissue (lamina propria) but has not breached the underlying muscularis propria.", 
    descTh: "ก้อนเนื้องอกลุกลามเข้าสู่ชั้นเนื้อเยื่อเกี่ยวพันใต้เยื่อบุผิว (Lamina propria) แต่ยังไม่ทะลุเข้าสู่ชั้นกล้ามเนื้อกระเพาะปัสสาวะ (Muscularis propria)",
    color: "#10B981",
    badgeBg: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-700",
    viradsScore: 2,
    depthMm: "0.42 mm",
    detrusorIntegrity: 100,
    treatment: "Complete TURBT + Single post-op Intravesical Chemo + BCG Immunotherapy Maintenance",
    treatmentTh: "ผ่าตัดส่องกล้องขูดก้อนเนื้อ (TURBT) ให้หมด + ยาเคมีบำบัดหยอดกระเพาะปัสสาวะ 1 ครั้ง + ให้ภูมิคุ้มกันบำบัด BCG",
    fiveYearSurvival: "88% - 92%",
    recurrenceRisk: "Moderate (30-40%)",
    recurrenceRiskTh: "ปานกลาง (30-40%)",
    biopsyNote: "Detrusor muscle must be identifiable in resection base to confirm absence of T2 invasion.",
    biopsyNoteTh: "ต้องตรวจพบเส้นใยกล้ามเนื้อ Detrusor ในชิ้นเนื้อฐานรอยโรคเพื่อยืนยันว่าไม่มีการลุกลามเข้าชั้นกล้ามเนื้อ (T2)"
  },
  { 
    id: "T2", 
    name: "Muscularis Propria (Muscle Layer)",
    nameTh: "ชั้นกล้ามเนื้อกระเพาะปัสสาวะ (Detrusor Muscle)",
    category: "MIBC",
    desc: "Tumor invades the detrusor muscle layer of the bladder wall (T2a inner half, T2b outer half). Muscle-invasive disease confirmed.", 
    descTh: "ก้อนเนื้องอกลุกลามเข้าสู่ชั้นกล้ามเนื้อกระเพาะปัสสาวะ (T2a ครึ่งชั้นใน, T2b ครึ่งชั้นนอก) ยืนยันว่าเป็นมะเร็งชนิดลุกลามชั้นกล้ามเนื้อ (MIBC)",
    color: "#F59E0B",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-700",
    viradsScore: 4,
    depthMm: "1.18 mm",
    detrusorIntegrity: 45,
    treatment: "Neoadjuvant Cisplatin-based Chemotherapy followed by Radical Cystectomy with PLND or Tri-modality Therapy",
    treatmentTh: "ยาเคมีบำบัดกลุ่ม Cisplatin ก่อนผ่าตัด + ผ่าตัดตัดกระเพาะปัสสาวะและต่อมน้ำเหลืองออกทั้งหมด (Radical Cystectomy) หรือการรักษาผสมผสาน 3 วิธี",
    fiveYearSurvival: "63% - 70%",
    recurrenceRisk: "High (50-60%)",
    recurrenceRiskTh: "สูง (50-60%)",
    biopsyNote: "Full-thickness detrusor fascicle disruption observed with deep myocyte infiltration.",
    biopsyNoteTh: "พบการฉีกขาดของมัดกล้ามเนื้อ Detrusor ตลอดความหนาและมีเซลล์มะเร็งแทรกซึมลึก"
  },
  { 
    id: "T3", 
    name: "Perivesical Fat Tissue (Adventitia)",
    nameTh: "ชั้นไขมันรอบกระเพาะปัสสาวะ (Perivesical Fat)",
    category: "MIBC",
    desc: "Tumor extends beyond the muscularis propria into the perivesical adipose fat surrounding the bladder wall (T3a microscopic, T3b macroscopic).", 
    descTh: "ก้อนเนื้องอกทะลุผ่านชั้นกล้ามเนื้อออกไปยังชั้นไขมันรอบนอกกระเพาะปัสสาวะ (T3a ระดับจุลทรรศน์, T3b ระดับที่มองเห็นได้ชัดเจน)",
    color: "#F97316",
    badgeBg: "bg-orange-50 border-orange-200",
    badgeText: "text-orange-700",
    viradsScore: 5,
    depthMm: "2.35 mm",
    detrusorIntegrity: 0,
    treatment: "Systemic Neoadjuvant Chemotherapy + En-bloc Radical Cystoprostatectomy / Anterior Exenteration",
    treatmentTh: "ยาเคมีบำบัดทั่วร่างกายก่อนผ่าตัด + ผ่าตัดเอากระเพาะปัสสาวะและอวัยวะข้างเคียงออกทั้งหมดแบบ En-bloc",
    fiveYearSurvival: "46% - 52%",
    recurrenceRisk: "Very High (65-75%)",
    recurrenceRiskTh: "สูงมาก (65-75%)",
    biopsyNote: "Transmural perforation into extravesical fibro-fatty stroma.",
    biopsyNoteTh: "เนื้องอกทะลุผนังกระเพาะปัสสาวะเข้าสู่เนื้อเยื่อไขมันและผังผืดรอบนอกอย่างสมบูรณ์"
  },
  { 
    id: "T4", 
    name: "Adjacent Organs & Pelvic Wall",
    nameTh: "อวัยวะข้างเคียงและผนังเชิงกราน",
    category: "MIBC",
    desc: "Tumor directly invades adjacent prostate, seminal vesicles, uterus, vagina (T4a), or fixed pelvic/abdominal wall (T4b).", 
    descTh: "เนื้องอกลุกลามโดยตรงเข้าสู่อวัยวะข้างเคียง เช่น ต่อมลูกหมาก, ถุงพักอสุจิ, มดลูก, ช่องคลอด (T4a) หรือติดตรึงกับผนังเชิงกราน/หน้าท้อง (T4b)",
    color: "#EF4444",
    badgeBg: "bg-rose-50 border-rose-200",
    badgeText: "text-rose-700",
    viradsScore: 5,
    depthMm: "4.90 mm",
    detrusorIntegrity: 0,
    treatment: "Systemic Platinum Chemotherapy / Immune Checkpoint Inhibitors (Anti-PD-L1) + Palliative Radiation / Salvage",
    treatmentTh: "ยาเคมีบำบัดสูตรผสมแพลทินัม / ยาภูมิคุ้มกันบำบัด Checkpoint Inhibitor (Anti-PD-L1) + รังสีรักษาบรรเทาอาการ",
    fiveYearSurvival: "15% - 22%",
    recurrenceRisk: "Critical (>85%)",
    recurrenceRiskTh: "วิกฤต (>85%)",
    biopsyNote: "Direct visceral invasion into contiguous pelvic anatomical structures.",
    biopsyNoteTh: "พบการลุกลามโดยตรงเข้าสู่อวัยวะข้างเคียงในอุ้งเชิงกราน"
  },
];

export const TNMStagingGrid = () => {
  const { language, t } = useLanguage();
  const [activeStage, setActiveStage] = useState<string>("T1");
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [explode, setExplode] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<"cinematic" | "xray" | "vascular" | "thermal">("cinematic");
  const [cameraPreset, setCameraPreset] = useState<"iso" | "coronal" | "sagittal" | "top">("iso");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showLaser, setShowLaser] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showProbe, setShowProbe] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [showViradsCalc, setShowViradsCalc] = useState<boolean>(false);

  // VIRADS Calc State
  const [viradsT2WI, setViradsT2WI] = useState<number>(2);
  const [viradsDWI, setViradsDWI] = useState<number>(2);
  const [viradsDCE, setViradsDCE] = useState<number>(2);

  const calculatedVirads = Math.max(viradsT2WI, viradsDWI, viradsDCE);

  const handleStageChange = (stageId: string) => {
    playStageSelect(stageId);
    setActiveStage(stageId);
  };

  const currentStageInfo = STAGES.find(s => s.id === activeStage) || STAGES[0];
  const activeLayerData = ANATOMICAL_LAYERS.find(l => l.id === selectedLayer);

  return (
    <section id="staging" className="py-20 sm:py-24 px-4 sm:px-6 max-w-[90rem] mx-auto relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-50/40 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-800 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-4 shadow-sm">
          <MonitorPlay className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>{t("tnmBadge")}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          {language === 'th' ? (
            <>
              แบบจำลองกายวิภาค 3 มิติ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TNM Staging</span>
            </>
          ) : (
            <>
              Interactive 3D Staging <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Workstation</span>
            </>
          )}
        </h2>
        <p className="text-slate-600 text-[14px] sm:text-base leading-relaxed font-medium">
          {t("tnmDesc")}
        </p>

        {/* Academic Standard Link (User Request: TNM Classification URL) */}
        <div className="mt-4 flex items-center justify-center">
          <a
            href="https://staging.radiologyassistant.nl/abdomen/bladder/bladder-cancer-vi-rads"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-4 py-1.5 rounded-full border border-blue-200 transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'คู่มือมาตรฐานรังสีวิทยา: VI-RADS & TNM Classification (Radiology Assistant)' : 'Radiology Standard: VI-RADS & TNM Classification Guide (Radiology Assistant)'}</span>
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* 3D WORKSTATION CONSOLE (COL 8) */}
        <div className={`lg:col-span-8 flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between' : ''}`}>
          
          {/* Main 3D Canvas Container */}
          <div className="h-[560px] sm:h-[650px] bg-[#020617] rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_rgba(2,6,23,0.4)] border border-slate-800/80 relative cursor-grab active:cursor-grabbing flex flex-col justify-between group">
            
            {/* Top Toolbar / Workstation HUD Bar */}
            <div className="p-3 sm:p-5 flex flex-wrap items-center justify-between gap-2.5 z-20 pointer-events-auto bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent">
              
              {/* Stage & Telemetry Status Pill */}
              <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-900/90 backdrop-blur-xl px-3 sm:px-4 py-2 rounded-2xl border border-slate-700/60 shadow-xl">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full animate-ping" 
                    style={{ backgroundColor: currentStageInfo.color }} 
                  />
                  <span className="text-xs font-black tracking-widest text-white uppercase">
                    Stage {currentStageInfo.id}
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-slate-700" />
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentStageInfo.badgeBg} ${currentStageInfo.badgeText}`}>
                  {currentStageInfo.category}
                </span>
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'th' ? 'ความลึก:' : 'Depth:'} <span className="text-white font-mono">{currentStageInfo.depthMm}</span></span>
                </div>
              </div>

              {/* ROTATION & CAMERA CONTROLS (User Request: ปุ่มล็อก และ ปุ่มอิสระ) */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 backdrop-blur-xl p-1 sm:p-1.5 rounded-2xl border border-slate-700/60 shadow-xl">
                
                {/* Free Orbit Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setIsLocked(false);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 ${
                    !isLocked 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-400" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title={language === 'th' ? 'เปิดโหมดหมุนอิสระ 360 องศา (คลิก/สัมผัสแล้วลาก)' : 'Enable 360° free rotation (click/touch & drag)'}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{t("orbitFree")}</span>
                </button>

                {/* Lock View Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setIsLocked(true);
                    setAutoRotate(false);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 ${
                    isLocked 
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-400" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title={language === 'th' ? 'ล็อกมุมมองคงที่ เพื่อตรวจวัดระยะทางการแทรกซึม' : 'Lock viewpoint in current position'}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t("orbitLocked")}</span>
                </button>

                {/* Reset Angle Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setCameraPreset("iso");
                    setIsLocked(false);
                  }}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1"
                  title={t("resetAngle")}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden md:inline">{t("resetAngle")}</span>
                </button>

                <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

                {/* Auto Rotate Toggle */}
                <button
                  type="button"
                  title={language === 'th' ? 'เปิด/ปิด หมุนอัตโนมัติ' : 'Toggle auto-rotation'}
                  onClick={() => {
                    playClick();
                    setAutoRotate(!autoRotate);
                    if (!autoRotate) setIsLocked(false);
                  }}
                  className={`p-1.5 rounded-xl transition-all ${autoRotate ? "text-blue-400 bg-blue-950/60 border border-blue-500/30" : "text-slate-500 hover:text-white"}`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
                </button>

                {/* View Angle Presets */}
                <div className="hidden lg:flex items-center gap-1 pl-1 border-l border-slate-800">
                  {[
                    { id: "iso", label: "3D Iso" },
                    { id: "coronal", label: "Coronal" },
                    { id: "sagittal", label: "Sagittal" },
                    { id: "top", label: "Lumen" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        playClick();
                        setCameraPreset(v.id as any);
                        setIsLocked(false);
                      }}
                      className={`px-2 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        cameraPreset === v.id 
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Render Mode Switcher */}
                <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
                  {[
                    { id: "cinematic", icon: Sparkle, title: "Cinematic Tissue" },
                    { id: "xray", icon: Eye, title: "X-Ray Wireframe" },
                    { id: "vascular", icon: Flame, title: "Neo-Vascular Perfusion" },
                    { id: "thermal", icon: Gauge, title: "Thermal Infiltration" },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isCurrent = renderMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        title={mode.title}
                        onClick={() => {
                          playClick();
                          setRenderMode(mode.id as any);
                        }}
                        className={`p-1.5 rounded-xl transition-all duration-200 ${
                          isCurrent 
                            ? "bg-indigo-600 text-white shadow-md" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  title={t("fullscreen")}
                  onClick={() => {
                    playClick();
                    setIsFullscreen(!isFullscreen);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all ml-0.5"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Status notification badge on top right of viewport */}
            <div className="absolute top-4 right-4 sm:right-6 z-20 pointer-events-none transition-all">
              <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-xl border shadow-xl flex items-center gap-1.5 transition-all ${
                isLocked 
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-950/30' 
                  : 'bg-slate-900/80 text-blue-300 border-blue-500/30 shadow-blue-950/30'
              }`}>
                {isLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="whitespace-nowrap">{language === 'th' ? 'มุมมองถูกล็อก' : 'View Locked'}</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow shrink-0" />
                    <span className="whitespace-nowrap">{language === 'th' ? 'หมุนอิสระ 360°' : '360° Orbit'}</span>
                  </>
                )}
              </div>
            </div>

            {/* Middle 3D Viewport with Canvas */}
            <div className="flex-1 w-full h-full relative">
              <Canvas camera={{ position: [4.5, 3.5, 7], fov: 45 }}>
                <Suspense fallback={
                  <Html center>
                    <div className="flex flex-col items-center gap-3 bg-slate-950/90 backdrop-blur-xl px-8 py-5 rounded-3xl border border-white/10 text-white shadow-2xl">
                      <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300">
                        {language === 'th' ? 'กำลังประมวลผลโครงสร้าง 3 มิติ...' : 'Synthesizing 3D Tissue Matrix...'}
                      </span>
                    </div>
                  </Html>
                }>
                  <TNMScene 
                    activeStage={activeStage} 
                    selectedLayer={selectedLayer}
                    onSelectLayer={setSelectedLayer}
                    explode={explode}
                    renderMode={renderMode}
                    showGrid={showGrid}
                    showLaser={showLaser}
                    showProbe={showProbe}
                    autoRotate={autoRotate && !isLocked}
                    cameraPreset={cameraPreset}
                    isLocked={isLocked}
                  />
                  <OrbitControls 
                    enabled={!isLocked}
                    enableRotate={!isLocked}
                    enableZoom={true} 
                    enablePan={true}
                    enableDamping={true}
                    dampingFactor={0.08}
                    rotateSpeed={0.9}
                    minDistance={2.8}
                    maxDistance={22}
                    autoRotate={autoRotate && !isLocked}
                    autoRotateSpeed={1.2}
                  />
                </Suspense>
              </Canvas>

              {/* Floating Layer Details Card */}
              <AnimatePresence>
                {activeLayerData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute top-4 left-4 sm:left-6 z-30 max-w-xs sm:max-w-sm bg-slate-950/90 backdrop-blur-2xl p-5 rounded-3xl border border-blue-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400">
                          {activeLayerData.code} Layer Telemetry
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedLayer(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-black text-slate-100 mb-1">{activeLayerData.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4">{activeLayerData.desc}</p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Depth Range</span>
                        <span className="text-slate-200 font-mono font-bold">{activeLayerData.depth}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Thickness</span>
                        <span className="text-slate-200 font-mono font-bold">{activeLayerData.thicknessMm.toFixed(2)} mm</span>
                      </div>
                      <div className="mt-1 pt-1 border-t border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Elasticity</span>
                        <span className="text-blue-400 font-mono font-bold">{activeLayerData.elasticityKpa}</span>
                      </div>
                      <div className="mt-1 pt-1 border-t border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Cell Matrix</span>
                        <span className="text-indigo-300 font-mono text-[10px]">{activeLayerData.cellDensity}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Workstation HUD Controls */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 z-20 pointer-events-auto bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent border-t border-slate-800/40">
              
              {/* Explode Layers Slider & Quick Select Chips */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Layer Explode Slider */}
                <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-lg shrink-0">
                  <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{language === 'th' ? 'แยกชั้นเนื้อเยื่อ (Explode)' : 'Explode Layers'}</span>
                      <span className="text-blue-400 font-mono">{(explode * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05"
                      value={explode} 
                      onChange={(e) => setExplode(parseFloat(e.target.value))}
                      className="w-28 sm:w-36 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                {/* Layer Quick-Select Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
                  {ANATOMICAL_LAYERS.map((layer) => {
                    const isSelected = selectedLayer === layer.id;
                    return (
                      <button
                        key={layer.id}
                        onClick={() => {
                          playClick();
                          setSelectedLayer(isSelected ? null : layer.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                          isSelected 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400" 
                            : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                        <span>{layer.code}: {language === 'th' ? layer.nameTh || layer.name.split(" ")[0] : layer.name.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workstation Footer Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{language === 'th' ? 'แสดงผล 3D กายวิภาค: 60 FPS' : 'Pathology GPU Render: 60 FPS'}</span>
                  </span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span className="hidden sm:inline">VI-RADS Score: <span className="text-amber-400 font-bold">{currentStageInfo.viradsScore}/5</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      playClick();
                      setShowViradsCalc(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{language === 'th' ? 'คำนวณคะแนน VI-RADS' : 'VI-RADS Calculator'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      playClick();
                      setShowSimulator(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold hover:underline"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{language === 'th' ? 'จำลองการตัดชิ้นเนื้อ TURBT' : 'TURBT Resection Simulator'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE CLINICAL INTELLIGENCE PANEL (COL 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-6 sm:p-7 rounded-[2.5rem] border border-slate-200/80 shadow-[0_10px_30px_rgb(0,0,0,0.04)] flex flex-col gap-5">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {language === 'th' ? 'ตัวเลือกระยะทางคลินิก' : 'Clinical Staging Selector'}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {language === 'th' ? 'ข้อมูลระยะ TNM' : 'TNM Stage Details'}
                </h3>
              </div>
              <span className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                {activeStage}
              </span>
            </div>

            {/* Stage Selector Grid */}
            <div className="grid grid-cols-4 gap-2">
              {STAGES.map((stage) => {
                const isActive = activeStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => handleStageChange(stage.id)}
                    className={`py-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                      isActive 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="font-black text-lg tracking-tight" style={{ color: isActive ? '#60A5FA' : stage.color }}>
                      {stage.id}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      {stage.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Deep Insights */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {language === 'th' ? 'เป้าหมายกายวิภาคที่ถูกลุกลาม' : 'Anatomical Invasion Target'}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">
                  {language === 'th' ? currentStageInfo.nameTh : currentStageInfo.name}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  {language === 'th' ? currentStageInfo.descTh : currentStageInfo.desc}
                </p>
              </div>

              {/* Metric Breakdown Bars */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {language === 'th' ? 'ความสมบูรณ์ของกล้ามเนื้อ' : 'Detrusor Integrity'}
                  </span>
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 mb-1.5">
                    <span>{currentStageInfo.detrusorIntegrity}%</span>
                    <span className={currentStageInfo.detrusorIntegrity > 50 ? "text-emerald-600" : "text-rose-600"}>
                      {currentStageInfo.detrusorIntegrity > 50 
                        ? (language === 'th' ? 'ปกติ' : 'Intact') 
                        : (language === 'th' ? 'ถูกทำลาย' : 'Breached')}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${currentStageInfo.detrusorIntegrity}%`,
                        backgroundColor: currentStageInfo.detrusorIntegrity > 50 ? '#10B981' : '#EF4444' 
                      }} 
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {language === 'th' ? 'อัตรารอดชีวิต 5 ปี' : '5-Yr Overall Survival'}
                  </span>
                  <div className="text-xs font-extrabold text-slate-900 mb-1">
                    {currentStageInfo.fiveYearSurvival}
                  </div>
                  <span className="text-[10px] font-bold text-blue-600">AJCC 8th Edition</span>
                </div>
              </div>

              {/* Clinical Protocol Guidance */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <Stethoscope className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'th' ? 'แนวทางการรักษาที่แนะนำ (Clinical Protocol)' : 'Recommended Treatment Protocol'}</span>
                </div>
                <p className="text-indigo-950 text-xs leading-relaxed font-medium">
                  {language === 'th' ? currentStageInfo.treatmentTh : currentStageInfo.treatment}
                </p>
              </div>

              {/* Biopsy Validation Note */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-amber-900 leading-relaxed">
                  {language === 'th' ? currentStageInfo.biopsyNoteTh : currentStageInfo.biopsyNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VI-RADS CALCULATOR MODAL */}
      <AnimatePresence>
        {showViradsCalc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Multiparametric MRI</span>
                    <h3 className="text-xl font-extrabold text-slate-900">VI-RADS Score Calculator</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setShowViradsCalc(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3 MRI Sequences Scoring */}
              <div className="flex flex-col gap-4">
                {/* T2WI */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">T2-Weighted Imaging (T2WI)</span>
                    <span className="text-xs font-black text-indigo-600">Score {viradsT2WI}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={viradsT2WI}
                    onChange={(e) => setViradsT2WI(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1: Intact Low-SI line</span>
                    <span>3: Equivocal</span>
                    <span>5: Definite muscle breach</span>
                  </div>
                </div>

                {/* DWI */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Diffusion-Weighted Imaging (DWI)</span>
                    <span className="text-xs font-black text-indigo-600">Score {viradsDWI}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={viradsDWI}
                    onChange={(e) => setViradsDWI(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1: Hyper-intense stalk</span>
                    <span>3: High SI reaches muscle</span>
                    <span>5: Extravesical spread</span>
                  </div>
                </div>

                {/* DCE */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Dynamic Contrast Enhancement (DCE)</span>
                    <span className="text-xs font-black text-indigo-600">Score {viradsDCE}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={viradsDCE}
                    onChange={(e) => setViradsDCE(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1: Submucosal enhancement</span>
                    <span>3: Focal muscle blush</span>
                    <span>5: Gross fat enhancement</span>
                  </div>
                </div>

                {/* Final VI-RADS Result Card */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Final Composite VI-RADS</span>
                    <h4 className="text-2xl font-black text-white">Score {calculatedVirads} / 5</h4>
                    <span className="text-xs text-blue-300 font-medium">
                      {calculatedVirads <= 2 ? "Low Risk (<15% Muscle Invasion)" : calculatedVirads === 3 ? "Intermediate Risk (Equivocal)" : "High Risk (>80% Muscle Invasive)"}
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xl font-black text-indigo-300">
                    VI-{calculatedVirads}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href="https://staging.radiologyassistant.nl/abdomen/bladder/bladder-cancer-vi-rads"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                >
                  <span>Radiology Assistant VI-RADS Guidelines</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setShowViradsCalc(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg"
                >
                  Apply Score
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SURGICAL RESECTION SIMULATOR MODAL */}
      <AnimatePresence>
        {showSimulator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Surgical Intelligence</span>
                    <h3 className="text-xl font-extrabold text-slate-900">TURBT Resection Margin Simulator</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSimulator(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Simulating Resection on:</span>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full text-white bg-slate-900">
                    Stage {currentStageInfo.id} ({currentStageInfo.category})
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-blue-300 font-bold uppercase tracking-wider">
                    <span>Resection Feasibility Index</span>
                    <span>{currentStageInfo.id === "T1" ? "100% Curative Intent" : currentStageInfo.id === "T2" ? "Diagnostic Only (Bimanual)" : "Non-Resectable via Endoscopy"}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full rounded-full transition-all duration-700" 
                      style={{ 
                        width: currentStageInfo.id === "T1" ? "95%" : currentStageInfo.id === "T2" ? "50%" : "15%",
                        backgroundColor: currentStageInfo.id === "T1" ? "#10B981" : currentStageInfo.id === "T2" ? "#F59E0B" : "#EF4444"
                      }} 
                    />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1">
                    {currentStageInfo.id === "T1" 
                      ? "Complete transurethral resection of bladder tumor (TURBT) with muscle in the specimen yields clear surgical margins. Intravesical maintenance recommended."
                      : currentStageInfo.id === "T2" 
                      ? "TURBT can debulk tumor but cannot eradicate deep detrusor invasion. Definitive radical cystectomy or chemoradiotherapy indicated."
                      : "Transurethral resection carries severe risk of bladder perforation into the perivesical space. Systemic therapy required."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowSimulator(false)}
                  className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg"
                >
                  Close Simulator
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
