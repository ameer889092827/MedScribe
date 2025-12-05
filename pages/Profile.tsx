
import React, { useState, useEffect } from 'react';
import { User, Language, ConsultationRecord, AnalyticsInsight } from '../types';
import { UserCircle, Building2, BadgeCheck, FileSignature, Stamp, Mail, Hash, Briefcase, Activity, Sparkles, TrendingUp, Clock, Calendar } from 'lucide-react';
import { generateDoctorInsights } from '../services/geminiService';

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
                             <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 border border-gray-100 overflow-hidden bg-white">
                                 {user.profilePhoto ? (
                                     <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                                 ) : (
                                     <span className="text-4xl font-bold">{user.name.charAt(0)}</span>
                                 )}
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
                    
                    {/* Tabs */}
                    <div className="mt-4 md:mt-0 bg-gray-100 p-1 rounded-xl flex">
                        <button onClick={() => setActiveTab('details')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'details' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t.detailsTab}</button>
                        <button onClick={() => setActiveTab('insights')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'insights' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                           <Sparkles size={14} className={activeTab === 'insights' ? 'text-amber-500' : ''}/> {t.insightsTab}
                        </button>
                    </div>
                </div>

                {activeTab === 'details' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 border-t border-gray-100 pt-8 animate-fade-in">
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
                ) : (
                  <div className="mt-8 animate-fade-in pb-8">
                     {/* Insights Tab Content */}
                     {history.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                           <Activity size={48} className="mx-auto mb-4 opacity-20" />
                           <p>{t.emptyHistory}</p>
                        </div>
                     ) : (
                        <div>
                           {!insight ? (
                             <div className="flex flex-col items-center justify-center py-20">
                               <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/30 animate-pulse">
                                   <Sparkles className="text-white" size={32} />
                               </div>
                               <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to see your impact?</h2>
                               <p className="text-gray-500 mb-8 text-center max-w-md">We analyze your recent consultations to generate a personalized performance report.</p>
                               <button 
                                 onClick={handleGenerateReport} 
                                 disabled={loadingInsights}
                                 className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                               >
                                 {loadingInsights ? <Activity className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                 {loadingInsights ? "Analyzing..." : t.generateReport}
                               </button>
                             </div>
                           ) : (
                             <div className="animate-fade-in-up">
                               {/* HERO CARD - Spotify Style */}
                               <div className="bg-gradient-to-br from-[#1E1E1E] to-black rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-900/20 mb-8">
                                  {/* Background Abstract */}
                                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-green-400 to-emerald-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-full blur-[80px] opacity-20 -ml-10 -mb-10"></div>
                                  
                                  <div className="relative z-10">
                                     <div className="uppercase tracking-widest text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2"><Sparkles size={14}/> Monthly Wrap</div>
                                     <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{insight.title}</h2>
                                     <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed max-w-2xl">
                                       "{insight.narrative}"
                                     </p>
                                  </div>
                               </div>

                               {/* METRICS GRID */}
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-[#111] text-white p-8 rounded-[2rem] relative overflow-hidden group">
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                      <div className="relative z-10">
                                          <div className="mb-4 text-purple-400"><TrendingUp size={24}/></div>
                                          <div className="text-5xl font-bold mb-2">{insight.patientCountStr}</div>
                                          <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Treated This Month</div>
                                      </div>
                                  </div>

                                  <div className="bg-[#111] text-white p-8 rounded-[2rem] relative overflow-hidden group">
                                      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                      <div className="relative z-10">
                                          <div className="mb-4 text-amber-400"><Activity size={24}/></div>
                                          <div className="text-3xl font-bold mb-2 truncate">{insight.topCondition}</div>
                                          <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Top Condition</div>
                                      </div>
                                  </div>

                                  <div className="bg-[#111] text-white p-8 rounded-[2rem] relative overflow-hidden group">
                                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                      <div className="relative z-10">
                                          <div className="mb-4 text-emerald-400"><Clock size={24}/></div>
                                          <div className="text-5xl font-bold mb-2">{insight.efficiencyGain}</div>
                                          <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Time Saved</div>
                                      </div>
                                  </div>
                               </div>

                               <div className="mt-8 text-center">
                                  <button onClick={() => setInsight(null)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                                     Generate New Report
                                  </button>
                               </div>
                             </div>
                           )}
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
