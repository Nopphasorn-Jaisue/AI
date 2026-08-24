import { motion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { HeroScene } from "../3d/HeroScene";
import { ArrowRight, Sparkles, ShieldCheck, Layers, Activity, Eye, RotateCw, CheckCircle2 } from "lucide-react";
import { playClick } from "../lib/sound";
import { useLanguage } from "../lib/i18n";

export const Hero = () => {
  const { language, t } = useLanguage();

  return (
    <header id="home" className="relative pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Refined ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] opacity-70 pointer-events-none -z-10 flex justify-center">
        <div className="absolute top-10 w-[600px] h-[320px] bg-blue-500/15 blur-[120px] rounded-full" />
        <div className="absolute top-32 w-[450px] h-[240px] bg-indigo-500/15 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column Text & Controls */}
        <motion.div
          initial={{ x: -25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          {/* Institutional / Academic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/10 text-[10px] sm:text-[11px] font-bold tracking-wide mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="whitespace-nowrap">{t("heroBadge")}</span>
          </div>

          {/* Main Title with responsive sizing */}
          <h1 className="text-2xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-extrabold text-slate-900 leading-[1.2] tracking-tight mb-4 sm:mb-6">
            {language === 'th' ? (
              <>
                <span className="block">ระบบ AI ตรวจจับมะเร็งกระเพาะปัสสาวะ</span>
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900">
                  และการประเมินระยะการลุกลาม TNM Staging
                </span>
              </>
            ) : (
              <>
                <span className="block">Deep Learning AI Platform for</span>
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900">
                  Bladder Cancer TNM Staging
                </span>
              </>
            )}
          </h1>

          {/* Academic & Clinical Description */}
          <p className="text-[14px] sm:text-[16px] text-slate-600 mb-6 sm:mb-8 max-w-xl leading-relaxed font-normal">
            {t("heroDesc")}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-8 sm:mb-10 w-full sm:w-auto">
            <a
              href="#prediction"
              onClick={playClick}
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[13px] sm:text-[14px] font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all duration-300 active:scale-95 border border-white/20 whitespace-nowrap text-center"
            >
              <span>{t("heroCtaStart")}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#staging"
              onClick={playClick}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 hover:border-blue-300 text-[13px] sm:text-[14px] font-bold px-5 sm:px-7 py-3.5 sm:py-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap text-center"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>{t("heroCta3D")}</span>
            </a>
          </div>

          {/* Clinical Telemetry Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg pt-5 sm:pt-6 border-t border-slate-200/80">
            <div className="flex flex-col gap-0.5 sm:gap-1 p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{language === 'th' ? 'การประเมินระยะ' : 'Staging'}</span>
              </span>
              <span className="text-[11.5px] sm:text-[14px] font-black text-slate-900 truncate">T1 – T4 Depth</span>
            </div>
            <div className="flex flex-col gap-0.5 sm:gap-1 p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
                <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{language === 'th' ? 'สถาปัตยกรรม' : 'Engine'}</span>
              </span>
              <span className="text-[11.5px] sm:text-[14px] font-black text-slate-900 truncate">YOLO+ResNet</span>
            </div>
            <div className="flex flex-col gap-0.5 sm:gap-1 p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 truncate">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{language === 'th' ? 'มาตรฐาน' : 'Protocol'}</span>
              </span>
              <span className="text-[11.5px] sm:text-[14px] font-black text-slate-900 truncate">VI-RADS</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column 3D Hologram Terminal */}
        <motion.div
          initial={{ x: 25, opacity: 0, scale: 0.96 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 h-[340px] sm:h-[420px] lg:h-[480px] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(2,6,23,0.35)] border border-slate-800 relative flex items-center justify-center group bg-[#020617]"
        >
          {/* Inner ambient gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-transparent to-indigo-950/20 pointer-events-none" />

          <Canvas camera={{ position: [0, 0, 4.2] }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[10, 10, 5]} intensity={2.0} />
            <pointLight position={[-10, -10, -5]} intensity={0.8} color="#38bdf8" />
            <Float speed={2.2} rotationIntensity={1.0} floatIntensity={1.0}>
              <HeroScene />
            </Float>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} enablePan={false} />
          </Canvas>

          {/* Top HUD Tag */}
          <div className="absolute top-3 sm:top-5 left-3 sm:left-5 bg-slate-900/90 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9.5px] sm:text-[11px] font-bold tracking-wider uppercase text-white border border-white/10 flex items-center gap-1.5 sm:gap-2 shadow-xl whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span>{language === 'th' ? 'แบบจำลองกระเพาะปัสสาวะ 3 มิติ' : 'Interactive 3D Bladder Matrix'}</span>
          </div>

          {/* Bottom HUD Telemetry */}
          <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between pointer-events-none gap-2">
            <div className="bg-slate-900/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[8.5px] sm:text-[10px] font-bold tracking-wider uppercase text-blue-400 border border-white/5 whitespace-nowrap">
              Mesh Shader
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[8.5px] sm:text-[10px] font-bold tracking-wider uppercase text-slate-400 border border-white/5 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
              <RotateCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 animate-spin-slow" />
              <span>{language === 'th' ? 'หมุน 360°' : 'Auto 360°'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

