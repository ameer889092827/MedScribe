
import React from 'react';
import { User, Language } from '../types';
import { UserCircle, Building2, BadgeCheck, FileSignature, Stamp, Mail, Hash, Briefcase } from 'lucide-react';

interface ProfileProps {
  user: User | null;
  language: Language;
}

const Profile: React.FC<ProfileProps> = ({ user, language }) => {
  if (!user) return null;

  const t = {
    profile: language === 'en' ? 'Profile' : 'Профиль',
    personalInfo: language === 'en' ? 'Personal Information' : 'Личная информация',
    professionalInfo: language === 'en' ? 'Professional Details' : 'Профессиональные данные',
    assets: language === 'en' ? 'Digital Assets' : 'Цифровые активы',
    role: language === 'en' ? 'Role' : 'Роль',
    email: language === 'en' ? 'Email' : 'Email',
    org: language === 'en' ? 'Organization' : 'Организация',
    specialty: language === 'en' ? 'Specialty' : 'Специальность',
    license: language === 'en' ? 'License ID' : 'Номер лицензии',
    signature: language === 'en' ? 'Digital Signature' : 'Цифровая подпись',
    stamp: language === 'en' ? 'Official Stamp' : 'Печать врача',
    noAsset: language === 'en' ? 'Not uploaded' : 'Не загружено',
    edit: language === 'en' ? 'Edit Profile' : 'Редактировать',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        
        {/* Profile Header */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
            <div className="h-48 bg-gradient-to-r from-gray-900 to-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>
            <div className="px-8 pb-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-end -mt-16 mb-6">
                    <div className="flex items-end gap-6">
                        <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg ring-1 ring-gray-100 relative">
                             <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 border border-gray-100">
                                 <span className="text-4xl font-bold">{user.name.charAt(0)}</span>
                             </div>
                             <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                        </div>
                        <div className="mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{user.name}</h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-1">
                                <BadgeCheck size={16} className="text-blue-500" />
                                <span className="uppercase tracking-wide">{user.role}</span>
                            </div>
                        </div>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                        {t.edit}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 border-t border-gray-100 pt-8">
                    {/* Left Column */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <UserCircle size={14}/> {t.personalInfo}
                            </h3>
                            <div className="space-y-4">
                                <div className="group flex items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                    <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-gray-400 group-hover:text-blue-500 transition-colors"><Mail size={18} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.email}</p>
                                        <p className="text-gray-900 font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <div className="group flex items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                    <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-gray-400 group-hover:text-blue-500 transition-colors"><BadgeCheck size={18} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.role}</p>
                                        <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Building2 size={14}/> {t.professionalInfo}
                            </h3>
                            <div className="space-y-4">
                                <div className="group flex items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                    <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-gray-400 group-hover:text-blue-500 transition-colors"><Building2 size={18} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.org}</p>
                                        <p className="text-gray-900 font-medium">{user.organization || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="group flex-1 flex items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.specialty}</p>
                                            <p className="text-gray-900 font-medium truncate">{user.specialty || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="group flex-1 flex items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.license}</p>
                                            <p className="text-gray-900 font-medium font-mono">{user.licenseId || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Assets */}
                    <div>
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileSignature size={14}/> {t.assets}
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            {/* Signature Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FileSignature size={64} />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileSignature size={16} className="text-blue-500"/> {t.signature}</p>
                                <div className="h-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative group-hover:border-blue-200 transition-colors">
                                    {user.signatureImage ? (
                                        <img src={user.signatureImage} alt="Signature" className="h-16 object-contain opacity-80 mix-blend-multiply" />
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">{t.noAsset}</span>
                                    )}
                                </div>
                            </div>

                             {/* Stamp Card */}
                             <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Stamp size={64} />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Stamp size={16} className="text-blue-500"/> {t.stamp}</p>
                                <div className="h-32 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                                    {user.stampImage ? (
                                        <img src={user.stampImage} alt="Stamp" className="h-24 w-24 object-contain opacity-80 mix-blend-multiply" />
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">{t.noAsset}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
