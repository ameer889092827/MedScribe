
import React from 'react';
import { Language } from '../types';

interface AboutProps {
  language: Language;
}

const About: React.FC<AboutProps> = ({ language }) => {
  const t = {
    h1: language === 'en' ? 'Doctors should treat patients, ' : 'Врачи должны лечить, ',
    h1Sub: language === 'en' ? 'not fill paperwork.' : 'а не заполнять бумаги.',
    probTitle: language === 'en' ? 'The Problem' : 'Проблема',
    probDesc: language === 'en' 
      ? 'In Kazakhstan, doctors spend up to 40% of their consultation time manually filling out mandatory forms like Form 075. This bureaucracy reduces the time available for actual patient care, increases physician burnout, and creates long queues in clinics.'
      : 'В Казахстане врачи тратят до 40% времени приема на заполнение форм, таких как 075/у. Эта бюрократия сокращает время на пациента, вызывает выгорание врачей и создает очереди в поликлиниках.',
    solTitle: language === 'en' ? 'The Solution' : 'Решение',
    solDesc: language === 'en'
      ? 'MedScribe utilizes advanced Generative AI to listen to the natural conversation between a doctor and a patient. It understands medical context, filters out small talk, and extracts precise clinical data to populate official documents instantly.'
      : 'MedScribe использует генеративный ИИ для анализа диалога врача и пациента. Система понимает контекст, отсеивает лишнее и извлекает точные клинические данные для мгновенного заполнения официальных документов.',
    visTitle: language === 'en' ? 'Our Vision' : 'Видение',
    visDesc: language === 'en'
      ? 'We envision a future where the medical interface is invisible. No typing, no clicking—just conversation. MedScribe is the first step towards an autonomous medical assistant that handles the administrative burden, letting doctors focus on what they do best: healing.'
      : 'Мы видим будущее, где медицинский интерфейс невидим. Никакого набора текста — только разговор. MedScribe — первый шаг к автономному ассистенту, который берет на себя административную нагрузку.',
    pilotTitle: language === 'en' ? 'Interested in a pilot?' : 'Хотите попробовать?',
    pilotDesc: language === 'en' ? 'We are rolling out beta access to select clinics in Almaty and Astana.' : 'Мы открываем бета-доступ для избранных клиник Алматы и Астаны.',
    contact: language === 'en' ? 'Contact Sales' : 'Связаться с нами'
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-12">
          {t.h1}<br/>
          <span className="text-gray-400">{t.h1Sub}</span>
        </h1>

        <div className="space-y-16">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">{t.probTitle}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.probDesc}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">{t.solTitle}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.solDesc}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">{t.visTitle}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.visDesc}
            </p>
          </section>

          <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
             <h3 className="text-blue-900 font-semibold mb-2">{t.pilotTitle}</h3>
             <p className="text-blue-700/80 mb-6">{t.pilotDesc}</p>
             <button className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-blue-600 pb-1 hover:text-blue-800 transition-colors">
                {t.contact}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
