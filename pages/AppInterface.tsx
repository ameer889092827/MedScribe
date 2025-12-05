
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, FileText, Loader2, RefreshCw, UploadCloud, AlignLeft, Printer, ZoomIn, ZoomOut, AlertTriangle, Settings, ChevronDown, Check, History, Sparkles, FileType } from 'lucide-react';
import { generateFormFromAudio, generateFormFromText, setManualApiKey } from '../services/geminiService';
import { Form075Data, Form027Data, Form003Data, Language, User, FormType, ConsultationRecord } from '../types';

interface AppInterfaceProps {
  language: Language;
  user: User | null;
}

const AppInterface: React.FC<AppInterfaceProps> = ({ language, user }) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'text'>('audio');
  const [selectedForm, setSelectedForm] = useState<FormType>('075');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [generatedData, setGeneratedData] = useState<any | null>(null);
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [isConfigError, setIsConfigError] = useState(false);
  const [manualKeyInput, setManualKeyInput] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const t = {
    title: language === 'en' ? 'Workspace' : 'Рабочая зона',
    subtitle: language === 'en' ? 'Create new documentation' : 'Создать новую документацию',
    tapToRecord: language === 'en' ? 'Tap to Record' : 'Нажать для записи',
    audioCaptured: language === 'en' ? 'Audio Captured' : 'Аудио записано',
    upload: language === 'en' ? 'Or upload audio file' : 'Или загрузить файл',
    pasteText: language === 'en' ? 'Paste Notes / Dictation' : 'Вставьте заметки / Диктовку',
    generate: language === 'en' ? 'Generate Document' : 'Создать документ',
    processing: language === 'en' ? 'Analyzing...' : 'Анализ...',
    previewTitle: language === 'en' ? 'Preview' : 'Предпросмотр',
    historyTitle: language === 'en' ? 'History' : 'Архив',
    reset: language === 'en' ? 'Reset' : 'Сброс',
    configErrorTitle: language === 'en' ? 'Setup Required' : 'Требуется Настройка',
    configErrorDesc: language === 'en' ? 'Missing VITE_API_KEY. REDEPLOY required.' : 'Отсутствует VITE_API_KEY. Требуется REPLOY.',
    enterKeyManually: language === 'en' ? 'Enter API Key manually:' : 'Введите API Key вручную:',
    saveKey: language === 'en' ? 'Save & Retry' : 'Сохранить',
    clinicalSnapshot: language === 'en' ? 'Clinical Snapshot' : 'Клиническое резюме',
    downloadWord: language === 'en' ? 'Download Word (DOCX)' : 'Скачать Word (DOCX)',
    print: language === 'en' ? 'Print / PDF' : 'Печать / PDF',
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
      const saved = localStorage.getItem('medscribe_history');
      if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (generatedData && user) {
       const newData = { ...generatedData };
       let changed = false;
       if ((!newData.healthcareFacility || newData.healthcareFacility === '') && user.organization) {
         newData.healthcareFacility = user.organization;
         changed = true;
       }
       if ((!newData.doctorName || newData.doctorName === '') && user.name) {
         newData.doctorName = user.name;
         if (user.licenseId) newData.doctorName += `, ID: ${user.licenseId}`;
         changed = true;
       }
       if (changed) setGeneratedData(newData);
    }
  }, [user, generatedData]);

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

  const handleSelectForm = (form: FormType) => {
    setSelectedForm(form);
    setGeneratedData(null); 
    setIsDropdownOpen(false);
  };

  const loadFromHistory = (record: ConsultationRecord) => {
      setSelectedForm(record.formType);
      setGeneratedData(record.data);
  };

  const startRecording = async () => {
    try {
      setError(null);
      setIsConfigError(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setElapsedTime(0);
      setGeneratedData(null);
      timerRef.current = window.setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    setError(null);
    setIsConfigError(false);

    try {
      let data: any;
      if (activeTab === 'audio') {
        if (!audioBlob) return;
        data = await generateFormFromAudio(audioBlob, selectedForm);
      } else {
        if (!textInput.trim()) return;
        data = await generateFormFromText(textInput, selectedForm);
      }

      if (user) {
        if (!data.healthcareFacility && user.organization) data.healthcareFacility = user.organization;
        if (!data.doctorName && user.name) {
          data.doctorName = user.name;
          if (user.licenseId) data.doctorName += `, ID: ${user.licenseId}`;
        }
      }

      setGeneratedData(data);
      addToHistory(data, selectedForm);

    } catch (err: any) {
      console.error("Generation failed:", err);
      const errorMessage = err?.message || "";
      if (errorMessage === "MISSING_API_KEY" || errorMessage.includes("API Key")) {
        setIsConfigError(true);
      } else {
        setError("Failed to generate form. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (generatedData) setGeneratedData({ ...generatedData, [field]: value });
  };

  const handleDownloadDOCX = () => {
    if (!generatedData) return;
    
    // Simple helper to avoid code duplication in template string
    const row = (label: string, value: string) => `
      <tr style="height: 30px;">
        <td style="white-space: nowrap; padding-right: 10px; vertical-align: bottom;">${label}</td>
        <td style="border-bottom: 1px solid black; text-align: center; vertical-align: bottom; font-weight: bold; width: 100%;">${value || ''}</td>
      </tr>
    `;
    const checkbox = (label: string, isChecked: boolean) => `
      <span style="margin-right: 20px;">
        <span style="font-family: 'Courier New', monospace; font-size: 14pt;">${isChecked ? '[X]' : '[ ]'}</span> ${label}
      </span>
    `;

    let bodyContent = '';

    // --- FORM 075/y ---
    if (selectedForm === '075') {
        const data = generatedData as Form075Data;
        bodyContent = `
        <p align="right" style="font-size: 10pt; margin-bottom: 20px;">(по приказу МЗ РК от 30.10.2020 № ҚР ДСМ-175/2020)</p>
        <p align="center" style="font-weight: bold; margin-bottom: 5px; font-size: 14pt;">Форма № 075/у</p>
        <p align="center" style="font-weight: bold; margin-bottom: 30px;">"Медицинская справка (врачебное профессионально-консультативное заключение)"</p>
        <table>
          ${row("Наименование МО", data.healthcareFacility)}
          ${row("ИИН", data.iin)}
          ${row("Ф.И.О. (при его наличии)", data.patientName)}
          ${row("Дата рождения", data.dateOfBirth)}
        </table>
        <div style="margin: 15px 0;">
          <span style="margin-right: 20px;">Пол:</span>
          ${checkbox("мужской", data.gender === 'male')}
          ${checkbox("женский", data.gender === 'female')}
        </div>
        <table>
          ${row("Адрес проживания", data.livingAddress)}
          ${row("Адрес регистрации", data.registrationAddress)}
          ${row("Место работы/учебы/детского учреждения", data.workPlace)}
          ${row("Должность", data.position)}
          ${row("Дата последнего медицинского обследования", data.lastCheckupDate)}
        </table>
        <p style="margin-top: 15px; margin-bottom: 5px;">Заболевания, выявленные с момента последнего медосмотра наименование:</p>
        <div style="border-bottom: 1px solid black; min-height: 40px; margin-bottom: 20px; font-weight: bold;">${data.pastIllnesses}</div>
        <hr style="border-top: 2px solid black; margin: 30px 0;" />
        <p style="font-size: 10pt; margin-bottom: 5px;">Врач Ф.И.О. (ПРИ ЕГО НАЛИЧИИ), идентификатор:</p>
        <div style="border-bottom: 1px solid black; text-align: center; font-weight: bold; font-style: italic; margin-bottom: 20px;">${data.doctorName}</div>
        <p style="font-size: 10pt; margin-bottom: 5px;">Заключение терапевта/ВОП:</p>
        <div style="border-bottom: 1px solid black; text-align: center; font-weight: bold; color: #000000;">${data.conclusion}</div>
        `;
    }

    // --- FORM 027/y ---
    else if (selectedForm === '027') {
        const data = generatedData as Form027Data;
        bodyContent = `
        <p align="right" style="font-size: 10pt; margin-bottom: 20px;">Утверждена приказом и.о. Министра<br/>здравоохранения Республики Казахстан<br/>от 30 октября 2020 года № ҚР ДСМ-175/2020</p>
        <p align="center" style="font-weight: bold; margin-bottom: 30px; font-size: 14pt;">Форма № 027/у<br/>ВЫПИСКА ИЗ МЕДИЦИНСКОЙ КАРТЫ АМБУЛАТОРНОГО,<br/>СТАЦИОНАРНОГО БОЛЬНОГО</p>
        <table>
          ${row("1. Наименование МО", data.healthcareFacility)}
          ${row("2. Дата выдачи", data.date)}
          ${row("3. Ф.И.О. пациента", data.patientName)}
          ${row("4. Дата рождения", data.dateOfBirth)}
          ${row("5. Адрес проживания", data.address)}
          ${row("6. Место работы/учебы", data.workPlace)}
        </table>
        <div style="margin-top: 15px;">7. Полный диагноз:</div>
        <div style="border-bottom: 1px solid black; font-weight: bold; margin-bottom: 15px;">${data.diagnosis}</div>
        <div style="margin-top: 15px;">8. Проведенное лечение (заключение):</div>
        <div style="border-bottom: 1px solid black; min-height: 40px; font-weight: bold; margin-bottom: 15px;">${data.conclusion}</div>
        <div style="margin-top: 15px;">9. Лечебно-трудовые рекомендации:</div>
        <div style="border-bottom: 1px solid black; min-height: 40px; font-weight: bold; margin-bottom: 15px;">${data.recommendations}</div>
        <div style="margin-top: 30px;">Врач:</div>
        <div style="border-bottom: 1px solid black; font-weight: bold;">${data.doctorName}</div>
        `;
    }

    // --- FORM 003/y ---
    else if (selectedForm === '003') {
        const data = generatedData as Form003Data;
        bodyContent = `
        <table style="width: 100%; border: none;">
            <tr>
                <td style="text-align: left; vertical-align: top; width: 50%;">
                   <span style="text-decoration: underline; font-weight: bold;">${data.healthcareFacility}</span><br>
                   наименование медицинской организации
                </td>
                <td style="text-align: right; vertical-align: top; width: 50%;">
                    Утверждена приказом и.о. Министра<br/>здравоохранения Республики Казахстан<br/>от 30 октября 2020 года № ҚР ДСМ-175/2020<br/><br/>
                    <b>Форма № 003/у</b>
                </td>
            </tr>
        </table>
        <h2 style="text-align: center; margin: 20px 0;">МЕДИЦИНСКАЯ КАРТА<br>стационарного пациента</h2>
        <table>
            ${row("1. Дата и время поступления", data.admissionDate)}
            ${row("2. Дата и время выписки", data.dischargeDate)}
        </table>
        <table style="margin-top: 10px;">
            <tr>
                <td style="width: 70%; border-bottom: 1px solid black;">3. Отделение: <b>${data.department}</b></td>
                <td style="width: 30%; border-bottom: 1px solid black; border-left: 1px solid white;">Палата №: <b>${data.ward}</b></td>
            </tr>
        </table>
        ${row("4. Проведено койко-дней", data.daysSpent)}
        ${row("5. Вид транспортировки", data.transportType)}
        <table style="margin-top: 5px;">
           <tr>
              <td style="width: 50%; border-bottom: 1px solid black;">6. Группа крови: <b>${data.bloodType}</b></td>
              <td style="width: 50%; border-bottom: 1px solid black;">Резус: <b>${data.rhFactor}</b></td>
           </tr>
        </table>
        ${row("7. Побочное действие лекарств", data.sideEffects)}
        <hr style="border-top: 1px solid black; margin: 15px 0;">
        ${row("8. Ф.И.О. пациента", data.patientName)}
        <div style="margin: 5px 0;">9. Пол: ${checkbox("М", data.gender === 'male')} ${checkbox("Ж", data.gender === 'female')}</div>
        ${row("10. Дата рождения (Возраст)", data.age)}
        ${row("11. Место жительства", data.address)}
        ${row("12. Место работы", data.workPlace)}
        ${row("13. Кем направлен", data.referredBy)}
        <div style="margin: 5px 0;">14. Доставлен по экстренным показаниям: ${checkbox("Да", data.emergency)} ${checkbox("Нет", !data.emergency)}</div>
        ${row("15. Диагноз направившего", data.referralDiagnosis)}
        ${row("16. Диагноз клинический", data.clinicalDiagnosis)}
        ${row("17. Дата установления", data.diagnosisDate)}
        <div style="margin-top: 30px;">Врач:</div>
        <div style="border-bottom: 1px solid black; font-weight: bold;">${data.doctorName}</div>
        `;
    }

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'><title>Document</title>
        <style>body { font-family: 'Times New Roman', serif; font-size: 12pt; } table { width: 100%; border-collapse: collapse; margin-bottom: 5px; } td { padding-bottom: 2px; }</style>
      </head>
      <body>${bodyContent}</body></html>
    `;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `MedScribe_Form_${selectedForm}_${generatedData.patientName || 'Doc'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const InputLine: React.FC<{label: string, value: string, onChange: (val: string) => void}> = ({ label, value, onChange }) => (
    <div className="flex items-baseline"><span className="whitespace-nowrap mr-2 text-gray-700">{label}</span><div className="border-b border-black flex-grow"><input className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold text-gray-900" value={value || ''} onChange={(e) => onChange(e.target.value)} /></div></div>
  );

  const StampAndSignature = () => {
      if (!user || (!user.stampImage && !user.signatureImage)) return null;
      return (
          <div className="absolute right-10 -top-10 pointer-events-none opacity-90 mix-blend-multiply">
              {user.signatureImage && <img src={user.signatureImage} alt="Sig" className="h-16 relative top-8 left-0" />}
              {user.stampImage && <img src={user.stampImage} alt="Stamp" className="h-24 w-24 relative -top-2 left-10 opacity-80" />}
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input */}
        <div className="flex flex-col gap-6 no-print xl:col-span-4 h-fit sticky top-24">
          
          <div>
            <h2 className="text-3xl font-medium text-gray-900 mb-1">{t.title}</h2>
            <p className="text-gray-400 text-sm">{t.subtitle}</p>
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
                   <div className="text-6xl font-light text-gray-800 font-mono tracking-tighter tabular-nums">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</div>
                   
                   {/* Record Button */}
                   {!audioBlob && !isRecording && (
                     <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <button onClick={startRecording} className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/20 hover:scale-105 transition-all active:scale-95 hover:bg-red-600 ring-4 ring-red-50"><Mic size={32} /></button>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.tapToRecord}</p>
                     </div>
                   )}

                   {/* Stop Button */}
                   {isRecording && <button onClick={stopRecording} className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all active:scale-95 ring-4 ring-gray-100"><Square size={28} fill="currentColor" /></button>}
                   
                   {/* Result */}
                   {audioBlob && !isRecording && (
                    <div className="flex flex-col items-center animate-fade-in w-full">
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50"><Check size={32} /></div>
                      <p className="text-sm font-semibold text-gray-900 mb-4">{t.audioCaptured}</p>
                      <button onClick={() => { setAudioBlob(null); setElapsedTime(0); }} className="text-xs text-gray-400 hover:text-gray-900 flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"><RefreshCw size={12} /> {t.reset}</button>
                    </div>
                   )}
              </div>
            ) : (
                <textarea className="w-full h-[300px] bg-gray-50/50 p-4 rounded-xl border border-transparent focus:border-blue-100 focus:bg-white focus:ring-0 resize-none text-gray-700 text-sm leading-relaxed placeholder:text-gray-300 transition-all outline-none" placeholder={t.pasteText} value={textInput} onChange={(e) => setTextInput(e.target.value)} />
            )}
          </div>

          <button disabled={!isReadyToGenerate(activeTab, audioBlob, textInput) || isProcessing} onClick={handleGenerate} className={`w-full py-4 rounded-xl font-medium text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10 ${!isReadyToGenerate(activeTab, audioBlob, textInput) ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99]'}`}>
            {isProcessing ? <><Loader2 className="animate-spin" size={18} /> {t.processing}</> : <>{t.generate} <Sparkles size={18} className="text-blue-200" /></>}
          </button>
          
          {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex gap-2"><AlertTriangle size={16} className="mt-0.5" />{error}</div>}
          {isConfigError && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2"><Settings className="text-amber-600" size={16} /><h3 className="font-semibold text-sm">{t.configErrorTitle}</h3></div>
              <p className="text-xs mb-3 leading-relaxed opacity-90">{t.configErrorDesc}</p>
              <div className="flex gap-2">
                 <input type="password" value={manualKeyInput} onChange={(e) => setManualKeyInput(e.target.value)} placeholder="AIzaSy..." className="flex-1 bg-white border border-amber-200 rounded px-2 py-1.5 text-xs outline-none"/>
                 <button onClick={() => {if(manualKeyInput.length>10){setManualApiKey(manualKeyInput); handleGenerate();}}} className="bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-amber-700">{t.saveKey}</button>
              </div>
            </div>
          )}

           {/* History Widget */}
           <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col max-h-[300px]">
              <div className="flex items-center gap-2 mb-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-50 pb-2">
                  <History size={12}/> {t.historyTitle}
              </div>
              <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {history.length === 0 && <p className="text-gray-300 text-xs italic text-center py-4">No archives yet.</p>}
                  {history.map((rec) => (
                      <div key={rec.id} onClick={() => loadFromHistory(rec)} className="p-3 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-blue-100">
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
           <div className="no-print flex flex-wrap gap-4 justify-between items-center bg-white p-3 rounded-2xl border border-gray-200 shadow-sm sticky top-24 z-20">
             <div className="flex items-center gap-2 pl-2">
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700">
                        <span>Form {selectedForm}/у</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                          {['075', '027', '003'].map(f => (
                              <div key={f} onClick={() => handleSelectForm(f as FormType)} className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex justify-between items-center border-b border-gray-50 last:border-0">
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
             
             {generatedData && (
                 <div className="flex items-center gap-2 pr-1">
                    <button onClick={handleDownloadDOCX} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold tracking-wide hover:bg-green-700 transition-all shadow-md shadow-green-500/20 active:scale-95">
                        <Download size={16} /> <span className="hidden sm:inline">{t.downloadWord}</span>
                    </button>
                    <button onClick={() => window.print()} className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                        <Printer size={18} />
                    </button>
                 </div>
             )}
          </div>

          {/* Clinical Snapshot Card */}
          {generatedData && generatedData.shortSummary && (
              <div className="no-print bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-4 animate-fade-in">
                  <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm"><Sparkles size={18}/></div>
                  <div>
                      <h3 className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest mb-1">{t.clinicalSnapshot}</h3>
                      <p className="text-indigo-800 text-sm leading-relaxed">{generatedData.shortSummary}</p>
                  </div>
              </div>
          )}

          {/* Document Preview Area */}
          <div className="bg-gray-200/50 rounded-3xl border border-gray-300/50 shadow-inner h-[800px] overflow-auto flex justify-center p-8 relative print:h-auto print:overflow-visible print:bg-white print:p-0 print:border-none print:shadow-none">
            <div className={`print-area bg-white shadow-2xl transition-transform origin-top duration-200 ${!generatedData ? 'flex items-center justify-center' : ''} print:shadow-none print:transform-none print:m-0`}
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
                              <div className="border-t-2 border-black my-6"></div>
                              <div className="mb-4 relative">
                                  <p className="mb-1 text-[10pt]">Врач Ф.И.О.:</p>
                                  <div className="border-b border-black w-full"><input className="w-full bg-transparent border-none focus:ring-0 p-0 text-center font-bold italic font-serif text-[12pt]" value={generatedData.doctorName} onChange={(e) => handleFieldChange('doctorName', e.target.value)} /></div>
                                  <StampAndSignature />
                              </div>
                              <div><p className="mb-1 text-[10pt]">Заключение:</p><div className="border-b border-black w-full"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 text-center font-bold text-blue-900 resize-none font-serif text-[12pt]" rows={2} value={generatedData.conclusion} onChange={(e) => handleFieldChange('conclusion', e.target.value)}></textarea></div></div>
                          </div>
                        </>
                      )}

                      {/* --- RENDER 027 --- */}
                      {selectedForm === '027' && (
                          <>
                            <div className="text-right text-[10pt] mb-4">Утверждена приказом и.о. Министра<br/>здравоохранения Республики Казахстан<br/>от 30 октября 2020 года № ҚР ДСМ-175/2020</div>
                            <div className="text-center font-bold mb-8 text-[14pt]">Форма № 027/у<br/>ВЫПИСКА ИЗ МЕДИЦИНСКОЙ КАРТЫ АМБУЛАТОРНОГО,<br/>СТАЦИОНАРНОГО БОЛЬНОГО</div>
                            <div className="space-y-4">
                                <InputLine label="1. Наименование МО:" value={generatedData.healthcareFacility} onChange={(v) => handleFieldChange('healthcareFacility', v)} />
                                <InputLine label="2. Дата выдачи:" value={generatedData.date} onChange={(v) => handleFieldChange('date', v)} />
                                <InputLine label="3. Ф.И.О. пациента:" value={generatedData.patientName} onChange={(v) => handleFieldChange('patientName', v)} />
                                <InputLine label="4. Дата рождения:" value={generatedData.dateOfBirth} onChange={(v) => handleFieldChange('dateOfBirth', v)} />
                                <InputLine label="5. Адрес проживания:" value={generatedData.address} onChange={(v) => handleFieldChange('address', v)} />
                                <InputLine label="6. Место работы/учебы:" value={generatedData.workPlace} onChange={(v) => handleFieldChange('workPlace', v)} />
                                <div><div className="mb-1">7. Полный диагноз:</div><div className="border-b border-black"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold" rows={3} value={generatedData.diagnosis} onChange={(e) => handleFieldChange('diagnosis', e.target.value)}></textarea></div></div>
                                <div><div className="mb-1">8. Проведенное лечение (заключение):</div><div className="border-b border-black"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold" rows={3} value={generatedData.conclusion} onChange={(e) => handleFieldChange('conclusion', e.target.value)}></textarea></div></div>
                                <div><div className="mb-1">9. Лечебно-трудовые рекомендации:</div><div className="border-b border-black"><textarea className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold" rows={3} value={generatedData.recommendations} onChange={(e) => handleFieldChange('recommendations', e.target.value)}></textarea></div></div>
                                <div className="mt-8 relative">
                                    <div className="mb-1">Врач:</div>
                                    <div className="border-b border-black"><input className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold" value={generatedData.doctorName} onChange={(e) => handleFieldChange('doctorName', e.target.value)} /></div>
                                    <StampAndSignature />
                                </div>
                            </div>
                          </>
                      )}

                      {/* --- RENDER 003 --- */}
                      {selectedForm === '003' && (
                        <>
                           <div className="flex justify-between items-start text-[10pt] mb-6">
                              <div className="text-left w-1/2">
                                  <div className="border-b border-black inline-block min-w-[200px] font-bold">{generatedData.healthcareFacility}</div><br/>
                                  наименование медицинской организации
                              </div>
                              <div className="text-right w-1/2">
                                  Утверждена приказом и.о. Министра<br/>здравоохранения Республики Казахстан<br/>от 30 октября 2020 года № ҚР ДСМ-175/2020<br/><br/>
                                  <b>Форма № 003/у</b>
                              </div>
                           </div>
                           <h2 className="text-center font-bold text-[16pt] mb-6 leading-tight">МЕДИЦИНСКАЯ КАРТА<br/>стационарного пациента</h2>
                           
                           <div className="space-y-2 text-[11pt]">
                              <InputLine label="1. Дата и время поступления" value={generatedData.admissionDate} onChange={(v) => handleFieldChange('admissionDate', v)} />
                              <InputLine label="2. Дата и время выписки" value={generatedData.dischargeDate} onChange={(v) => handleFieldChange('dischargeDate', v)} />
                              <div className="flex gap-4">
                                 <div className="flex-grow"><InputLine label="3. Отделение" value={generatedData.department} onChange={(v) => handleFieldChange('department', v)} /></div>
                                 <div className="w-32"><InputLine label="Палата №" value={generatedData.ward} onChange={(v) => handleFieldChange('ward', v)} /></div>
                              </div>
                              <InputLine label="4. Проведено койко-дней" value={generatedData.daysSpent} onChange={(v) => handleFieldChange('daysSpent', v)} />
                              <InputLine label="5. Вид транспортировки" value={generatedData.transportType} onChange={(v) => handleFieldChange('transportType', v)} />
                              <div className="flex gap-4"><div className="w-1/2"><InputLine label="6. Группа крови" value={generatedData.bloodType} onChange={(v) => handleFieldChange('bloodType', v)} /></div><div className="w-1/2"><InputLine label="Резус" value={generatedData.rhFactor} onChange={(v) => handleFieldChange('rhFactor', v)} /></div></div>
                              <InputLine label="7. Побочное действие лекарств" value={generatedData.sideEffects} onChange={(v) => handleFieldChange('sideEffects', v)} />
                              <div className="border-t border-black my-4"></div>
                              <InputLine label="8. Ф.И.О. пациента" value={generatedData.patientName} onChange={(v) => handleFieldChange('patientName', v)} />
                              <div className="flex items-center gap-4"><span>9. Пол:</span><span className={generatedData.gender === 'male' ? 'underline font-bold' : ''}>М</span><span className={generatedData.gender === 'female' ? 'underline font-bold' : ''}>Ж</span></div>
                              <InputLine label="10. Дата рождения (Возраст)" value={generatedData.age} onChange={(v) => handleFieldChange('age', v)} />
                              <InputLine label="11. Место жительства" value={generatedData.address} onChange={(v) => handleFieldChange('address', v)} />
                              <InputLine label="12. Место работы" value={generatedData.workPlace} onChange={(v) => handleFieldChange('workPlace', v)} />
                              <InputLine label="13. Кем направлен" value={generatedData.referredBy} onChange={(v) => handleFieldChange('referredBy', v)} />
                              <div className="flex items-center gap-4"><span>14. Доставлен по экстренным показаниям:</span><span className={generatedData.emergency ? 'underline font-bold' : ''}>Да</span><span className={!generatedData.emergency ? 'underline font-bold' : ''}>Нет</span></div>
                              <InputLine label="15. Диагноз направившего" value={generatedData.referralDiagnosis} onChange={(v) => handleFieldChange('referralDiagnosis', v)} />
                              <InputLine label="16. Диагноз клинический" value={generatedData.clinicalDiagnosis} onChange={(v) => handleFieldChange('clinicalDiagnosis', v)} />
                              <InputLine label="17. Дата установления" value={generatedData.diagnosisDate} onChange={(v) => handleFieldChange('diagnosisDate', v)} />
                           </div>
                           <div className="mt-8 relative">
                                <div className="mb-1">Врач:</div>
                                <div className="border-b border-black"><input className="w-full bg-transparent border-none focus:ring-0 p-0 font-serif text-[12pt] font-bold" value={generatedData.doctorName} onChange={(e) => handleFieldChange('doctorName', e.target.value)} /></div>
                                <StampAndSignature />
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

// Helper for 'ready' state to avoid complex expression in JSX
const isReadyToGenerate = (activeTab: 'audio'|'text', audioBlob: Blob|null, textInput: string) => {
    return (activeTab === 'audio' && audioBlob !== null) || (activeTab === 'text' && textInput.length > 10);
};

export default AppInterface;
