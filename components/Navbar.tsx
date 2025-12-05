
import React, { useState, useRef, useEffect } from 'react';
import { Stethoscope, UserCircle, LogOut, ChevronDown, User, Settings } from 'lucide-react';
import { Page, Language, User as UserType } from '../types';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserType | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage, language, setLanguage, user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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
    signOut: language === 'en' ? 'Sign Out' : 'Выйти',
    signedInAs: language === 'en' ? 'Signed in as' : 'Вы вошли как',
    profile: language === 'en' ? 'Profile Settings' : 'Профиль',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setPage(Page.HOME)}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transition-transform duration-500 group-hover:scale-105">
            <Stethoscope size={20} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
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
          <div className="flex items-center text-[10px] font-bold tracking-widest cursor-pointer bg-gray-100 px-2 py-1 rounded-md text-gray-400">
            <span 
              onClick={() => setLanguage('en')}
              className={`transition-colors px-1 ${language === 'en' ? 'text-gray-900' : 'hover:text-gray-600'}`}
            >
              EN
            </span>
            <span className="text-gray-300">/</span>
            <span 
               onClick={() => setLanguage('ru')}
               className={`transition-colors px-1 ${language === 'ru' ? 'text-gray-900' : 'hover:text-gray-600'}`}
            >
              RU
            </span>
          </div>
          
          {user ? (
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md ring-2 ring-white overflow-hidden">
                   {user.profilePhoto ? (
                     <img src={user.profilePhoto} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     <span className="font-bold text-xs">{user.name.charAt(0)}</span>
                   )}
                </div>
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">{user.name.split(' ')[0]}</p>
                   <p className="text-[9px] text-gray-400 uppercase tracking-wider leading-none">{user.role}</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-4 w-60 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right">
                  <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{t.signedInAs}</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                     <button 
                      onClick={() => { setPage(Page.PROFILE); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors font-medium"
                    >
                      <User size={16} />
                      {t.profile}
                    </button>
                    <button 
                      onClick={() => { onLogout(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      {t.signOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setPage(Page.LOGIN)}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transform"
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
