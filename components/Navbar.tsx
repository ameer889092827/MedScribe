
import React from 'react';
import { Stethoscope, UserCircle } from 'lucide-react';
import { Page, Language, User } from '../types';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage, language, setLanguage, user, onLogout }) => {
  const linkClass = (page: Page) => 
    `cursor-pointer text-sm font-medium transition-colors duration-300 ${
      currentPage === page ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
    }`;

  const t = {
    overview: language === 'en' ? 'Overview' : 'Обзор',
    workspace: language === 'en' ? 'Workspace' : 'Рабочая зона',
    about: language === 'en' ? 'About' : 'О нас',
    pricing: language === 'en' ? 'Pricing' : 'Цены',
    start: language === 'en' ? 'Start Session' : 'Начать',
    signIn: language === 'en' ? 'Sign In' : 'Войти',
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setPage(Page.HOME)}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 transition-transform duration-500 group-hover:scale-105">
            <Stethoscope size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            MedScribe
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          <span onClick={() => setPage(Page.HOME)} className={linkClass(Page.HOME)}>{t.overview}</span>
          <span onClick={() => setPage(Page.APP)} className={linkClass(Page.APP)}>{t.workspace}</span>
          <span onClick={() => setPage(Page.PRICING)} className={linkClass(Page.PRICING)}>{t.pricing}</span>
          <span onClick={() => setPage(Page.ABOUT)} className={linkClass(Page.ABOUT)}>{t.about}</span>
        </div>

        {/* Language & CTA */}
        <div className="flex items-center gap-6">
          <div className="flex items-center text-xs font-semibold tracking-widest cursor-pointer">
            <span 
              onClick={() => setLanguage('en')}
              className={`transition-colors ${language === 'en' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              EN
            </span>
            <span className="text-gray-200 mx-1">|</span>
            <span 
               onClick={() => setLanguage('ru')}
               className={`transition-colors ${language === 'ru' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              RU
            </span>
          </div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-gray-900">{user.name}</p>
                 <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</p>
              </div>
              <div 
                onClick={onLogout}
                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <UserCircle size={20} />
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setPage(Page.LOGIN)}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              {t.signIn}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
