import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'th' | 'en';

interface TranslationDictionary {
  [key: string]: {
    th: string;
    en: string;
  };
}

export const translations: TranslationDictionary = {
  // Navbar
  appTitle: {
    th: "ระบบ AI ตรวจจับและประเมินระยะมะเร็งกระเพาะปัสสาวะ",
    en: "Bladder Cancer AI Detection & TNM Staging System"
  },
  appSubtitle: {
    th: "สถาปัตยกรรมโครงข่ายประสาทเทียม YOLOv11 + ResNet ร่วมกับเกณฑ์ VI-RADS",
    en: "Multiparametric YOLOv11 + ResNet Deep Learning Platform"
  },
  navHero: {
    th: "หน้าแรก",
    en: "Overview"
  },
  navDetector: {
    th: "ระบบวิเคราะห์ภาพ MRI",
    en: "MRI Analysis"
  },
  navTNM: {
    th: "แบบจำลอง 3 มิติ TNM",
    en: "3D TNM Staging"
  },
  navAtlas: {
    th: "แผนภาพกายวิภาค",
    en: "Anatomy Atlas"
  },
  navSupervisors: {
    th: "คณะผู้วิจัยและที่ปรึกษา",
    en: "Research Team"
  },
  soundOn: {
    th: "เสียงแจ้งเตือน: เปิด",
    en: "Audio: ON"
  },
  soundOff: {
    th: "เสียงแจ้งเตือน: ปิด",
    en: "Audio: MUTE"
  },

  // Hero Section
  heroBadge: {
    th: "โครงการวิจัยระบบปัญญาประดิษฐ์ทางการแพทย์ • มหาวิทยาลัยพะเยา",
    en: "Clinical-Grade Multi-Parametric Diagnostic Platform"
  },
  heroTitle1: {
    th: "ระบบ AI ตรวจจับมะเร็งกระเพาะปัสสาวะ",
    en: "Deep Learning AI for Bladder Cancer"
  },
  heroTitle2: {
    th: "และการจำแนกระยะการลุกลาม TNM Staging",
    en: "Detection & TNM Staging Classification"
  },
  heroDesc: {
    th: "ผสานขีดความสามารถของ YOLOv11 ในการระบุตำแหน่งรอยโรค และ ResNet ในการวิเคราะห์ระดับความลึกของการลุกลามชั้นกล้ามเนื้อกระเพาะปัสสาวะ (Detrusor Muscle) พร้อมการจำลองกายวิภาค 3 มิติ และการประเมินตามเกณฑ์มาตรฐานสากล VI-RADS",
    en: "Integrating YOLOv11 spatial lesion localization with ResNet deep detrusor muscle invasion assessment, interactive 3D biomolecular tissue simulation, and clinical VI-RADS standard stratification."
  },
  heroCtaStart: {
    th: "เริ่มตรวจวิเคราะห์ภาพ MRI",
    en: "Start MRI Diagnosis"
  },
  heroCta3D: {
    th: "เปิดห้องทดลองกายวิภาค 3 มิติ",
    en: "Open 3D Anatomy Workstation"
  },
  statAccuracy: {
    th: "ความแม่นยำรวมของโมเดล (Overall Accuracy)",
    en: "Overall Diagnostic Accuracy"
  },
  statSensitivity: {
    th: "ความไวในการตรวจจับการลุกลามกล้ามเนื้อ (Sensitivity)",
    en: "Muscle-Invasion Sensitivity"
  },
  statProcessing: {
    th: "ความเร็วเฉลี่ยในการประมวลผลต่อภาพ",
    en: "Inference Latency"
  },
  statValidation: {
    th: "ชุดข้อมูลทดสอบทางคลินิกอ้างอิง",
    en: "Clinical Validation Cohort"
  },

  // 3D Workstation & Controls
  workstationTitle: {
    th: "ห้องปฏิบัติการกายวิภาคศาสตร์ 3 มิติและการประเมินระยะ TNM",
    en: "Interactive 3D Tissue Matrix & TNM Staging Workstation"
  },
  workstationSubtitle: {
    th: "สำรวจระดับการแทรกซึมของก้อนเนื้อผ่านผนังกระเพาะปัสสาวะทั้ง 4 ชั้น พร้อมระบบควบคุมมุมมองและการวัดค่าทางคลินิก",
    en: "Explore tumor invasion depth through all 4 anatomical bladder layers with 360° free orbit and lock view controls"
  },
  orbitFree: {
    th: "โหมดหมุนอิสระ 360°",
    en: "360° Free Orbit"
  },
  orbitLocked: {
    th: "ล็อกมุมมองคงที่",
    en: "View Locked"
  },
  orbitUnlockedBadge: {
    th: "โหมดหมุนอิสระ (คลิกลากหรือสัมผัสเพื่อปรับมุมมอง)",
    en: "Free Orbit Active (Click & Drag to Rotate)"
  },
  orbitLockedBadge: {
    th: "ล็อกมุมมองคงที่ (สำหรับการวัดขนาดและระยะ)",
    en: "View Locked (Fixed Angle for Measurement)"
  },
  btnLockView: {
    th: "ล็อกมุมมอง",
    en: "Lock View"
  },
  btnFreeOrbit: {
    th: "หมุนอิสระ 360°",
    en: "Free Orbit"
  },
  btnResetAngle: {
    th: "คืนค่ามุมมองเดิม",
    en: "Reset Angle"
  },
  btnAutoRotate: {
    th: "หมุนอัตโนมัติ",
    en: "Auto Rotate"
  },
  viewIsometric: {
    th: "มุมมอง 3 มิติรอบด้าน (Isometric)",
    en: "3D Isometric View"
  },
  viewCoronal: {
    th: "ระนาบด้านหน้า (Coronal Plane)",
    en: "Coronal Front Plane"
  },
  viewSagittal: {
    th: "ระนาบด้านข้าง (Sagittal Plane)",
    en: "Sagittal Side Plane"
  },
  viewTop: {
    th: "ระนาบตัดขวางด้านบน (Axial View)",
    en: "Top Axial View"
  },
  modeTissue: {
    th: "โครงสร้างเนื้อเยื่อจริง",
    en: "Bio-Tissue"
  },
  modeXray: {
    th: "รังสีเอกซ์โปร่งแสง",
    en: "X-Ray Glass"
  },
  modePerfusion: {
    th: "หลอดเลือดและการไหลเวียน",
    en: "Vascular Perfusion"
  },
  modeThermal: {
    th: "การกระจายตัวของความร้อน",
    en: "Thermal Infiltration"
  },
  explodeLayers: {
    th: "แยกชั้นเนื้อเยื่อ (Explode View)",
    en: "Explode Tissue Layers"
  },
  laserScanner: {
    th: "เลเซอร์สแกนเนอร์",
    en: "Laser Scanner"
  },
  depthProbe: {
    th: "โพรบวัดระดับความลึก",
    en: "Depth Probe"
  },
  gridGuide: {
    th: "เส้นพิกัดอ้างอิง",
    en: "Grid Coordinate"
  },
  viradsCalcBtn: {
    th: "เครื่องคำนวณคะแนน VI-RADS",
    en: "VI-RADS Score Calculator"
  },
  turbtSimBtn: {
    th: "จำลองการผ่าตัดส่องกล้อง TURBT",
    en: "TURBT Resection Simulator"
  },

  // TNM Stage details
  stageSelectorTitle: {
    th: "เลือกระยะ TNM เพื่อดูการลุกลามและแนวทางการรักษา",
    en: "Clinical Staging Selector"
  },
  stageT1Title: {
    th: "ระยะ T1 (ยังไม่ลุกลามถึงชั้นกล้ามเนื้อ - NMIBC)",
    en: "Stage T1 (Non-Muscle Invasive)"
  },
  stageT2Title: {
    th: "ระยะ T2 (ลุกลามเข้าสู่ชั้นกล้ามเนื้อ - MIBC)",
    en: "Stage T2 (Muscle Invasive Bladder Cancer)"
  },
  stageT3Title: {
    th: "ระยะ T3 (ลุกลามสู่ชั้นไขมันรอบนอก - Perivesical Fat)",
    en: "Stage T3 (Perivesical Fat Infiltration)"
  },
  stageT4Title: {
    th: "ระยะ T4 (ลุกลามสู่อวัยวะข้างเคียงในอุ้งเชิงกราน)",
    en: "Stage T4 (Adjacent Pelvic Organ Invasion)"
  },
  invasionDepth: {
    th: "ระดับความลึกของการลุกลาม",
    en: "Invasion Depth"
  },
  clinicalManagement: {
    th: "แนวทางการรักษาตามมาตรฐานสากล (Clinical Guidelines)",
    en: "Clinical Management & Guidelines"
  },
  prognosis: {
    th: "อัตราการรอดชีวิตสัมพัทธ์ 5 ปี",
    en: "5-Year Relative Survival"
  },
  viradsScore: {
    th: "ระดับความเสี่ยงตามเกณฑ์ VI-RADS",
    en: "VI-RADS Risk Score"
  },

  // MRI Detector Section
  mriDetectorTitle: {
    th: "ระบบ AI ตรวจวิเคราะห์ภาพถ่าย MRI หลายพารามิเตอร์",
    en: "Multiparametric MRI AI Inference Engine"
  },
  mriDetectorSubtitle: {
    th: "อัปโหลดภาพถ่าย MRI (T2WI / DWI / ADC) หรือคลิกเลือกเคสตัวอย่างอ้างอิงเพื่อประมวลผลทันที",
    en: "Upload multiparametric MRI scans (T2WI / DWI / ADC) or select clinical benchmark scans for instant evaluation"
  },
  quickBenchmarkTitle: {
    th: "เคสตัวอย่างภาพสแกนอ้างอิงทางคลินิก (Clinical Reference Cases):",
    en: "Clinical Benchmark Reference Cases (1-Click Load):"
  },
  uploadTitle: {
    th: "ลากและวางไฟล์ภาพ MRI หรือเลือกโฟลเดอร์ผู้ป่วย",
    en: "Drag & Drop MRI Slices or Patient Folder"
  },
  uploadSubtitle: {
    th: "รองรับไฟล์ภาพ DICOM (.dcm), PNG, JPG และ TIFF ประมวลผลแบบชุดข้อมูลพร้อมกันได้",
    en: "Supports JPEG, PNG, TIFF, DICOM (.dcm) series. Multi-threaded batch evaluation."
  },
  selectSlices: {
    th: "เลือกไฟล์ภาพ MRI",
    en: "Select Slices"
  },
  uploadFolder: {
    th: "อัปโหลดทั้งโฟลเดอร์",
    en: "Upload Patient Folder"
  },
  uploadDropText: {
    th: "ลากไฟล์ภาพ MRI มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์",
    en: "Drag & drop MRI DICOM/PNG/JPG or click to browse"
  },
  uploadSupportText: {
    th: "รองรับไฟล์ DICOM, PNG, JPG (ความละเอียดแนะนำ ≥ 512x512 พิกเซล)",
    en: "Supports DICOM, PNG, JPG, NIfTI (Recommended ≥ 512x512 resolution)"
  },
  runInferenceBtn: {
    th: "เริ่มประมวลผลการจำแนกระยะด้วย AI",
    en: "Execute Deep Learning Inference"
  },
  analyzingText: {
    th: "กำลังประมวลผลภาพด้วยโมเดล YOLOv11 + ResNet...",
    en: "Processing scan via YOLOv11 + ResNet-101 Pipeline..."
  },
  inferenceResultsTitle: {
    th: "สรุปผลการวิเคราะห์ทางรังสีวิทยา (Radiological Summary)",
    en: "Radiology Diagnostic Summary & Report"
  },
  detectedStage: {
    th: "ระยะ TNM ที่โมเดลตรวจพบ",
    en: "Predicted TNM Stage"
  },
  confidenceScore: {
    th: "ความเชื่อมั่นของโมเดล (Confidence)",
    en: "Model Confidence Score"
  },
  filterStandard: {
    th: "ภาพดั้งเดิม (Standard)",
    en: "Standard"
  },
  filterContrast: {
    th: "เน้นคอนทราสต์เนื้อเยื่อ",
    en: "Soft Tissue Contrast"
  },
  filterInvert: {
    th: "กลับสีโทนเอกซเรย์",
    en: "Bone/Invert"
  },
  toggleBox: {
    th: "แสดงกรอบระบุตำแหน่ง (ROI)",
    en: "Toggle Bounding Box"
  },
  printReportBtn: {
    th: "พิมพ์รายงานสรุปผลทางการแพทย์",
    en: "Export Clinical Diagnostic Report"
  },

  // Reference Atlas
  atlasTitle: {
    th: "แผนภาพกายวิภาคศาสตร์และการจำแนกระยะ TNM",
    en: "Clinical Reference Atlas & TNM Hierarchy"
  },
  atlasSubtitle: {
    th: "โครงสร้างกายวิภาคของผนังกระเพาะปัสสาวะและการลุกลามตามมาตรฐานสากล",
    en: "Standard anatomical stratification of the urinary bladder wall & international staging classification"
  },
  atlasReferenceLink: {
    th: "ดูคู่มือมาตรฐาน Radiology Assistant VI-RADS ฉบับสมบูรณ์",
    en: "View Full Radiology Assistant VI-RADS Guide"
  },

  // Team
  teamTitle: {
    th: "คณะผู้วิจัยและอาจารย์ที่ปรึกษาโครงการ",
    en: "Research Team & Project Advisors"
  },
  teamSubtitle: {
    th: "ความร่วมมือทางวิชาการและการแพทย์ มหาวิทยาลัยพะเยา",
    en: "AI system developed under academic collaboration and medical clinical supervision"
  },
  advisorLabel: {
    th: "อาจารย์ที่ปรึกษาโครงการ",
    en: "Project Advisor"
  },
  researcherLabel: {
    th: "ผู้วิจัยและพัฒนาระบบ",
    en: "Principal Investigator & Developer"
  },

  // Footer
  footerDisclaimer: {
    th: "ระบบนี้พัฒนาขึ้นเพื่อการวิจัยทางวิชาการและการสนับสนุนการตัดสินใจทางคลินิก (Clinical Decision Support) ผลการวินิจฉัยต้องได้รับการยืนยันโดยแพทย์ผู้เชี่ยวชาญด้านรังสีวิทยาหรือศัลยแพทย์ระบบทางเดินปัสสาวะก่อนการรักษา",
    en: "This system is engineered for academic research and clinical decision support. Diagnostic outputs must be correlated with histopathological findings and validated by certified radiologists or urologists prior to clinical intervention."
  },
  footerRights: {
    th: "สงวนลิขสิทธิ์ พ.ศ. 2569 โครงการวิจัยระบบ AI จำแนกระยะมะเร็งกระเพาะปัสสาวะ มหาวิทยาลัยพะเยา",
    en: "© 2026 Bladder Cancer AI Research Initiative. All rights reserved."
  },

  // Doctor Login Portal
  loginTitle: {
    th: "ระบบเข้าสู่ระบบแพทย์และผู้เชี่ยวชาญ",
    en: "Physician & Specialist Clinical Portal"
  },
  loginSubtitle: {
    th: "BladderAI Medical Workstation • ระบบสนับสนุนการตัดสินใจทางคลินิก",
    en: "BladderAI Medical Workstation • Clinical Decision Support System"
  },
  loginDoctorID: {
    th: "รหัสประจำตัวแพทย์ (Doctor ID / Username)",
    en: "Doctor ID / Username"
  },
  loginPassword: {
    th: "รหัสผ่าน (Password)",
    en: "Password"
  },
  loginHospital: {
    th: "หน่วยงาน / โรงพยาบาล",
    en: "Department / Hospital Center"
  },
  loginBtn: {
    th: "เข้าสู่ระบบเวิร์กสเตชัน",
    en: "Sign In to Medical Workstation"
  },
  loginDemoBtn: {
    th: "เข้าใช้งานด้วยบัญชีแพทย์ทดสอบ (1-Click Demo)",
    en: "1-Click Demo Sign In (admin)"
  },
  loginBackHome: {
    th: "กลับสู่หน้าหลัก",
    en: "Back to Home Overview"
  },
  loginSecureNote: {
    th: "ระบบเชื่อมต่อผ่านการเข้ารหัส 256-Bit SSL และสอดคล้องตามมาตรฐานความปลอดภัยข้อมูลสุขภาพ HIPAA",
    en: "Protected with 256-Bit SSL encryption & compliant with HIPAA healthcare data standards"
  },

  // Dashboard & Navigation
  dashWorkstation: {
    th: "ศูนย์ปฏิบัติการวินิจฉัยมะเร็งกระเพาะปัสสาวะ",
    en: "BladderAI Medical Workstation"
  },
  dashTabAnalysis: {
    th: "วิเคราะห์ภาพ MRI",
    en: "MRI Scan Analysis"
  },
  dashTabComparison: {
    th: "เปรียบเทียบการวินิจฉัย",
    en: "Diagnosis Comparison"
  },
  dashTabAtlas: {
    th: "แบบจำลอง 3 มิติ & กายวิภาค",
    en: "3D Staging & Atlas"
  },
  dashOnlineStatus: {
    th: "โมเดล AI (YOLOv11+ResNet) พร้อมใช้งาน",
    en: "AI Engine Online (YOLOv11+ResNet)"
  },
  dashDoctorRole: {
    th: "แพทย์ผู้เชี่ยวชาญระบบทางเดินปัสสาวะ",
    en: "Urologist & Clinical Oncologist"
  },
  dashHospitalName: {
    th: "ศูนย์การแพทย์มหาวิทยาลัยพะเยา",
    en: "University of Phayao Medical Center"
  },
  dashSignOut: {
    th: "ออกจากระบบแพทย์",
    en: "Sign Out"
  },

  // Diagnosis Comparison Module
  compHeaderTitle: {
    th: "ระบบเปรียบเทียบผลการวินิจฉัย MRI ติดตามระยะโรค",
    en: "Longitudinal MRI Staging & Progression Comparison"
  },
  compHeaderSubtitle: {
    th: "เปรียบเทียบภาพถ่าย MRI ครั้งก่อนหน้ากับครั้งปัจจุบัน เพื่อประเมินการเปลี่ยนแปลงของระยะ TNM, การลุกลามชั้นกล้ามเนื้อ และการตอบสนองต่อการรักษา",
    en: "Compare baseline and follow-up MRI scans to quantify tumor trajectory, detrusor muscle invasion, and therapeutic response"
  },
  compPresetCases: {
    th: "เลือกชุดเคสตัวอย่างทางคลินิก:",
    en: "Select Clinical Case Study:"
  },
  compPreviousScan: {
    th: "การวินิจฉัยครั้งก่อน (Previous / Baseline Scan)",
    en: "Previous / Baseline Diagnostic Scan"
  },
  compCurrentScan: {
    th: "การวินิจฉัยครั้งปัจจุบัน (Current / Follow-up Scan)",
    en: "Current / Follow-up Diagnostic Scan"
  },
  compExamDate: {
    th: "วันที่ตรวจ MRI",
    en: "Scan Date"
  },
  compTnmStage: {
    th: "ระยะ TNM",
    en: "TNM Stage"
  },
  compViradsScore: {
    th: "คะแนน VI-RADS",
    en: "VI-RADS Score"
  },
  compMuscleStatus: {
    th: "สถานะชั้นกล้ามเนื้อ (Detrusor)",
    en: "Detrusor Muscle Status"
  },
  compLesionSize: {
    th: "ขนาดรอยโรค (Lesion Dimension)",
    en: "Lesion Dimension"
  },
  compSummaryHeader: {
    th: "สรุปการประเมินการเปลี่ยนแปลงทางคลินิก (Progression Trajectory)",
    en: "Clinical Progression & Trajectory Assessment"
  },
  compStatusProgression: {
    th: "มีการลุกลามของโรคเพิ่มขึ้น (Disease Progression)",
    en: "Disease Progression (Advancing Stage)"
  },
  compStatusRegression: {
    th: "ตอบสนองต่อการรักษา ก้อนเนื้อยุบตัว (Tumor Regression)",
    en: "Tumor Regression (Treatment Response)"
  },
  compStatusStable: {
    th: "รอยโรคคงที่ ไม่พบการเปลี่ยนแปลงชัดเจน (Stable Disease)",
    en: "Stable Disease (No Significant Change)"
  },
  compViewSideBySide: {
    th: "แสดงคู่กัน (Side-by-Side)",
    en: "Side-by-Side View"
  },
  compViewSplitSlider: {
    th: "สไลเดอร์เปรียบเทียบ (Split-Slider Diff)",
    en: "Split-Slider Diff"
  },
  compViewHeatmap: {
    th: "แผนที่ความต่าง (Delta Heatmap)",
    en: "Delta Heatmap"
  },
  compClinicalAdvice: {
    th: "ข้อเสนอแนะทางคลินิกและแผนการดูแลรักษา (Clinical Guidance)",
    en: "Clinical Guidance & Multidisciplinary Action Plan"
  },
  compExportReport: {
    th: "พิมพ์รายงานเปรียบเทียบทางการแพทย์",
    en: "Export Comparison Report"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return (saved === 'th' || saved === 'en') ? saved : 'th';
    } catch {
      return 'th';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof typeof translations): string => {
    const item = translations[key];
    if (!item) return String(key);
    return item[language] || item.en || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
