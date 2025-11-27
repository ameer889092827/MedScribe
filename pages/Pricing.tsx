
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Page, Language } from '../types';

interface PricingProps {
  setPage: (page: Page) => void;
  language: Language;
}

const Pricing: React.FC<PricingProps> = ({ setPage, language }) => {
  const t = {
    title: language === 'en' ? 'Simple, transparent pricing' : 'Простое и прозрачное ценообразование',
    subtitle: language === 'en' ? 'Choose the plan that fits your practice.' : 'Выберите план, который подходит вашей практике.',
    monthly: language === 'en' ? '/ month' : '/ месяц',
    getStarted: language === 'en' ? 'Get Started' : 'Начать',
    contactSales: language === 'en' ? 'Contact Sales' : 'Связаться с отделом продаж',
    features: {
      docs5: language === 'en' ? '5 Documents / month' : '5 Документов / месяц',
      docsUnlimited: language === 'en' ? 'Unlimited Documents' : 'Безлимитные документы',
      templates: language === 'en' ? 'Standard Templates (075/y)' : 'Стандартные шаблоны (075/у)',
      customTemplates: language === 'en' ? 'Custom Templates' : 'Кастомные шаблоны',
      support: language === 'en' ? 'Email Support' : 'Email поддержка',
      prioritySupport: language === 'en' ? 'Priority 24/7 Support' : 'Приоритетная поддержка 24/7',
      analytics: language === 'en' ? 'Practice Analytics' : 'Аналитика практики',
      api: language === 'en' ? 'API Access' : 'API Доступ',
      admin: language === 'en' ? 'Admin Dashboard' : 'Панель администратора',
    }
  };

  const plans = [
    {
      name: language === 'en' ? 'Starter' : 'Стартовый',
      price: 'Free',
      desc: language === 'en' ? 'Perfect for trying out MedScribe.' : 'Идеально для знакомства с MedScribe.',
      features: [t.features.docs5, t.features.templates, t.features.support],
      highlight: false,
      cta: t.getStarted
    },
    {
      name: language === 'en' ? 'Professional' : 'Профессионал',
      price: '₸4,900',
      desc: language === 'en' ? 'For individual doctors with high volume.' : 'Для частных врачей с большим потоком.',
      features: [t.features.docsUnlimited, t.features.templates, t.features.analytics, t.features.prioritySupport],
      highlight: true,
      cta: t.getStarted
    },
    {
      name: language === 'en' ? 'Clinic' : 'Клиника',
      price: 'Custom',
      desc: language === 'en' ? 'For hospitals and large clinics.' : 'Для больниц и крупных клиник.',
      features: [t.features.docsUnlimited, t.features.customTemplates, t.features.admin, t.features.api],
      highlight: false,
      cta: t.contactSales
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">{t.title}</h1>
          <p className="text-xl text-gray-400 font-light">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2
                ${plan.highlight 
                  ? 'border-blue-200 bg-blue-50/50 shadow-xl shadow-blue-100' 
                  : 'border-gray-100 bg-white shadow-lg shadow-gray-100'}`}
            >
              {plan.highlight && (
                 <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-widest">
                    Popular
                 </div>
              )}
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-light text-gray-900">{plan.price}</span>
                {plan.price !== 'Custom' && plan.price !== 'Free' && <span className="text-gray-400 text-sm">{t.monthly}</span>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check size={18} className="text-blue-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setPage(Page.LOGIN)}
                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors
                  ${plan.highlight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'}`}
              >
                {plan.cta} <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
