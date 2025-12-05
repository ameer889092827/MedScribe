
import React, { useState } from 'react';
import { User, UserRole, Page, Language } from '../types';
import { Stethoscope, Building2, ArrowRight, Upload, Check, Stamp, Camera } from 'lucide-react';

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
  const [license, setLicense] = useState('');
  
  // Images
  const [sigImage, setSigImage] = useState<string>('');
  const [stampImage, setStampImage] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');

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
    specialty: language === 'en' ? 'Specialty' : 'Специальность',
    continue: language === 'en' ? 'Continue' : 'Продолжить',
    noAccount: language === 'en' ? "Don't have an account?" : 'Нет аккаунта?',
    hasAccount: language === 'en' ? 'Already have an account?' : 'Уже есть аккаунт?',
    signUp: language === 'en' ? 'Sign up' : 'Регистрация',
    signIn: language === 'en' ? 'Sign in' : 'Войти',
    uploadSig: language === 'en' ? 'Upload Signature (Optional)' : 'Загрузить подпись (Необяз.)',
    uploadStamp: language === 'en' ? 'Upload Stamp (Optional)' : 'Загрузить печать (Необяз.)',
    uploadPhoto: language === 'en' ? 'Photo' : 'Фото',
    change: language === 'en' ? 'Change' : 'Изменить',
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name: name || 'Dr. Alikhanov',
      email: email,
      role: role,
      organization: org || (role === 'doctor' ? 'City Polyclinic №4' : name + ' Medical Center'),
      specialty: specialty || 'Therapist',
      licenseId: license || 'KZ-0000000',
      signatureImage: sigImage,
      stampImage: stampImage,
      profilePhoto: profileImage
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
             <button type="button" onClick={() => setRole('doctor')} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'doctor' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Stethoscope size={24} /><span className="text-xs font-semibold uppercase tracking-wider">{t.doctor}</span></button>
             <button type="button" onClick={() => setRole('clinic')} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'clinic' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Building2 size={24} /><span className="text-xs font-semibold uppercase tracking-wider">{t.clinic}</span></button>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          
          {isRegistering && (
            <div className="flex justify-center mb-2">
                 <label className="relative cursor-pointer group">
                   <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden ${profileImage ? 'border-blue-500' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                     {profileImage ? (
                       <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                       <div className="text-center text-gray-400">
                         <Camera size={24} className="mx-auto mb-1" />
                         <span className="text-[10px] font-bold uppercase">{t.uploadPhoto}</span>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white text-xs font-bold">
                       {t.change}
                     </div>
                   </div>
                   <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, setProfileImage)} />
                 </label>
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.fullName}</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder={role === 'doctor' ? "Dr. Azamat Aliev" : "Admin Name"} />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.emailLabel}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="name@example.com" />
          </div>

          {!isRegistering && (
             <div><label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.password}</label><input type="password" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="••••••••" /></div>
          )}

          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.clinicName}</label>
                <input type="text" required value={org} onChange={(e) => setOrg(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="City Hospital №1" />
              </div>
              {role === 'doctor' && (
                <>
                    <div className="flex gap-4">
                         <div className="flex-1">
                             <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t.specialty}</label>
                             <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Therapist" />
                         </div>
                         <div className="flex-1">
                             <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">License ID</label>
                             <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="KZ-..." />
                         </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <label className={`flex-1 cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors ${sigImage ? 'border-green-500 bg-green-50 text-green-700' : 'border-dashed border-gray-300 hover:bg-gray-50'}`}>
                             {sigImage ? <Check size={20} /> : <Upload size={20} />}
                             <span className="text-[10px] text-center">{t.uploadSig}</span>
                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, setSigImage)} />
                        </label>
                        <label className={`flex-1 cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors ${stampImage ? 'border-green-500 bg-green-50 text-green-700' : 'border-dashed border-gray-300 hover:bg-gray-50'}`}>
                             {stampImage ? <Check size={20} /> : <Stamp size={20} />}
                             <span className="text-[10px] text-center">{t.uploadStamp}</span>
                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, setStampImage)} />
                        </label>
                    </div>
                </>
              )}
            </>
          )}

          <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20 mt-4">
            {t.continue} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
           {isRegistering ? t.hasAccount : t.noAccount}{' '}
           <button onClick={() => setIsRegistering(!isRegistering)} className="font-semibold text-blue-600 hover:text-blue-700">{isRegistering ? t.signIn : t.signUp}</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
