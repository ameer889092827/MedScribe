
import React, { useState } from 'react';
import { User, UserRole, Page, Language } from '../types';
import { Stethoscope, Building2, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  setPage: (page: Page) => void;
  language: Language;
}

const Login: React.FC<LoginProps> = ({ onLogin, setPage, language }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('doctor');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [specialty, setSpecialty] = useState('');

  const t = {
    welcomeBack: language === 'en' ? 'Welcome Back' : 'С возвращением',
    createAccount: language === 'en' ? 'Create Account' : 'Создать аккаунт',
    subtitleLogin: language === 'en' ? 'Enter your details to access your workspace.' : 'Введите данные для входа в рабочую зону.',
    subtitleRegister: language === 'en' ? 'Join thousands of doctors saving time.' : 'Присоединяйтесь к тысячам врачей, экономящим время.',
    iAm: language === 'en' ? 'I am a...' : 'Я...',
    doctor: language === 'en' ? 'Doctor' : 'Врач',
    clinic: language === 'en' ? 'Clinic' : 'Клиника',
    fullName: language === 'en' ? 'Full Name' : 'ФИО',
    emailLabel: language === 'en' ? 'Email Address' : 'Email адрес',
    password: language === 'en' ? 'Password' : 'Пароль',
    clinicName: language === 'en' ? 'Clinic / Hospital Name' : 'Название Клиники / Больницы',
    specialty: language === 'en' ? 'Specialty' : 'Специальность (например, Терапевт)',
    license: language === 'en' ? 'License / ID Number (Optional)' : 'Номер лицензии / ID (Необязательно)',
    continue: language === 'en' ? 'Continue' : 'Продолжить',
    noAccount: language === 'en' ? "Don't have an account?" : 'Нет аккаунта?',
    hasAccount: language === 'en' ? 'Already have an account?' : 'Уже есть аккаунт?',
    signUp: language === 'en' ? 'Sign up' : 'Регистрация',
    signIn: language === 'en' ? 'Sign in' : 'Войти',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Authentication
    const newUser: User = {
      id: Date.now().toString(),
      name: name || 'Dr. Alikhanov',
      email: email,
      role: role,
      organization: org || (role === 'doctor' ? 'City Polyclinic №4' : name + ' Medical Center'),
      specialty: specialty || 'Therapist',
      licenseId: 'KZ-12345678'
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            {isRegistering ? t.createAccount : t.welcomeBack}
          </h1>
          <p className="text-gray-400 text-sm">
            {isRegistering ? t.subtitleRegister : t.subtitleLogin}
          </p>
        </div>

        {isRegistering && (
           <div className="flex gap-4 mb-8">
             <button 
               type="button"
               onClick={() => setRole('doctor')}
               className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'doctor' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
             >
               <Stethoscope size={24} />
               <span className="text-xs font-semibold uppercase tracking-wider">{t.doctor}</span>
             </button>
             <button 
               type="button"
               onClick={() => setRole('clinic')}
               className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'clinic' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
             >
               <Building2 size={24} />
               <span className="text-xs font-semibold uppercase tracking-wider">{t.clinic}</span>
             </button>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.fullName}</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={role === 'doctor' ? "Dr. Azamat Aliev" : "Administrator Name"}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.emailLabel}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="name@example.com"
            />
          </div>

          {!isRegistering && (
             <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.password}</label>
                <input 
                  type="password" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
             </div>
          )}

          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.clinicName}</label>
                <input 
                  type="text" 
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="City Hospital №1"
                />
              </div>

              {role === 'doctor' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.specialty}</label>
                  <input 
                    type="text" 
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Therapist / Cardiologist"
                  />
                </div>
              )}
            </>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20 mt-4"
          >
            {t.continue} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
           {isRegistering ? t.hasAccount : t.noAccount}{' '}
           <button 
             onClick={() => setIsRegistering(!isRegistering)}
             className="font-semibold text-blue-600 hover:text-blue-700"
           >
             {isRegistering ? t.signIn : t.signUp}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
