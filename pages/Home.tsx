import React from 'react';
import { ArrowRight, FileText, Mic, Sparkles, ScrollText, Wand2 } from 'lucide-react';
import { Page, Language } from '../types';

interface HomeProps {
  setPage: (page: Page) => void;
  language: Language;
}

const Home: React.FC<HomeProps> = ({ setPage, language }) => {
  const t = {
    badge: language === 'en' ? 'New Standard in Medical Care' : 'Новый стандарт в медицине',
    h1Main: language === 'en' ? 'Medical documentation.' : 'Медицинская документация.',
    h1Sub: language === 'en' ? 'Reimagined by Intelligence.' : 'Усовершенствованная ИИ.',
    desc: language === 'en' 
      ? 'Record patient dialogue. Extract medical data. Instantly auto-fill Kazakhstan Form 075, 086, 027 and more with zero bureaucracy.' 
      : 'Записывайте диалог с пациентом. Извлекайте данные. Мгновенно заполняйте формы 075, 086, 027 и другие без бюрократии.',
    start: language === 'en' ? 'Start Now' : 'Начать сейчас',
    learn: language === 'en' ? 'Learn more' : 'Узнать больше',
    
    // Step 1
    step1Title: language === 'en' ? 'Natural Recording' : 'Естественная Запись',
    step1Desc: language === 'en' 
      ? 'Doctor converses naturally. No dictation commands needed. MedScribe listens in the background.' 
      : 'Врач ведет прием в свободном формате. Диктовка не нужна. MedScribe слушает в фоновом режиме.',
      
    // Step 2
    step2Title: language === 'en' ? 'Clinical Extraction' : 'Клинический Анализ',
    step2Desc: language === 'en' 
      ? 'AI filters small talk, identifies diagnoses, and structures medical facts with 99.9% accuracy.' 
      : 'ИИ отсеивает лишнее, определяет диагнозы и структурирует факты с точностью 99.9%.',
      
    // Step 3
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
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section - Reduced Top Padding */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 text-center relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] -z-10 opacity-60 pointer-events-none"></div>

        <div className="inline-block mb-8 px-5 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-blue-600 text-[11px] font-bold tracking-[0.2em] uppercase animate-fade-in-up">
          {t.badge}
        </div>
        
        {/* Headline - Enforced 2 Rows */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 mb-8 leading-tight">
          <span className="block mb-2">{t.h1Main}</span>
          <span className="block font-medium text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-gray-900 md:whitespace-nowrap">
            {t.h1Sub}
          </span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          {t.desc}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setPage(Page.APP)}
            className="group px-10 py-5 bg-gray-900 text-white rounded-full font-medium text-lg transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex items-center gap-3"
          >
            {t.start}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
             onClick={() => setPage(Page.ABOUT)}
             className="px-10 py-5 bg-white text-gray-600 border border-gray-100 rounded-full font-medium text-lg transition-all hover:bg-gray-50 hover:border-gray-200"
          >
            {t.learn}
          </button>
        </div>
      </section>

      {/* Luxury Feature Grid - ALL DARK */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-10 border border-gray-800 shadow-2xl shadow-gray-900/30 hover:shadow-blue-900/20 transition-all duration-700 hover:-translate-y-2 overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity font-serif text-[12rem] leading-none select-none pointer-events-none translate-x-10 -translate-y-10">1</div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                            <Mic size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-4">{t.step1Title}</h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            {t.step1Desc}
                        </p>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-10 border border-gray-800 shadow-2xl shadow-gray-900/30 hover:shadow-purple-900/20 transition-all duration-700 hover:-translate-y-2 delay-100 overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity font-serif text-[12rem] leading-none select-none pointer-events-none translate-x-10 -translate-y-10">2</div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                            <Sparkles size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-4">{t.step2Title}</h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            {t.step2Desc}
                        </p>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-10 border border-gray-800 shadow-2xl shadow-gray-900/30 hover:shadow-blue-500/20 transition-all duration-700 hover:-translate-y-2 delay-200 overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity font-serif text-[12rem] leading-none select-none pointer-events-none translate-x-10 -translate-y-10 text-white">3</div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                            <ScrollText size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-4 flex items-center gap-2">
                           {t.step3Title}
                           <span className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider">New</span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            {t.step3Desc}
                        </p>
                    </div>
                    <div className="mt-8 flex gap-2 overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                         <div className="text-[10px] uppercase border border-white/20 px-3 py-1 rounded-full">075/у</div>
                         <div className="text-[10px] uppercase border border-white/20 px-3 py-1 rounded-full">086/у</div>
                         <div className="text-[10px] uppercase border border-white/20 px-3 py-1 rounded-full">Rx</div>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end">
            <div className="max-w-xl">
                <h2 className="text-3xl font-light mb-6 whitespace-pre-line text-gray-900">{t.trustTitle}</h2>
                <div className="h-0.5 w-24 bg-blue-600 mb-6"></div>
                <p className="text-gray-500 font-light leading-relaxed">
                    {t.trustDesc}
                </p>
            </div>
            <div className="mt-12 md:mt-0 flex flex-wrap gap-x-12 gap-y-4 text-gray-400 font-medium text-sm tracking-wide uppercase">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> ISO 27001 Ready</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> GDPR Compliant</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> KZ MOH Standard</span>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;