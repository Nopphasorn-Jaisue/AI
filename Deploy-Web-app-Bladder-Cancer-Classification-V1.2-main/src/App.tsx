/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TNMStagingGrid } from "./components/TNMStagingGrid";
import { ImageSection } from "./components/ImageSection";
import { Supervisors } from "./components/Supervisors";
import { Login, DoctorUser } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { BrainCircuit, ExternalLink, ShieldAlert, HeartPulse } from "lucide-react";
import { LanguageProvider, useLanguage } from "./lib/i18n";

export type AppPage = "home" | "login" | "dashboard";

function AppContent() {
  const { language } = useLanguage();
  const [page, setPage] = useState<AppPage>(() => {
    try {
      const savedDoctor = localStorage.getItem("bladder_doctor_session");
      if (savedDoctor && window.location.hash === "#dashboard") {
        return "dashboard";
      }
    } catch {
      // ignore
    }
    return "home";
  });

  const [doctor, setDoctor] = useState<DoctorUser | null>(() => {
    try {
      const saved = localStorage.getItem("bladder_doctor_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (loggedInDoctor: DoctorUser) => {
    setDoctor(loggedInDoctor);
    try {
      localStorage.setItem("bladder_doctor_session", JSON.stringify(loggedInDoctor));
    } catch {
      // ignore
    }
    setPage("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setDoctor(null);
    try {
      localStorage.removeItem("bladder_doctor_session");
    } catch {
      // ignore
    }
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (targetPage: AppPage) => {
    if (targetPage === "dashboard" && !doctor) {
      setPage("login");
    } else {
      setPage(targetPage);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render Login Page
  if (page === "login") {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => {
          setPage("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  // Render Medical Dashboard
  if (page === "dashboard" && doctor) {
    return (
      <Dashboard
        doctor={doctor}
        onLogout={handleLogout}
        onBackToHome={() => {
          setPage("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  // Render Home Overview Page
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-indigo-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} doctor={doctor} onLogout={handleLogout} />

      <main className="flex-1 relative">
        {/* Global Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none -z-10" />
        <Hero onStartDiagnosis={() => handleNavigate(doctor ? "dashboard" : "login")} />
        <ImageSection />
        <TNMStagingGrid />
        <Supervisors />
      </main>

      <footer className="relative bg-white border-t border-slate-200/50 pt-20 pb-12 px-6 overflow-hidden">
        {/* Background Footer Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-indigo-50/50 rounded-t-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-[90rem] mx-auto flex flex-col gap-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200/50">
            {/* Brand column */}
            <div className="md:col-span-5 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <span className="block font-extrabold text-xl text-slate-900 tracking-tight">BladderAI</span>
                  <span className="block text-[11px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                    {language === "th" ? "ระบบตรวจคัดกรองและแบ่งระยะ" : "Staging System"}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-[14px] sm:text-[15px] max-w-sm leading-relaxed font-medium mt-2">
                {language === "th"
                  ? "ระบบปัญญาประดิษฐ์อัตโนมัติจำแนกระยะ TNM Staging จากภาพถ่าย MRI กระเพาะปัสสาวะด้วยโครงข่ายประสาทเทียมเชิงลึกและการแบ่งส่วนรอยโรค"
                  : "Automated TNM staging classification for MRI bladder cancer scans using deep convolutional neural networks and computer vision segmentation."}
              </p>
              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200/60">
                <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>{language === "th" ? "มหาวิทยาลัยพะเยา" : "University of Phayao"}</span>
              </div>
            </div>

            {/* Navigation & Resources */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                  {language === "th" ? "ส่วนการทำงานของระบบ" : "Platform Modules"}
                </span>
                <nav className="flex flex-col gap-3">
                  <a href="#home" className="text-[14px] text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                    {language === "th" ? "ภาพรวมระบบ" : "Hero Overview"}
                  </a>
                  <a href="#overview" className="text-[14px] text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                    {language === "th" ? "แผนภาพโครงสร้างกายวิภาค" : "System Visualization"}
                  </a>
                  <a href="#staging" className="text-[14px] text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                    {language === "th" ? "แบบจำลอง 3 มิติ TNM Staging" : "3D Interactive Staging"}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleNavigate(doctor ? "dashboard" : "login")}
                    className="text-left text-[14px] text-blue-600 hover:text-blue-800 font-bold transition-colors"
                  >
                    {language === "th" ? "เวิร์กสเตชันการวินิจฉัยแพทย์ (Doctor Portal)" : "Doctor Diagnostic Workstation"}
                  </button>
                  <a href="#supervisors" className="text-[14px] text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                    {language === "th" ? "อาจารย์ที่ปรึกษาและทีมวิจัย" : "Research Advisors"}
                  </a>
                </nav>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                  {language === "th" ? "เอกสารวิชาการและแหล่งอ้างอิง" : "Academic Resources"}
                </span>
                <nav className="flex flex-col gap-3">
                  <a
                    href="https://staging.radiologyassistant.nl/abdomen/bladder/bladder-cancer-vi-rads"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] text-blue-600 hover:text-blue-800 font-bold transition-colors group"
                  >
                    <span>{language === "th" ? "Radiology Assistant — VI-RADS & TNM" : "Radiology Assistant — VI-RADS & TNM"}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <a
                    href="https://www.mdpi.com/2079-9721/14/2/45"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] text-indigo-600 hover:text-indigo-800 font-bold transition-colors group"
                  >
                    <span>{language === "th" ? "วารสารงานวิจัยตีพิมพ์บน MDPI" : "MDPI Journal Research Paper"}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <a
                    href="https://www.kaggle.com/datasets/shirtgm/bladder-cancer-classification"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] text-slate-500 hover:text-slate-900 font-medium transition-colors"
                  >
                    <span>{language === "th" ? "ชุดข้อมูลพื้นฐาน Kaggle Dataset" : "Kaggle Base Dataset"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </nav>

                <div className="mt-4 p-4 bg-slate-900/5 rounded-2xl border border-slate-900/10 flex items-start gap-3 shadow-sm backdrop-blur-sm">
                  <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0" />
                  <p className="text-[12px] font-medium text-slate-600 leading-relaxed">
                    {language === "th"
                      ? "ระบบนี้พัฒนาขึ้นเพื่อการวิจัยและการสนับสนุนการตัดสินใจทางคลินิก ผลการประเมินต้องได้รับการยืนยันโดยแพทย์ผู้เชี่ยวชาญด้านรังสีวิทยา"
                      : "Designed for academic and clinical decision-support assistance. Diagnostic evaluations must be validated by a certified radiologist."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] font-medium text-slate-400">
              {language === "th"
                ? "© 2026 ระบบปัญญาประดิษฐ์ตรวจจับมะเร็งกระเพาะปัสสาวะ สงวนลิขสิทธิ์"
                : "© 2026 Bladder Cancer AI Detection System. All rights reserved."}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">
                {language === "th" ? "การวิจัยและพัฒนา • มหาวิทยาลัยพะเยา" : "Research & Development • UP"}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
