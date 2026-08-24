import { useState } from "react";
import { motion } from "motion/react";
import { BrainCircuit, Upload, FileText, Volume2, VolumeX, Globe } from "lucide-react";
import { toggleSound, isSoundEnabled, playClick } from "../lib/sound";
import { useLanguage } from "../lib/i18n";

export const Navbar = () => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const { language, setLanguage, t } = useLanguage();

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playClick();
  };

  const toggleLanguage = () => {
    playClick();
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <div className="fixed top-2 sm:top-4 md:top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)] rounded-full w-full max-w-7xl px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2"
      >
        {/* Brand & Badge */}
        <a 
          href="#home" 
          onClick={playClick}
          className="flex items-center gap-2 sm:gap-2.5 group px-1 sm:px-2 min-w-0 shrink"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform duration-300 border border-white/10 shrink-0">
            <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[13px] sm:text-[15px] font-black text-slate-900 tracking-tight leading-none">BladderAI</span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <span className="text-[7.5px] sm:text-[9px] font-extrabold text-blue-700 tracking-widest uppercase mt-0.5 truncate max-w-[110px] xs:max-w-[150px] sm:max-w-none">
              {language === 'th' ? 'YOLOv11 + ResNet ระบบวินิจฉัย' : 'Precision MRI Staging'}
            </span>
          </div>
        </a>

        {/* Center Nav Links - Visible on Desktop / Laptop (>=1024px) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 shadow-inner">
          {[
            { name: t("navHero"), href: "#overview" },
            { name: t("navTNM"), href: "#staging" },
            { name: t("navDetector"), href: "#prediction" },
            { name: t("navSupervisors"), href: "#supervisors" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={playClick}
              className="text-[12px] font-bold text-slate-600 hover:text-slate-900 hover:bg-white px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm shadow-transparent hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] whitespace-nowrap"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Actions & Switches */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language Switcher Button */}
          <div className="bg-slate-100/90 border border-slate-200/80 p-0.5 sm:p-1 rounded-full flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => {
                if (language !== 'th') {
                  playClick();
                  setLanguage('th');
                }
              }}
              className={`px-1.5 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black transition-all duration-200 flex items-center gap-0.5 sm:gap-1 ${
                language === 'th'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇹🇭 TH</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (language !== 'en') {
                  playClick();
                  setLanguage('en');
                }
              }}
              className={`px-1.5 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black transition-all duration-200 flex items-center gap-0.5 sm:gap-1 ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇬🇧 EN</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`p-1.5 sm:p-2 md:p-2.5 rounded-full border transition-all duration-200 ${
              soundOn
                ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                : "bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600"
            }`}
            title={soundOn ? t("soundOn") : t("soundOff")}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          <a
            href="https://www.mdpi.com/2079-9721/14/2/45"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-white transition-all shadow-sm whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>MDPI Paper</span>
          </a>

          <a
            href="#prediction"
            onClick={playClick}
            className="inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10.5px] sm:text-[12px] font-bold uppercase tracking-wider px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all duration-300 active:scale-95 border border-white/20 shrink-0 whitespace-nowrap"
          >
            <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{language === 'th' ? 'วิเคราะห์ MRI' : 'Upload MRI'}</span>
            <span className="sm:hidden">MRI</span>
          </a>
        </div>
      </motion.nav>
    </div>
  );
};
