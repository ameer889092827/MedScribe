
import React, { useState, useEffect } from 'react';
import { User, Language, ConsultationRecord, AnalyticsInsight } from '../types';
import { UserCircle, Building2, BadgeCheck, FileSignature, Stamp, Mail, Hash, Briefcase, Activity, Sparkles, TrendingUp, Clock, Calendar, ArrowRight } from 'lucide-react';
import { generateDoctorInsights } from '../services/openRouterService';

interface ProfileProps {
  user: User | null;
  language: Language;
}

const Profile: React.FC<ProfileProps> = ({ user, language }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'insights'>('details');
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [insight, setInsight] = useState<AnalyticsInsight | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medscribe_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  if (!user) return null;

  const handleGenerateReport = async () => {
    setLoadingInsights(true);
    const result = await generateDoctorInsights(history);
    setInsight(result);
    setLoadingInsights(false);
  };

  const t = {
    profile: language === 'en' ? 'Profile' : 'Профиль',
    detailsTab: language === 'en' ? 'Professional Details' : 'Личные Данные',
    insightsTab: language === 'en' ? 'Practice Insights' : 'Аналитика',
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
    generateReport: language === 'en' ? 'Generate Monthly Report' : 'Создать отчет за месяц',
    emptyHistory: language === 'en' ? 'No consultation history available yet. Start using the workspace to generate insights.' : 'История консультаций пуста. Начните работу для получения аналитики.',
    generating: language === 'en' ? 'Analyzing your practice...' : 'Анализ вашей практики...',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        
        {/* Profile Header */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
            <div className="h-32 md:h-48 bg-gradient-to-r from-gray-900 to-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>
            <div className="px-6 md:px-8 pb-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end -mt-12 md:-mt-16 mb-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-2 shadow-lg ring-1 ring-gray-100 relative">
                             <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 border border-gray-100 overflow-hidden bg-white">
                                 {user.profilePhoto ? (
                                     <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                                 ) : (
                                     <span className="text-3xl md:text-4xl font-bold">{user.name.charAt(0)}</span>
                                 )}
                             </div>
                             <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white"></div>
                        </div>
                        <div className="mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{user.name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm font-medium mt-1">
                                <BadgeCheck size={16} className="text-blue-500" />
                                <span className="uppercase tracking-wide">{user.role}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="mt-6 md:mt-0 bg-gray-100 p-1 rounded-xl flex">
                        <button onClick={() => setActiveTab('details')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'details' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t.detailsTab}</button>
                        <button onClick={() => setActiveTab('insights')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'insights' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                           <Sparkles size={14} className={activeTab === 'insights' ? 'text-amber-500' : ''}/> {t.insightsTab}
                        </button>
                    </div>
                </div>

                {activeTab === 'details' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8 md:mt-12 border-t border-gray-100 pt-8 animate-fade-in">
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
                                      <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-gray-400 group-hover:text-blue-500 transition-colors"><Briefcase size={18} /></div>
                                      <div>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.org}</p>
                                          <p className="text-gray-900 font-medium">{user.organization || '-'}</p>
                                      </div>
                                  </div>
                                  <div className="group flex items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                      <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-gray-400 group-hover:text-blue-500 transition-colors"><Activity size={18} /></div>
                                      <div>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.specialty}</p>
                                          <p className="text-gray-900 font-medium">{user.specialty || '-'}</p>
                                      </div>
                                  </div>
                                  <div className="group flex items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                      <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-gray-400 group-hover:text-blue-500 transition-colors"><Hash size={18} /></div>
                                      <div>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.license}</p>
                                          <p className="text-gray-900 font-medium">{user.licenseId || '-'}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Right Column */}
                      <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <FileSignature size={14}/> {t.assets}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all h-48 relative overflow-hidden group">
                                  <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 relative z-10">
                                      <FileSignature size={20} />
                                  </div>
                                  <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide relative z-10">{t.signature}</p>
                                  {user.signatureImage ? (
                                      <img src={user.signatureImage} alt="Signature" className="h-12 object-contain relative z-10" />
                                  ) : (
                                      <span className="text-xs text-gray-400 italic relative z-10">{t.noAsset}</span>
                                  )}
                              </div>
                              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all h-48 relative overflow-hidden group">
                                   <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                   <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4 relative z-10">
                                      <Stamp size={20} />
                                  </div>
                                  <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide relative z-10">{t.stamp}</p>
                                  {user.stampImage ? (
                                      <img src={user.stampImage} alt="Stamp" className="h-16 w-16 object-contain relative z-10 opacity-80" />
                                  ) : (
                                      <span className="text-xs text-gray-400 italic relative z-10">{t.noAsset}</span>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
                ) : (
                  <div className="mt-8 animate-fade-in">
                      {history.length === 0 ? (
                          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                             <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Activity size={32} />
                             </div>
                             <p className="text-gray-500">{t.emptyHistory}</p>
                          </div>
                      ) : !insight ? (
                         <div className="text-center py-16 bg-[#0B0F17] rounded-3xl relative overflow-hidden text-white shadow-2xl">
                             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
                             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none -ml-20 -mb-20"></div>
                             
                             <div className="relative z-10 max-w-lg mx-auto px-6">
                                <Sparkles size={48} className="mx-auto mb-6 text-amber-400" />
                                <h2 className="text-3xl font-bold mb-4">Unlock Your Practice Insights</h2>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Our AI analyzes your consultation history to provide a "Spotify Wrapped" style summary of your month—highlighting top conditions, efficiency gains, and patient trends.
                                </p>
                                <button 
                                  onClick={handleGenerateReport}
                                  disabled={loadingInsights}
                                  className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                                >
                                    {loadingInsights ? (
                                        <><Clock className="animate-spin" size={20}/> {t.generating}</>
                                    ) : (
                                        <>{t.generateReport} <ArrowRight size={20}/></>
                                    )}
                                </button>
                             </div>
                         </div>
                      ) : (
                          <div className="space-y-6">
                              {/* Hero Card */}
                              <div className="bg-gradient-to-br from-[#1a1f35] to-[#0f1219] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                                  <div className="relative z-10">
                                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-amber-300 border border-white/10">
                                          <Sparkles size={12} /> Monthly Wrap-up
                                      </div>
                                      <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                                          {insight.title}
                                      </h2>
                                      <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl">
                                          "{insight.narrative}"
                                      </p>
                                  </div>
                              </div>

                              {/* Stats Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-[#FF5D5D] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                                      <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                          <Activity size={140} />
                                      </div>
                                      <div className="relative z-10">
                                          <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Top Condition</p>
                                          <p className="text-3xl md:text-4xl font-black leading-none">{insight.topCondition}</p>
                                      </div>
                                  </div>

                                  <div className="bg-[#4F46E5] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                                      <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                          <Calendar size={140} />
                                      </div>
                                      <div className="relative z-10">
                                          <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Total Patients</p>
                                          <p className="text-3xl md:text-4xl font-black leading-none">{insight.patientCountStr}</p>
                                      </div>
                                  </div>

                                  <div className="bg-[#10B981] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                                      <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                          <Clock size={140} />
                                      </div>
                                      <div className="relative z-10">
                                          <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Efficiency Gain</p>
                                          <p className="text-3xl md:text-4xl font-black leading-none">{insight.efficiencyGain}</p>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="text-center pt-8 pb-4">
                                  <button onClick={() => setInsight(null)} className="text-sm text-gray-400 hover:text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors">Generate New Report</button>
                              </div>
                          </div>
                      )}
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
