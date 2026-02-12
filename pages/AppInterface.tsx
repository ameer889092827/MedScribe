
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, FileText, Loader2, RefreshCw, AlignLeft, Printer, ZoomIn, ZoomOut, AlertTriangle, Settings, ChevronDown, Check, History, Sparkles, Command, Cpu } from 'lucide-react';
import { generateForm, identifyFormType } from '../services/openRouterService';
import { Form075Data, Form027Data, Form003Data, Language, User, FormType, ConsultationRecord } from '../types';

interface AppInterfaceProps {
  language: Language;
  user: User | null;
}

const AppInterface: React.FC<AppInterfaceProps> = ({ language, user }) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'text'>('audio');
  const [selectedForm, setSelectedForm] = useState<FormType>('075');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState(''); // New: For real-time feedback
  
  // App State
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); 
  const [generatedData, setGeneratedData] = useState<any | null>(null);
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0.85);

  const recognitionRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const t = {
    title: language === 'en' ? 'Workspace' : 'Рабочая зона',
    subtitle: language === 'en' ? 'Powered by Qwen 2.5' : 'На базе Qwen 2.5',
    tapToRecord: language === 'en' ? 'Tap to Record' : 'Нажать для записи',
    recording: language === 'en' ? 'Listening...' : 'Слушаю...',
    audioCaptured: language === 'en' ? 'Transcript Ready' : 'Транскрипт готов',
    pasteText: language === 'en' ? 'Paste Notes / Dictation' : 'Вставьте заметки / Диктовку',
    generate: language === 'en' ? 'Generate Document' : 'Создать документ',
    processing: language === 'en' ? 'Thinking...' : 'Анализ...',
    switchingForm: language === 'en' ? 'Switching form to ' : 'Переключение формы на ',
    historyTitle: language === 'en' ? 'History' : 'Архив',
    reset: language === 'en' ? 'Reset' : 'Сброс',
    downloadWord: language === 'en' ? 'Download Word (DOCX)' : 'Скачать Word (DOCX)',
    clinicalSnapshot: language === 'en' ? 'Clinical Snapshot' : 'Клиническое резюме',
    provider: 'OpenRouter',
    langIndicator: language === 'en' ? 'EN' : 'RU',
  };

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // This initial setting might be overridden by startRecording, 
        // but we keep it for consistency.
        recognition.lang = language === 'en' ? 'en-US' : 'ru-RU';

        recognition.onresult = (event: any) => {
            let finalChunk = '';
            let interimChunk = '';

            // PERFORMANCE FIX: Iterate from resultIndex to avoid processing duplicate history
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const chunk = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalChunk += chunk;
                } else {
                    interimChunk += chunk;
                }
            }

            if (finalChunk) {
                setTranscript(prev => {
                    // Avoid appending if it's already identical (rare edge case in some browsers)
                    const cleanFinal = finalChunk.trim();
                    if (!cleanFinal) return prev;
                    return prev ? `${prev} ${cleanFinal}` : cleanFinal;
                });
                setInterimTranscript(''); 
            } else {
                setInterimTranscript(interimChunk);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error", event.error);
            if (event.error === 'not-allowed') {
                setError("Microphone permission denied.");
                setIsRecording(false);
            }
            if (event.error === 'no-speech') {
                // Ignore no-speech errors usually
            }
        };
        
        recognition.onend = () => {
             setIsRecording(false);
             setInterimTranscript('');
        };

        recognitionRef.current = recognition;
    } else {
        setError("Your browser does not support Web Speech API. Please use Chrome/Edge/Safari.");
    }
  }, [language]); // Re-initialize if language toggle switches

  useEffect(() => {
      const saved = localStorage.getItem('medscribe_history');
      if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (data: any, form: FormType) => {
      const newRecord: ConsultationRecord = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          patientName: data.patientName || 'Unknown Patient',
          formType: form,
          summary: data.shortSummary || '',
          data: data
      };
      const updated = [newRecord, ...history];
      setHistory(updated);
      localStorage.setItem('medscribe_history', JSON.stringify(updated));
  };

  const startRecording = () => {
    setError(null);
    if (recognitionRef.current) {
        try {
            // Force language update right before starting
            recognitionRef.current.lang = language === 'en' ? 'en-US' : 'ru-RU';
            recognitionRef.current.start();
            setIsRecording(true);
        } catch(e) {
            console.error(e);
            // If already started, stop and restart
            recognitionRef.current.stop();
            setTimeout(() => {
                recognitionRef.current.start();
                setIsRecording(true);
            }, 300);
        }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
        setInterimTranscript('');
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Determine input source
      const input = activeTab === 'audio' ? transcript : textInput;
      
      if (!input || input.trim().length < 5) {
          setError("Input is too short. Please record or type more details.");
          setIsProcessing(false);
          return;
      }

      setStatusMessage(t.processing);

      // 1. Detect Intent
      const detectedForm = await identifyFormType(input);
      let targetForm = selectedForm;
      
      if (detectedForm && detectedForm !== selectedForm) {
          setStatusMessage(`${t.switchingForm} ${detectedForm}...`);
          setSelectedForm(detectedForm);
          targetForm = detectedForm;
          await new Promise(r => setTimeout(r, 800));
      }

      // 2. Generate
      const data = await generateForm(input, targetForm);

      // 3. Apply User Profile
      if (user) {
        if (!data.healthcareFacility && user.organization) data.healthcareFacility = user.organization;
        if (!data.doctorName && user.name) {
          data.doctorName = user.name;
          if (user.licenseId) data.doctorName += `, ID: ${user.licenseId}`;
        }
      }

      setGeneratedData(data);
      addToHistory(data, targetForm);

    } catch (err: any) {
      console.error(err);
      setError("Generation failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (generatedData) setGeneratedData({ ...generatedData, [field]: value });
  };

  const InputLine: React.FC<{label: string, value: string, onChange: (val: string) => void}> = ({ label, value, onChange }) => (
    <div className="flex items-baseline"><span className="whitespace-nowrap mr-2 text-gray-700">{label}</span><div className="border-b border-black flex-grow"><input className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold text-gray-900" value={value || ''} onChange={(e) => onChange(e.target.value)} /></div></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4 md:px-6">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 no-print xl:col-span-4 h-fit relative xl:sticky xl:top-24">
          
          <div>
            <h2 className="text-3xl font-medium text-gray-900 mb-1">{t.title}</h2>
            <div className="flex items-center gap-2">
                <p className="text-gray-400 text-sm">{t.subtitle}</p>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">OpenRouter</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden transition-all">
             
             {/* Tabs */}
             <div className="flex justify-center mb-6">
                <div className="flex bg-gray-100/80 p-1 rounded-xl">
                   <button onClick={() => setActiveTab('audio')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'audio' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}><Mic size={14} className="inline mr-2 mb-0.5"/>Audio</button>
                   <button onClick={() => setActiveTab('text')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}><AlignLeft size={14} className="inline mr-2 mb-0.5"/>Text</button>
                </div>
             </div>

            {activeTab === 'audio' ? (
              <div className="flex flex-col items-center justify-center gap-6 min-h-[300px]">
                   
                   {/* Record Button */}
                   {!isRecording && !transcript && !interimTranscript && (
                     <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <div className="relative group">
                             <button onClick={startRecording} className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/20 hover:scale-105 transition-all active:scale-95 hover:bg-red-600 ring-4 ring-red-50 relative z-10"><Mic size={32} /></button>
                             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-300 uppercase tracking-wider whitespace-nowrap">Input: {t.langIndicator}</div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{t.tapToRecord}</p>
                     </div>
                   )}

                   {/* Stop Button */}
                   {isRecording && (
                       <div className="flex flex-col items-center gap-4 w-full">
                           <div className="relative">
                               <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                               <button onClick={stopRecording} className="relative w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all active:scale-95 ring-4 ring-gray-100"><Square size={28} fill="currentColor" /></button>
                           </div>
                           <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">{t.recording} ({t.langIndicator})</p>
                           
                           {/* Live Transcript Preview */}
                           <div className="w-full mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[80px] text-left">
                               <p className="text-sm text-gray-800 leading-relaxed">
                                   {transcript}
                                   <span className="text-gray-400 ml-1">{interimTranscript}</span>
                               </p>
                           </div>
                       </div>
                    )}
                   
                   {/* Result */}
                   {!isRecording && (transcript || interimTranscript) && (
                    <div className="flex flex-col items-center animate-fade-in w-full">
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50"><Check size={32} /></div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">{t.audioCaptured}</p>
                      
                      <div className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4 max-h-40 overflow-y-auto">
                           <p className="text-xs text-gray-600 italic leading-relaxed">
                               "{transcript}"
                           </p>
                      </div>
                      
                      <div className="flex gap-2">
                          <button onClick={() => { startRecording(); }} className="text-xs text-gray-500 hover:text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-lg">Continue Recording</button>
                          <button onClick={() => { setTranscript(''); setInterimTranscript(''); }} className="text-xs text-red-400 hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-lg flex items-center gap-1"><RefreshCw size={10}/> {t.reset}</button>
                      </div>
                    </div>
                   )}
              </div>
            ) : (
                <textarea className="w-full h-[300px] bg-gray-50/50 p-4 rounded-xl border border-transparent focus:border-blue-100 focus:bg-white focus:ring-0 resize-none text-gray-700 text-sm leading-relaxed placeholder:text-gray-300 transition-all outline-none" placeholder={t.pasteText} value={textInput} onChange={(e) => setTextInput(e.target.value)} />
            )}
          </div>

          <button disabled={isProcessing || (activeTab === 'audio' && !transcript) || (activeTab === 'text' && !textInput)} onClick={handleGenerate} className={`w-full py-4 rounded-xl font-medium text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10 ${isProcessing || (activeTab === 'audio' && !transcript) ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {isProcessing ? (
              <><Loader2 className="animate-spin" size={18} /> <span>{statusMessage}</span></>
            ) : (
              <>{t.generate} <Sparkles size={18} className="text-blue-200" /></>
            )}
          </button>
          
          {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex gap-2"><AlertTriangle size={16} className="mt-0.5" />{error}</div>}

           {/* History Widget */}
           <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col max-h-[300px]">
              <div className="flex items-center gap-2 mb-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-50 pb-2">
                  <History size={12}/> {t.historyTitle}
              </div>
              <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {history.length === 0 && <p className="text-gray-300 text-xs italic text-center py-4">No archives yet.</p>}
                  {history.map((rec) => (
                      <div key={rec.id} onClick={() => { setSelectedForm(rec.formType); setGeneratedData(rec.data); }} className="p-3 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-blue-100">
                          <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-800 text-xs">{rec.patientName}</span>
                              <span className="text-[9px] bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">Form {rec.formType}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 text-right">{new Date(rec.timestamp).toLocaleDateString()}</p>
                      </div>
                  ))}
              </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Preview */}
        <div className="flex flex-col gap-6 xl:col-span-8">
           {/* Toolbar */}
           <div className="no-print flex flex-wrap gap-4 justify-between items-center bg-white p-3 rounded-2xl border border-gray-200 shadow-sm relative xl:sticky xl:top-24 z-20">
             <div className="flex items-center gap-2 pl-2">
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700">
                        <span>Form {selectedForm}/у</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                          {['075', '027', '003'].map(f => (
                              <div key={f} onClick={() => { setSelectedForm(f as FormType); setGeneratedData(null); setIsDropdownOpen(false); }} className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex justify-between items-center border-b border-gray-50 last:border-0">
                                 Form {f}/у {selectedForm === f && <Check size={14} className="text-blue-600" />}
                              </div>
                          ))}
                      </div>
                    )}
                </div>
                <div className="h-4 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center">
                    <button onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ZoomOut size={16}/></button>
                    <span className="text-xs font-mono w-12 text-center text-gray-400">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ZoomIn size={16}/></button>
                </div>
             </div>
          </div>

          {/* Clinical Snapshot Card */}
          {generatedData && generatedData.shortSummary && (
              <div className="no-print bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4 animate-fade-in">
                  <div className="bg-white p-2 rounded-lg text-emerald-600 shadow-sm"><Sparkles size={18}/></div>
                  <div>
                      <h3 className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest mb-1">{t.clinicalSnapshot}</h3>
                      <p className="text-emerald-800 text-sm leading-relaxed">{generatedData.shortSummary}</p>
                  </div>
              </div>
          )}

          {/* Document Preview Area */}
          <div className="bg-gray-200/50 rounded-3xl border border-gray-300/50 shadow-inner h-[500px] md:h-[800px] overflow-auto flex justify-center p-4 md:p-8 relative">
            <div className={`print-area bg-white shadow-2xl transition-transform origin-top duration-200 ${!generatedData ? 'flex items-center justify-center' : ''}`}
                style={{ width: '794px', minHeight: '1123px', padding: '60px', transform: `scale(${zoomLevel})`, marginBottom: `${(zoomLevel - 1) * 1123}px` }}>
                
                {!generatedData ? (
                   <div className="flex flex-col items-center text-gray-300 no-print select-none">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><FileText size={40} strokeWidth={1} /></div>
                      <p className="font-medium text-gray-400">Document Preview</p>
                   </div>
                ) : (
                  <div style={{ fontFamily: '"Times New Roman", Times, serif' }} className="text-black text-[12pt] leading-snug w-full relative">
                      
                      {/* --- RENDER 075 --- */}
                      {selectedForm === '075' && (
                        <>
                          <div className="text-right text-[10pt] mb-6"><p>(по приказу МЗ РК от 30.10.2020 № ҚР ДСМ-175/2020)</p></div>
                          <div className="text-center font-bold mb-8"><p className="mb-2">Форма № 075/у</p><p>"Медицинская справка (врачебное профессионально-консультативное заключение)"</p></div>
                          <div className="space-y-4">
                              <InputLine label="Наименование МО" value={generatedData.healthcareFacility} onChange={(v) => handleFieldChange('healthcareFacility', v)} />
                              <InputLine label="ИИН" value={generatedData.iin} onChange={(v) => handleFieldChange('iin', v)} />
                              <InputLine label="Ф.И.О. (при его наличии)" value={generatedData.patientName} onChange={(v) => handleFieldChange('patientName', v)} />
                              <InputLine label="Дата рождения" value={generatedData.dateOfBirth} onChange={(v) => handleFieldChange('dateOfBirth', v)} />
                              <div className="flex items-center gap-8 py-1"><span>Пол</span>
                                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleFieldChange('gender', 'male')}><div className={`w-4 h-4 border border-black flex items-center justify-center`}>{generatedData.gender === 'male' && <div className="w-2.5 h-2.5 bg-black"></div>}</div><span>мужской</span></div>
                                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleFieldChange('gender', 'female')}><div className={`w-4 h-4 border border-black flex items-center justify-center`}>{generatedData.gender === 'female' && <div className="w-2.5 h-2.5 bg-black"></div>}</div><span>женский</span></div>
                              </div>
                              <InputLine label="Адрес проживания" value={generatedData.livingAddress} onChange={(v) => handleFieldChange('livingAddress', v)} />
                              <InputLine label="Адрес регистрации" value={generatedData.registrationAddress} onChange={(v) => handleFieldChange('registrationAddress', v)} />
                              <InputLine label="Место работы/учебы" value={generatedData.workPlace} onChange={(v) => handleFieldChange('workPlace', v)} />
                              <InputLine label="Должность" value={generatedData.position} onChange={(v) => handleFieldChange('position', v)} />
                              <InputLine label="Дата последнего медосмотра" value={generatedData.lastCheckupDate} onChange={(v) => handleFieldChange('lastCheckupDate', v)} />
                              <div className="flex flex-col"><span className="mb-1">Заболевания:</span><div className="border-b border-black w-full"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 resize-none font-serif text-[12pt] font-bold" rows={2} value={generatedData.pastIllnesses} onChange={(e) => handleFieldChange('pastIllnesses', e.target.value)}></textarea></div></div>
                              <div><p className="mb-1 text-[10pt]">Заключение:</p><div className="border-b border-black w-full"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 text-center font-bold text-blue-900 resize-none font-serif text-[12pt]" rows={2} value={generatedData.conclusion} onChange={(e) => handleFieldChange('conclusion', e.target.value)}></textarea></div></div>
                          </div>
                        </>
                      )}

                      {/* --- RENDER 027 --- */}
                      {selectedForm === '027' && (
                          <>
                            <div className="text-right text-[10pt] mb-4">Утверждена приказом и.о. Министра...</div>
                            <div className="text-center font-bold mb-8 text-[14pt]">Форма № 027/у<br/>ВЫПИСКА ИЗ МЕДИЦИНСКОЙ КАРТЫ</div>
                            <div className="space-y-4">
                                <InputLine label="1. Наименование МО:" value={generatedData.healthcareFacility} onChange={(v) => handleFieldChange('healthcareFacility', v)} />
                                <InputLine label="2. Дата выдачи:" value={generatedData.date} onChange={(v) => handleFieldChange('date', v)} />
                                <InputLine label="3. Ф.И.О. пациента:" value={generatedData.patientName} onChange={(v) => handleFieldChange('patientName', v)} />
                                <div><div className="mb-1">7. Полный диагноз:</div><div className="border-b border-black"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold" rows={3} value={generatedData.diagnosis} onChange={(e) => handleFieldChange('diagnosis', e.target.value)}></textarea></div></div>
                                <div><div className="mb-1">8. Проведенное лечение (заключение):</div><div className="border-b border-black"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold" rows={3} value={generatedData.conclusion} onChange={(e) => handleFieldChange('conclusion', e.target.value)}></textarea></div></div>
                            </div>
                          </>
                      )}
                      
                      {/* --- RENDER 003 --- */}
                      {selectedForm === '003' && (
                        <>
                           <h2 className="text-center font-bold text-[16pt] mb-6 leading-tight">МЕДИЦИНСКАЯ КАРТА<br/>стационарного пациента</h2>
                           <div className="space-y-2 text-[11pt]">
                              <InputLine label="1. Дата и время поступления" value={generatedData.admissionDate} onChange={(v) => handleFieldChange('admissionDate', v)} />
                              <InputLine label="8. Ф.И.О. пациента" value={generatedData.patientName} onChange={(v) => handleFieldChange('patientName', v)} />
                              <InputLine label="16. Диагноз клинический" value={generatedData.clinicalDiagnosis} onChange={(v) => handleFieldChange('clinicalDiagnosis', v)} />
                           </div>
                        </>
                      )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInterface;
