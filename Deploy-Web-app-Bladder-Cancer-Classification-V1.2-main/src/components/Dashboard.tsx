import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  Scan,
  GitCompare,
  Home,
  LogOut,
  Volume2,
  VolumeX,
  Stethoscope,
  Activity,
  ShieldCheck,
  Menu,
  X,
  User,
  Clock,
  ChevronRight,
  Sparkles,
  Server
} from "lucide-react";
import { DetectionForm } from "./DetectionForm";
import { DiagnosisComparison } from "./DiagnosisComparison";
import { DoctorUser } from "./Login";
import { playClick, toggleSound, isSoundEnabled } from "../lib/sound";
import { useLanguage } from "../lib/i18n";

interface DashboardProps {
  doctor: DoctorUser;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ doctor, onLogout, onBackToHome }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"analysis" | "comparison">("analysis");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playClick();
  };

  const handleTabChange = (tab: "analysis" | "comparison") => {
    playClick();
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col lg:flex-row overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 sm:w-80 bg-[#0F172A] text-slate-100 flex flex-col justify-between p-4 sm:p-6 z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Workstation Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
                <BrainCircuit className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white">BladderAI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="block text-[9.5px] font-bold text-blue-400 uppercase tracking-wider">
                  Medical Workstation
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Doctor Profile Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex items-center gap-3 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0 border border-white/10 shadow-md">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white truncate">{doctor.name}</span>
              </div>
              <p className="text-[10.5px] text-blue-400 font-medium truncate">{doctor.role}</p>
              <p className="text-[9px] text-slate-500 font-medium truncate mt-0.5">{doctor.hospital}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 mb-2">
              Workstation Tools
            </span>

            {/* Tab 1: MRI Analysis */}
            <button
              type="button"
              onClick={() => handleTabChange("analysis")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "analysis"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <div className="flex items-center gap-3">
                <Scan className="w-4 h-4" />
                <span>{t("dashTabAnalysis")}</span>
              </div>
              {activeTab === "analysis" && <ChevronRight className="w-4 h-4 text-blue-200" />}
            </button>

            {/* Tab 2: Diagnosis Comparison */}
            <button
              type="button"
              onClick={() => handleTabChange("comparison")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "comparison"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <div className="flex items-center gap-3">
                <GitCompare className="w-4 h-4" />
                <span>{t("dashTabComparison")}</span>
              </div>
              {activeTab === "comparison" && <ChevronRight className="w-4 h-4 text-blue-200" />}
            </button>
          </div>

          {/* AI Engine Telemetry Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3 h-3 text-emerald-400" />
                <span>Engine Telemetry</span>
              </span>
              <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Model:</span>
                <span className="font-semibold text-slate-200">YOLOv11 + ResNet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Protocol:</span>
                <span className="font-semibold text-slate-200">VI-RADS v2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Inference:</span>
                <span className="font-semibold text-emerald-400">38 ms (GPU)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          {/* Language & Sound Switches */}
          <div className="flex items-center justify-between gap-2">
            <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl flex items-center flex-1">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setLanguage("th");
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  language === "th" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                🇹🇭 TH
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setLanguage("en");
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  language === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <button
              type="button"
              onClick={handleSoundToggle}
              className={`p-2 rounded-xl border transition-all ${
                soundOn
                  ? "bg-slate-900 border-slate-800 text-blue-400"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
              title={soundOn ? "Mute sound" : "Enable sound"}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Back to Home Button */}
          <button
            type="button"
            onClick={() => {
              playClick();
              onBackToHome();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t("loginBackHome")}</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              playClick();
              onLogout();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("dashSignOut")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {activeTab === "analysis" ? t("dashTabAnalysis") : t("dashTabComparison")}
                </h1>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
                  {activeTab === "analysis" ? "Automated AI Detection Engine" : "Longitudinal Disease Tracking"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>

            {/* Doctor Info Pill */}
            <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                Dr
              </div>
              <span className="text-xs font-black text-slate-800 max-w-[120px] sm:max-w-none truncate">
                {doctor.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "analysis" ? (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <DetectionForm />
              </motion.div>
            ) : (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <DiagnosisComparison />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
