import { motion } from "motion/react";
import { Users, GraduationCap, ExternalLink, BookOpen, Award, ArrowRight } from "lucide-react";
import { useLanguage } from "../lib/i18n";

const supervisors = [
  { 
    name: "Phisit Katongtung", 
    role: "Lead Developer & Researcher", 
    roleTh: "ผู้วิจัยและพัฒนาหลัก",
    dept: "Data Science & AI", 
    deptTh: "วิทยาศาสตร์ข้อมูลและปัญญาประดิษฐ์",
    institution: "University of Phayao", 
    institutionTh: "มหาวิทยาลัยพะเยา",
    img: "/img/hero/1778346359836-0375e255-Phisit-Katongtung.jpg",
    highlight: "Model Architecture & Pipeline",
    highlightTh: "สถาปัตยกรรมโมเดลและระบบประมวลผล"
  },
  { 
    name: "Watcharaporn Cholanjiak", 
    role: "Academic Supervisor", 
    roleTh: "อาจารย์ที่ปรึกษาหลัก",
    dept: "Department of Mathematics", 
    deptTh: "สาขาวิชาคณิตศาสตร์ คณะวิทยาศาสตร์",
    institution: "University of Phayao", 
    institutionTh: "มหาวิทยาลัยพะเยา",
    img: "/img/hero/Watcharaporn Cholanjiak.png",
    highlight: "Mathematical Modeling",
    highlightTh: "การสร้างแบบจำลองทางคณิตศาสตร์"
  },
  { 
    name: "Kanokwatt Shiangjen", 
    role: "Academic Supervisor", 
    roleTh: "อาจารย์ที่ปรึกษาร่วม",
    dept: "School of ICT", 
    deptTh: "คณะเทคโนโลยีสารสนเทศและการสื่อสาร",
    institution: "University of Phayao", 
    institutionTh: "มหาวิทยาลัยพะเยา",
    img: "/img/hero/Kanokwatt Shiangjen.png",
    highlight: "Deep Learning Systems",
    highlightTh: "ระบบการเรียนรู้เชิงลึก (Deep Learning)"
  },
  { 
    name: "Kritin Narawetsakul", 
    role: "Clinical Advisor", 
    roleTh: "ที่ปรึกษาทางการแพทย์และภาพวินิจฉัย",
    dept: "Faculty of Medicine", 
    deptTh: "คณะแพทยศาสตร์",
    institution: "University of Phayao", 
    institutionTh: "มหาวิทยาลัยพะเยา",
    img: "/img/hero/638193268072704773.jpg",
    highlight: "Medical & Imaging Validation",
    highlightTh: "การตรวจสอบความถูกต้องทางการแพทย์"
  },
];

export const Supervisors = () => {
  const { language } = useLanguage();

  return (
    <section id="supervisors" className="py-24 px-6 max-w-[90rem] mx-auto relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 backdrop-blur-md border border-indigo-200/60 text-indigo-700 text-[10px] font-bold tracking-widest uppercase mb-5 shadow-sm">
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'th' ? 'คณะผู้วิจัยและอาจารย์ที่ปรึกษา' : 'Research Team & Faculty'}</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tighter mb-4 leading-tight">
          {language === 'th' ? 'อาจารย์ที่ปรึกษาและทีมวิจัย' : 'Supervisors & Research Advisors'}
        </h2>
        <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed font-medium">
          {language === 'th' 
            ? 'ความร่วมมือทางวิชาการข้ามศาสตร์ระหว่างแพทยศาสตร์, วิทยาศาสตร์ข้อมูล, เทคโนโลยีสารสนเทศ และคณิตศาสตร์ประยุกต์ มหาวิทยาลัยพะเยา' 
            : 'Interdisciplinary collaboration across Medicine, Data Science, ICT, and Applied Mathematics at the University of Phayao.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 max-w-7xl mx-auto relative z-10">
        {supervisors.map((s, i) => (
          <motion.div 
            key={s.name}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(37,99,235,0.08)] hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-colors duration-500" />
            
            <div className="relative mb-6 z-10">
              <div className="w-36 h-36 rounded-full overflow-hidden border-[6px] border-white shadow-xl group-hover:scale-105 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <span className="absolute bottom-1 right-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white transform group-hover:rotate-12 transition-transform duration-300">
                <GraduationCap className="w-4 h-4" />
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 shadow-sm border border-indigo-100/50">
                {language === 'th' ? s.roleTh : s.role}
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
                {s.name}
              </h3>
              <p className="text-slate-600 text-[13px] font-medium mb-1">
                {language === 'th' ? s.deptTh : s.dept}
              </p>
              <p className="text-slate-400 text-[12px] font-medium mb-5">
                {language === 'th' ? s.institutionTh : s.institution}
              </p>
              
              <div className="mt-auto w-full pt-4 border-t border-slate-200/50 flex items-center justify-center gap-2 text-[11px] font-bold tracking-wide uppercase text-slate-500">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{language === 'th' ? s.highlightTh : s.highlight}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Premium Research Paper Citation Box */}
      <div className="max-w-7xl mx-auto mt-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-slate-900 rounded-[3rem] p-8 sm:p-12 overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.3)] flex flex-col md:flex-row items-center justify-between gap-8 group"
        >
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[80px] transform translate-x-1/3 -translate-y-1/2 group-hover:bg-blue-500/30 transition-colors duration-700 pointer-events-none" />

          <div className="relative z-10 flex items-start gap-6 max-w-2xl">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-blue-300 shadow-xl">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300 flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {language === 'th' ? 'ผลงานตีพิมพ์ในวารสารระดับนานาชาติ (Peer-Reviewed)' : 'Peer-Reviewed Publication'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                {language === 'th' ? 'อ่านเอกสารงานวิจัยฉบับเต็มบนฐานข้อมูล MDPI' : 'Read the Full Research Paper on MDPI'}
              </h3>
              <p className="text-slate-300 text-[14px] sm:text-[15px] font-medium leading-relaxed opacity-90">
                {language === 'th'
                  ? 'รายละเอียดผลการประเมินความแม่นยำทางคลินิก, ระเบียบวิธีการฝึกโมเดล Deep Neural Network และชุดข้อมูลการแบ่งระยะ TNM'
                  : 'Detailed validation metrics, deep neural network training methodologies, and clinical staging dataset specifications.'}
              </p>
            </div>
          </div>

          <a
            href="https://www.mdpi.com/2079-9721/14/2/45"
            target="_blank"
            rel="noreferrer"
            className="relative z-10 shrink-0 inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 text-[13px] font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_25px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 group/btn"
          >
            <span>{language === 'th' ? 'ดูเอกสารบน MDPI.com' : 'View on MDPI.com'}</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

