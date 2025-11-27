
import React from 'react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = {
    rights: language === 'en' ? 'MedScribe AI. All rights reserved.' : 'MedScribe AI. Все права защищены.',
    privacy: language === 'en' ? 'Privacy' : 'Конфиденциальность',
    terms: language === 'en' ? 'Terms' : 'Условия',
    pricing: language === 'en' ? 'Pricing' : 'Цены',
    support: language === 'en' ? 'Support' : 'Поддержка',
  };

  return (
    <footer className="w-full bg-white py-12 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs tracking-wide">
        <p>&copy; 2025 {t.rights}</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-gray-900 cursor-pointer transition-colors">{t.pricing}</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">{t.privacy}</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">{t.terms}</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">{t.support}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
