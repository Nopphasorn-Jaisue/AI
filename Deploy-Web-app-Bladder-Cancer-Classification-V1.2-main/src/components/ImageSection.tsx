import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn, X, Info, Layers, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { playClick } from "../lib/sound";

export const ImageSection = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { language } = useLanguage();

  return (
    <section id="overview" className="py-20 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-slate-200/80 relative overflow-hidden"
      >
        {/* Ambient Gradient Highlights */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/50 to-indigo-100/30 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-[90px] pointer-events-none translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Diagram Preview */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <div 
              onClick={() => {
                playClick();
                setIsZoomed(true);
              }}
              className="group relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/80 p-2 sm:p-3 w-full cursor-pointer transition-all duration-300 shadow-sm hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)] hover:border-blue-300"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-100/80 shadow-xs">
                <img 
                  src="/img/hero/TNM system - T staging.png"
                  alt="Bladder Cancer Staging Diagram" 
                  className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500 ease-[0.16,1,0.3,1]" 
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-black tracking-wide uppercase text-slate-900 flex items-center gap-2 shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                    <ZoomIn className="w-4 h-4 text-blue-600" />
                    <span>{language === 'th' ? 'คลิกเพื่อขยายดูแผนภาพเต็ม' : 'Click to Expand Atlas'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full mt-4 px-2">
              <span className="text-[11px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>{language === 'th' ? 'แบบจำลองมาตรฐานทางคลินิก' : 'Clinical Reference Model'}</span>
              </span>
              <a
                href="https://staging.radiologyassistant.nl/abdomen/bladder/bladder-cancer-vi-rads"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                title="View Radiology Assistant Bladder Cancer VI-RADS & TNM Staging Reference"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold tracking-wider uppercase flex items-center gap-1 hover:underline transition-all group"
              >
                <span>{language === 'th' ? 'คู่มือ VI-RADS มาตรฐาน' : 'VI-RADS Standard Guide'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Explanation Text & Layer Steps */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/60 text-indigo-700 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-4 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'th' ? 'การแบ่งระดับความลึกตามโครงสร้างกายวิภาค' : 'Anatomical Depth Reference'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
              {language === 'th' ? (
                <>
                  ระบบการแบ่งระยะ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TNM Staging</span>
                </>
              ) : (
                <>
                  TNM Staging System <br />
                  <span className="text-slate-400 font-medium">Visualized Mapping</span>
                </>
              )}
            </h2>

            <p className="text-slate-600 text-[14px] sm:text-[15px] leading-relaxed mb-6 max-w-lg font-medium">
              {language === 'th'
                ? 'ระดับความลึกของการแทรกซึมก้อนเนื้องอกในผนังกระเพาะปัสสาวะเป็นปัจจัยชี้ขาดต่อการพยากรณ์โรคและการวางแผนการรักษา โดยเฉพาะการแยกระหว่างมะเร็งที่ยังไม่ลุกลามชั้นกล้ามเนื้อ (NMIBC) และชนิดที่ลุกลามชั้นกล้ามเนื้อแล้ว (MIBC)'
                : 'The depth of bladder wall tumor invasion directly determines patient prognosis and treatment trajectory. Our AI model inspects MRI intensities across muscular and perivesical layers to classify into precise T-categories.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {[
                { 
                  stage: "T1", 
                  name: language === 'th' ? "ชั้นเนื้อเยื่อเกี่ยวพัน" : "Subepithelial", 
                  desc: language === 'th' ? "ลุกลามถึงชั้น Lamina Propria ยังไม่เข้าสู่ชั้นกล้ามเนื้อ" : "Invades lamina propria without muscle entry.", 
                  color: "bg-emerald-500", 
                  shadow: "shadow-emerald-500/20" 
                },
                { 
                  stage: "T2", 
                  name: language === 'th' ? "ชั้นกล้ามเนื้อกระเพาะปัสสาวะ" : "Muscle Invasive", 
                  desc: language === 'th' ? "แทรกซึมเข้าสู่ชั้นกล้ามเนื้อ Detrusor (MIBC ชัดเจน)" : "Infiltrates muscularis propria (detrusor).", 
                  color: "bg-amber-500", 
                  shadow: "shadow-amber-500/20" 
                },
                { 
                  stage: "T3", 
                  name: language === 'th' ? "ชั้นไขมันรอบนอก" : "Perivesical Fat", 
                  desc: language === 'th' ? "ทะลุชั้นกล้ามเนื้อออกสู่ชั้นไขมันรอบกระเพาะปัสสาวะ" : "Extends beyond muscle into surrounding fat.", 
                  color: "bg-orange-500", 
                  shadow: "shadow-orange-500/20" 
                },
                { 
                  stage: "T4", 
                  name: language === 'th' ? "อวัยวะข้างเคียง" : "Extravesical", 
                  desc: language === 'th' ? "ลุกลามเข้าสู่ต่อมลูกหมาก, มดลูก, หรือผนังเชิงกราน" : "Invades prostate, uterus, vagina, or pelvic wall.", 
                  color: "bg-rose-500", 
                  shadow: "shadow-rose-500/20" 
                },
              ].map((s) => (
                <div 
                  key={s.stage} 
                  className="p-4 rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200/70 hover:border-blue-200 hover:shadow-[0_8px_20px_rgba(37,99,235,0.06)] transition-all duration-200 flex items-start gap-3.5 group"
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${s.color} ${s.shadow} shadow-lg mt-0.5 shrink-0 ring-4 ring-white group-hover:scale-110 transition-transform`} />
                  <div>
                    <h3 className="text-[13px] font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span className="text-slate-400 font-bold">{s.stage}:</span> {s.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Lightbox for TNM Chart */}
      {createPortal(
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 min-h-screen bg-slate-950/85 backdrop-blur-xl"
              onClick={() => setIsZoomed(false)}
            >
              <button 
                className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 border border-white/10 p-3 rounded-full transition-all z-50 shadow-2xl hover:scale-105 active:scale-95"
                onClick={() => setIsZoomed(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-5xl max-h-[90vh] bg-white p-3 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-slate-50 rounded-[1.8rem] overflow-auto border border-slate-100 p-4">
                  <img
                    src="/img/hero/TNM system - T staging.png"
                    alt="Full TNM Staging Diagram"
                    className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto"
                  />
                </div>
                <div className="text-center py-4 px-6 text-[13px] font-bold tracking-widest uppercase text-slate-500 flex flex-wrap items-center justify-center gap-3">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Layers className="w-4 h-4 text-blue-600" />
                    {language === 'th' ? 'แผนภาพกายวิภาคการแบ่งระยะ TNM Staging ในมะเร็งกระเพาะปัสสาวะ' : 'Bladder Cancer TNM System — T Staging Depth Classification Atlas'}
                  </span>
                  <a
                    href="https://staging.radiologyassistant.nl/abdomen/bladder/bladder-cancer-vi-rads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline transition-all"
                  >
                    <span>Radiology Assistant Reference</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};


