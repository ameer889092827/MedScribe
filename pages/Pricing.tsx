
import React from 'react';
import { Page, Language } from '../types';
import { Check, ArrowRight, ShieldCheck, Zap, Crown } from 'lucide-react';

interface PricingProps {
  setPage: (page: Page) => void;
  language: Language;
}

const Pricing: React.FC<PricingProps> = ({ setPage, language }) => {
  const t = {
    title: language === 'en' ? 'Simple, transparent pricing' : 'Простые и прозрачные тарифы',
    subtitle: language === 'en' ? 'Choose the plan that fits your practice.' : 'Выберите план, подходящий вашей практике.',
    monthly: language === 'en' ? '/month' : '/мес',
    getStarted: language === 'en' ? 'Get Started' : 'Начать',
    contactSales: language === 'en' ? 'Contact Sales' : 'Связаться',
    popular: language === 'en' ? 'Most Popular' : 'Популярный',
    enterprise: language === 'en' ? 'Enterprise' : 'VIP',
    
    plans: {
        free: {
            name: 'Free',
            target: language === 'en' ? 'Individual Doctors' : 'Индивидуальные врачи',
            features: language === 'en' ? ['7 reports per week', 'Basic functions'] : ['7 отчётов в неделю', 'Базовые функции'],
            price: '0$'
        },
        pro: {
            name: 'Pro',
            target: language === 'en' ? 'Private Doctors & Clinics' : 'Частные врачи и клиники',
            features: language === 'en' ? ['Unlimited reports', 'Integrations', 'Priority support'] : ['Неограниченные отчёты', 'Интеграции', 'Приоритетная поддержка'],
            price: '15$'
        },
        custom: {
            name: 'Custom',
            target: language === 'en' ? 'Clinic Chains & Hospitals' : 'Для сетей клиник и госпиталей',
            features: language === 'en' ? ['API + EMR integrations', 'Advanced analytics', 'White-label'] : ['API + EMR интеграции', 'Расширенная аналитика', 'White-label'],
            price: '199$'
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">{t.title}</h1>
            <p className="text-xl text-gray-500">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
           
           {/* Free */}
           <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-fade-in-up" style={{animationDelay: '0.1s'}}>
               <div className="mb-6">
                   <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 mb-4">
                        <ShieldCheck size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t.plans.free.name}</h3>
                   <p className="text-sm font-medium text-gray-500">{t.plans.free.target}</p>
               </div>
               <div className="mb-8">
                   <span className="text-5xl font-bold text-gray-900 tracking-tight">{t.plans.free.price}</span>
               </div>
               <div className="border-t border-gray-100 pt-8 mb-8 flex-grow">
                   <ul className="space-y-4">
                       {t.plans.free.features.map((f, i) => (
                           <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                               <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                   <Check size={12} strokeWidth={3} />
                               </div>
                               <span className="leading-tight">{f}</span>
                           </li>
                       ))}
                   </ul>
               </div>
               <button className="w-full py-3 px-6 rounded-xl bg-gray-50 text-gray-900 font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
                   {t.getStarted}
               </button>
           </div>

           {/* Pro (Highlighted White) */}
           <div className="bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-2xl shadow-blue-900/10 relative flex flex-col transform md:scale-105 z-10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
               <div className="mb-6">
                   <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        <Zap size={24} fill="currentColor" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t.plans.pro.name}</h3>
                   <p className="text-sm font-medium text-blue-600">{t.plans.pro.target}</p>
               </div>
               <div className="mb-8">
                   <span className="text-5xl font-bold text-gray-900 tracking-tight">{t.plans.pro.price}</span>
                   <span className="text-gray-400 font-medium ml-1">{t.monthly}</span>
               </div>
               <div className="border-t border-gray-100 pt-8 mb-8 flex-grow">
                   <ul className="space-y-4">
                       {t.plans.pro.features.map((f, i) => (
                           <li key={i} className="flex items-start gap-3 text-gray-700 text-sm font-medium">
                               <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                   <Check size={12} strokeWidth={3} />
                               </div>
                               <span className="leading-tight">{f}</span>
                           </li>
                       ))}
                   </ul>
               </div>
               <button className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group">
                   {t.getStarted} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
           </div>

           {/* Custom (Luxury Dark) */}
           <div className="bg-[#0B0F17] rounded-3xl p-8 border border-gray-800 shadow-2xl relative flex flex-col h-full animate-fade-in-up overflow-hidden" style={{animationDelay: '0.3s'}}>
               {/* Subtle gold glow effect */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
               
               <div className="relative z-10 mb-6">
                   <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center text-amber-500 mb-4 border border-gray-700">
                        <Crown size={24} fill="currentColor" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{t.plans.custom.name}</h3>
                   <p className="text-sm font-medium text-gray-400">{t.plans.custom.target}</p>
               </div>
               <div className="relative z-10 mb-8">
                   <span className="text-5xl font-bold text-white tracking-tight">{t.plans.custom.price}</span>
                   <span className="text-gray-500 font-medium ml-1">{t.monthly}</span>
               </div>
               <div className="relative z-10 border-t border-gray-800 pt-8 mb-8 flex-grow">
                   <ul className="space-y-4">
                       {t.plans.custom.features.map((f, i) => (
                           <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                               <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
                                   <Check size={12} strokeWidth={3} />
                               </div>
                               <span className="leading-tight">{f}</span>
                           </li>
                       ))}
                   </ul>
               </div>
               <button className="relative z-10 w-full py-3 px-6 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                   {t.contactSales}
               </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Pricing;
