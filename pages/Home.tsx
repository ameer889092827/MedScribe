
import React from 'react';
import { ArrowRight, Mic, Sparkles, ScrollText, History, Stamp, FileText } from 'lucide-react';
import { Page, Language } from '../types';

interface HomeProps {
  setPage: (page: Page) => void;
  language: Language;
}

const Home: React.FC<HomeProps> = ({ setPage, language }) => {
  const t = {
    badge: language === 'en' ? 'New Standard in Medical Care' : 'Новый стандарт в медицине',
    h1Main: language === 'en' ? 'Medical documentation.' : 'Медицинская документация.',
    h1Sub: language === 'en' ? 'Reimagined by Intelligence.' : 'Переосмыслена Интеллектом.',
    desc: language === 'en' 
      ? 'Record patient dialogue. Extract medical data. Instantly auto-fill Kazakhstan Form 075, 027, 003 and more with zero bureaucracy.' 
      : 'Записывайте диалог с пациентом. Извлекайте данные. Мгновенно заполняйте формы 075, 027, 003 и другие без бюрократии.',
    start: language === 'en' ? 'Start Session' : 'Начать сейчас',
    learn: language === 'en' ? 'Learn more' : 'Узнать больше',
    
    step1Title: language === 'en' ? 'Natural Recording' : 'Естественная Запись',
    step1Desc: language === 'en' 
      ? 'Doctor converses naturally. No dictation commands needed. MedScribe listens in the background.' 
      : 'Врач ведет прием в свободном формате. Диктовка не нужна. MedScribe слушает в фоновом режиме.',
      
    step2Title: language === 'en' ? 'Clinical Extraction' : 'Клинический Анализ',
    step2Desc: language === 'en'
      ? 'AI filters small talk, identifies diagnoses, and structures medical facts with 99.9% accuracy.' 
      : 'ИИ отсеивает лишнее, определяет диагнозы и структурирует факты с точностью 99.9%.',
      
    step3Title: language === 'en' ? 'Universal Documents' : 'Любые Документы',
    step3Desc: language === 'en' 
      ? 'Auto-fill Form 075, 086, 027, Sick Leaves, or your clinic’s custom templates instantly.' 
      : 'Авто-заполнение форм 075, 086, 027, больничных листов или шаблонов вашей клиники.',
      
    trustTitle: language === 'en' ? 'Precision engineered for the modern clinic.' : 'Создано для современной клиники.',
    trustDesc: language === 'en' 
      ? 'MedScribe complies with Kazakhstan Ministry of Health standards. Data is processed securely without retention. Accuracy you can trust, speed you can rely on.'
      : 'MedScribe соответствует стандартам Минздрава РК. Данные обрабатываются безопасно и не сохраняются. Точность, которой можно доверять.',
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-20 overflow-hidden relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Luxury Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[80px] mix-blend-multiply opacity-60"></div>
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-slate-50 to-transparent rounded-[100%] blur-[80px]"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-20 md:pb-32 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 mb-8 md:mb-10 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-blue-600 text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase animate-fade-in-up">
          <Sparkles size={12} /> {t.badge}
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight text-gray-900 mb-6 md:mb-8 leading-[1.05] drop-shadow-sm">
          <span className="block">{t.h1Main}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-2">
            {t.h1Sub}
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 md:mb-14 font-light leading-relaxed antialiased">
          {t.desc}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 px-4">
          <button 
            onClick={() => setPage(Page.APP)}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#0F172A] text-white rounded-2xl font-medium text-base md:text-lg transition-all hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95"
          >
            {t.start}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
             onClick={() => setPage(Page.ABOUT)}
             className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-gray-600 border border-gray-200 rounded-2xl font-medium text-base md:text-lg transition-all hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md active:scale-95"
          >
            {t.learn}
          </button>
        </div>
      </section>

      {/* Luxury Dark Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="group relative bg-[#151B28] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl shadow-gray-900/10 hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-6 text-[8rem] md:text-[12rem] font-serif leading-none text-white opacity-[0.02] group-hover:opacity-[0.04] transition-opacity select-none pointer-events-none">1</div>
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[250px] md:min-h-[300px]">
                    <div>
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-300 mb-6 md:mb-8 border border-white/5 group-hover:bg-white/10 transition-colors">
                            <Mic className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-medium text-white mb-3 md:mb-4">{t.step1Title}</h3>
                        <p className="text-gray-400 leading-relaxed font-light text-sm">{t.step1Desc}</p>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-[#151B28] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl shadow-gray-900/10 hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-6 text-[8rem] md:text-[12rem] font-serif leading-none text-white opacity-[0.02] group-hover:opacity-[0.04] transition-opacity select-none pointer-events-none">2</div>
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[250px] md:min-h-[300px]">
                    <div>
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-300 mb-6 md:mb-8 border border-white/5 group-hover:bg-white/10 transition-colors">
                            <Sparkles className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-medium text-white mb-3 md:mb-4">{t.step2Title}</h3>
                        <p className="text-gray-400 leading-relaxed font-light text-sm">{t.step2Desc}</p>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-[#151B28] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl shadow-gray-900/10 hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-6 text-[8rem] md:text-[12rem] font-serif leading-none text-white opacity-[0.02] group-hover:opacity-[0.04] transition-opacity select-none pointer-events-none">3</div>
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[250px] md:min-h-[300px]">
                    <div>
                        <div className="flex justify-between items-start mb-6 md:mb-8">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-300 border border-white/5 group-hover:bg-white/10 transition-colors">
                                <FileText className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                            </div>
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">NEW</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-medium text-white mb-3 md:mb-4">{t.step3Title}</h3>
                        <p className="text-gray-400 leading-relaxed font-light text-sm mb-6 md:mb-8">{t.step3Desc}</p>
                    </div>
                     <div className="flex gap-2">
                         <div className="text-[10px] text-gray-400 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-default">075/у</div>
                         <div className="text-[10px] text-gray-400 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-default">086/у</div>
                         <div className="text-[10px] text-gray-400 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-default">RX</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-end">
            <div className="max-w-xl">
                <h2 className="text-2xl md:text-3xl font-light mb-6 whitespace-pre-line text-gray-900">{t.trustTitle}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
                <p className="text-gray-500 font-light leading-relaxed text-base md:text-lg">
                    {t.trustDesc}
                </p>
            </div>
            <div className="mt-10 md:mt-0 flex flex-wrap gap-x-8 md:gap-x-12 gap-y-4 text-gray-400 font-medium text-xs tracking-widest uppercase">
                <span className="flex items-center gap-2 md:gap-3"><div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div> ISO 27001 Ready</span>
                <span className="flex items-center gap-2 md:gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div> GDPR Compliant</span>
                <span className="flex items-center gap-2 md:gap-3"><div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div> KZ MOH Standard</span>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
