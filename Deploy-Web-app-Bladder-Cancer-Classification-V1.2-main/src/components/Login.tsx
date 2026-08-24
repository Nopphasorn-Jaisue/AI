import React, { useState } from "react";
import { motion } from "motion/react";
import {
  BrainCircuit,
  Lock,
  UserCheck,
  Building2,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Globe
} from "lucide-react";
import { playClick } from "../lib/sound";
import { useLanguage } from "../lib/i18n";

export interface DoctorUser {
  id: string;
  name: string;
  role: string;
  hospital: string;
  department: string;
  avatar?: string;
}

interface LoginProps {
  onLoginSuccess: (doctor: DoctorUser) => void;
  onBackToHome: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const { language, setLanguage, t } = useLanguage();
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [hospital, setHospital] = useState("University of Phayao Hospital");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Mock credentials check: admin / password
      if (
        (doctorId.trim().toLowerCase() === "admin" && password === "password") ||
        (doctorId.trim().toLowerCase() === "doctor" && password === "doctor123") ||
        (doctorId.trim().length > 0 && password.length >= 4)
      ) {
        const loggedInDoctor: DoctorUser = {
          id: doctorId.trim() || "DOC-8942",
          name: language === "th" ? "นพ. วินิจฉัย วิริยะการ" : "Dr. Vinitjai Viriyakarn, M.D.",
          role: language === "th" ? "ศัลยแพทย์ทางเดินปัสสาวะและผู้เชี่ยวชาญรังสีวิทยา" : "Urologist & Urologic Oncologist",
          hospital: language === "th" ? "ศูนย์การแพทย์และโรงพยาบาลมหาวิทยาลัยพะเยา" : "University of Phayao Medical Center",
          department: language === "th" ? "ภาควิชาศัลยศาสตร์ระบบทางเดินปัสสาวะ" : "Department of Urology & AI Radiology"
        };
        setIsLoading(false);
        onLoginSuccess(loggedInDoctor);
      } else {
        setIsLoading(false);
        setError(
          language === "th"
            ? "รหัสประจำตัวแพทย์หรือรหัสผ่านไม่ถูกต้อง (ใช้ admin / password สำหรับ Demo)"
            : "Invalid Doctor ID or password. Use 'admin' / 'password' for Demo access."
        );
      }
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    playClick();
    setDoctorId("admin");
    setPassword("password");
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const demoDoctor: DoctorUser = {
        id: "DOC-UP-8841",
        name: language === "th" ? "นพ. วินิจฉัย วิริยะการ (แพทย์ผู้เชี่ยวชาญ)" : "Dr. Vinitjai Viriyakarn, M.D.",
        role: language === "th" ? "ศัลยแพทย์ทางเดินปัสสาวะ • หัวหน้าหน่วย AI รังสีวิทยา" : "Chief of Urologic Oncology & AI Diagnostics",
        hospital: language === "th" ? "ศูนย์การแพทย์มหาวิทยาลัยพะเยา" : "University of Phayao Medical Center",
        department: language === "th" ? "ศูนย์ความเป็นเลิศด้านมะเร็งระบบทางเดินปัสสาวะ" : "Center of Excellence in Urologic Oncology"
      };
      setIsLoading(false);
      onLoginSuccess(demoDoctor);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Dynamic Background Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Top Header Bar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            playClick();
            onBackToHome();
          }}
          className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 px-4 py-2 rounded-full border border-slate-700/60 backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("loginBackHome")}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <div className="bg-slate-900/90 border border-slate-700/70 p-1 rounded-full flex items-center shadow-inner backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                playClick();
                setLanguage("th");
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                language === "th" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
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
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                language === "en" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] bg-slate-900/80 border border-slate-800/90 rounded-[2.25rem] p-6 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative"
        >
          {/* Top Medical Pulse Accent */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">BladderAI</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Doctor Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Medical Decision Support Workstation</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{t("loginTitle")}</h1>
            <p className="text-[12.5px] text-slate-400 mt-1 font-medium">{t("loginSubtitle")}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs font-semibold leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                {t("loginDoctorID")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder={language === "th" ? "เช่น admin หรือ DOC-1234" : "e.g. admin or DOC-1234"}
                  required
                  className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-all placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                {t("loginPassword")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-all placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

            {/* Hospital / Organization */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                {t("loginHospital")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="University of Phayao Hospital">
                    {language === "th" ? "โรงพยาบาลมหาวิทยาลัยพะเยา (UP Hospital)" : "University of Phayao Hospital"}
                  </option>
                  <option value="Phayao Medical Center">
                    {language === "th" ? "ศูนย์การแพทย์และโรงพยาบาลมหาวิทยาลัยพะเยา" : "UP Medical Center & Urology Center"}
                  </option>
                  <option value="Regional Oncology Network">
                    {language === "th" ? "เครือข่ายศูนย์มะเร็งภาคเหนือตอนบน" : "Regional Oncology Diagnostic Network"}
                  </option>
                </select>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-400 font-medium">
                  {language === "th" ? "จดจำการเข้าสู่ระบบในเครื่องนี้" : "Remember this workstation"}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-2 border border-white/20 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{t("loginBtn")}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-blue-400 hover:text-blue-300 text-xs font-bold border border-blue-500/20 hover:border-blue-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{t("loginDemoBtn")}</span>
            </button>
            <div className="text-center mt-2">
              <span className="text-[11px] text-slate-500">
                {language === "th"
                  ? "Mock User: admin | Password: password"
                  : "Mock User: admin | Password: password"}
              </span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Security Badges */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] font-medium max-w-xl mx-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t("loginSecureNote")}</span>
        </div>
      </footer>
    </div>
  );
};
