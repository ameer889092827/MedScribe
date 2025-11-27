import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, FileText, Loader2, RefreshCw, UploadCloud, AlignLeft, Printer, ZoomIn, ZoomOut, AlertTriangle, Settings } from 'lucide-react';
import { generateFormFromAudio, generateFormFromText } from '../services/geminiService';
import { Form075Data, Language, User } from '../types';

interface AppInterfaceProps {
  language: Language;
  user: User | null;
}

const AppInterface: React.FC<AppInterfaceProps> = ({ language, user }) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'text'>('audio');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState<Form075Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isConfigError, setIsConfigError] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Localization strings
  const t = {
    title: language === 'en' ? 'Patient Consultation' : 'Прием Пациента',
    subtitle: language === 'en' ? 'Record conversation, upload audio, or paste notes.' : 'Запишите разговор, загрузите аудио или вставьте заметки.',
    tapToRecord: language === 'en' ? 'Tap to Record' : 'Нажать для записи',
    audioCaptured: language === 'en' ? 'Audio Captured' : 'Аудио записано',
    upload: language === 'en' ? 'Or upload audio file' : 'Или загрузить файл',
    pasteText: language === 'en' ? 'Paste Consultation Notes' : 'Вставьте заметки приема',
    generate: language === 'en' ? 'Generate Form 075' : 'Создать Форму 075',
    processing: language === 'en' ? 'Processing...' : 'Обработка...',
    previewTitle: language === 'en' ? 'Document Preview' : 'Предпросмотр Документа',
    reset: language === 'en' ? 'Reset' : 'Сброс',
    configErrorTitle: language === 'en' ? 'Setup Required' : 'Требуется Настройка',
    configErrorDesc: language === 'en' 
      ? 'The VITE_API_KEY environment variable is missing. Vercel hides variables from the browser unless they start with VITE_.' 
      : 'Переменная VITE_API_KEY отсутствует. Vercel скрывает переменные от браузера, если они не начинаются с VITE_.',
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update generated data when it first arrives, or if user logs in
  useEffect(() => {
    if (generatedData && user) {
       // Only auto-fill if the fields are empty or generic
       const newData = { ...generatedData };
       let changed = false;
       
       if ((!newData.doctorName || newData.doctorName === '') && user.name) {
         newData.doctorName = user.name;
         if (user.licenseId) newData.doctorName += `, ID: ${user.licenseId}`;
         changed = true;
       }
       
       if ((!newData.healthcareFacility || newData.healthcareFacility === '') && user.organization) {
         newData.healthcareFacility = user.organization;
         changed = true;
       }

       if (changed) {
         setGeneratedData(newData);
       }
    }
  }, [user, generatedData]);

  const startRecording = async () => {
    try {
      setError(null);
      setIsConfigError(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

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

      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
       setError(null);
       setIsConfigError(false);
       setGeneratedData(null);
       setAudioBlob(file);
       setElapsedTime(0);
    }
  }

  const handleGenerate = async () => {
    setIsProcessing(true);
    setError(null);
    setIsConfigError(false);

    try {
      let data: Form075Data;
      if (activeTab === 'audio') {
        if (!audioBlob) return;
        data = await generateFormFromAudio(audioBlob);
      } else {
        if (!textInput.trim()) return;
        data = await generateFormFromText(textInput);
      }

      // Pre-fill user data immediately upon generation
      if (user) {
        if (!data.healthcareFacility && user.organization) {
          data.healthcareFacility = user.organization;
        }
        if (!data.doctorName && user.name) {
          data.doctorName = user.name;
          if (user.licenseId) data.doctorName += `, ID: ${user.licenseId}`;
        }
      }

      setGeneratedData(data);
    } catch (err: any) {
      console.error("Generation failed:", err);
      
      const errorMessage = err?.message || "";
      
      // Check for specific configuration errors
      if (errorMessage === "MISSING_API_KEY" || errorMessage.includes("API Key") || errorMessage.includes("API_KEY")) {
        setIsConfigError(true);
      } else {
        setError("Failed to generate form. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (field: keyof Form075Data, value: string) => {
    if (generatedData) {
      setGeneratedData({ ...generatedData, [field]: value });
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  /**
   * Generates a DOCX-compatible HTML string using Tables.
   * Tables are robust in Word for creating "Label ______Value______" layouts.
   */
  const handleDownloadDOCX = () => {
    if (!generatedData) return;

    // Helper to create a row with a label and an underlined value
    const row = (label: string, value: string) => `
      <tr style="height: 30px;">
        <td style="white-space: nowrap; padding-right: 10px; vertical-align: bottom;">${label}</td>
        <td style="border-bottom: 1px solid black; text-align: center; vertical-align: bottom; font-weight: bold; width: 100%;">${value}</td>
      </tr>
    `;

    // Helper for checkboxes
    const checkbox = (label: string, isChecked: boolean) => `
      <span style="margin-right: 20px;">
        <span style="font-family: 'Courier New', monospace; font-size: 14pt;">${isChecked ? '[X]' : '[ ]'}</span> ${label}
      </span>
    `;

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Form 075</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
          td { padding-bottom: 2px; }
        </style>
      </head>
      <body>
        <p align="right" style="font-size: 10pt; margin-bottom: 20px;">(по приказу МЗ РК от 30.10.2020 № ҚР ДСМ-175/2020)</p>
        
        <p align="center" style="font-weight: bold; margin-bottom: 5px; font-size: 14pt;">Форма № 075/у</p>
        <p align="center" style="font-weight: bold; margin-bottom: 30px;">"Медицинская справка (врачебное профессионально-консультативное заключение)"</p>

        <table>
          ${row("Наименование МО", generatedData.healthcareFacility)}
          ${row("ИИН", generatedData.iin)}
          ${row("Ф.И.О. (при его наличии)", generatedData.patientName)}
          ${row("Дата рождения", generatedData.dateOfBirth)}
        </table>

        <div style="margin: 15px 0;">
          <span style="margin-right: 20px;">Пол:</span>
          ${checkbox("мужской", generatedData.gender === 'male')}
          ${checkbox("женский", generatedData.gender === 'female')}
        </div>

        <table>
          ${row("Адрес проживания", generatedData.livingAddress)}
          ${row("Адрес регистрации", generatedData.registrationAddress)}
          ${row("Место работы/учебы/детского учреждения", generatedData.workPlace)}
          ${row("Должность", generatedData.position)}
          ${row("Дата последнего медицинского обследования", generatedData.lastCheckupDate)}
        </table>

        <p style="margin-top: 15px; margin-bottom: 5px;">Заболевания, выявленные с момента последнего медосмотра наименование:</p>
        <div style="border-bottom: 1px solid black; min-height: 40px; margin-bottom: 20px; font-weight: bold;">
          ${generatedData.pastIllnesses}
        </div>

        <hr style="border-top: 2px solid black; margin: 30px 0;" />

        <p style="font-size: 10pt; margin-bottom: 5px;">Врач Ф.И.О. (ПРИ ЕГО НАЛИЧИИ), идентификатор:</p>
        <div style="border-bottom: 1px solid black; text-align: center; font-weight: bold; font-style: italic; margin-bottom: 20px;">
          ${generatedData.doctorName}
        </div>

        <p style="font-size: 10pt; margin-bottom: 5px;">Заключение терапевта/ВОП:</p>
        <div style="border-bottom: 1px solid black; text-align: center; font-weight: bold; color: #1e3a8a;">
          ${generatedData.conclusion}
        </div>

      </body>
      </html>
    `;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(content);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Form_075_${generatedData.patientName || 'Patient'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isReadyToGenerate = (activeTab === 'audio' && audioBlob) || (activeTab === 'text' && textInput.length > 10);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Input (35% width on large screens) */}
        <div className="flex flex-col gap-6 no-print xl:col-span-4">
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-2">{t.title}</h2>
            <p className="text-gray-400 text-sm">{t.subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('audio')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'audio' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center gap-2">
                <Mic size={16} /> Audio
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('text')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center gap-2">
                <AlignLeft size={16} /> Text
              </div>
            </button>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-inner min-h-[400px] flex flex-col relative overflow-hidden">
            
            {activeTab === 'audio' ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className={`w-64 h-64 bg-blue-400 rounded-full blur-3xl transition-transform duration-1000 ${isRecording ? 'scale-150 animate-pulse' : 'scale-100'}`}></div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center flex-grow gap-6">
                  <div className="text-6xl font-light text-gray-800 font-mono tracking-tighter">
                    {formatTime(elapsedTime)}
                  </div>
                  
                  {!audioBlob && !isRecording && (
                     <div className="flex flex-col items-center gap-4">
                        <button 
                          onClick={startRecording}
                          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:scale-105 transition-all active:scale-95"
                        >
                          <Mic size={32} />
                        </button>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-2">{t.tapToRecord}</div>
                     </div>
                  )}

                  {isRecording && (
                    <button 
                      onClick={stopRecording}
                      className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all active:scale-95"
                    >
                      <Square size={28} fill="currentColor" />
                    </button>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="flex flex-col items-center animate-fade-in">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                         <CheckCircle2Icon size={32} />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{t.audioCaptured}</span>
                      <button 
                        onClick={() => { setAudioBlob(null); setElapsedTime(0); }}
                        className="mt-4 text-xs text-gray-400 hover:text-gray-900 flex items-center gap-1"
                      >
                        <RefreshCw size={12} /> {t.reset}
                      </button>
                    </div>
                  )}
                </div>

                 {!isRecording && !audioBlob && (
                    <div className="relative z-10 w-full flex justify-center mt-4">
                       <label className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                          <UploadCloud size={14} />
                          <span>{t.upload}</span>
                          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                       </label>
                    </div>
                 )}
              </>
            ) : (
              // Text Input Mode
              <div className="h-full flex flex-col">
                <textarea
                  className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-gray-700 text-lg leading-relaxed placeholder:text-gray-300"
                  placeholder={t.pasteText}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
            )}
          </div>

          <button 
            disabled={!isReadyToGenerate || isProcessing}
            onClick={handleGenerate}
            className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-all
              ${!isReadyToGenerate
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20'
              }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" /> {t.processing}
              </>
            ) : (
              <>
                {t.generate}
              </>
            )}
          </button>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 break-words flex gap-2 items-start">
               <AlertTriangle size={16} className="shrink-0 mt-0.5" />
               <span>{error}</span>
            </div>
          )}

          {isConfigError && (
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                 <Settings className="text-amber-600" size={20} />
                 <h3 className="font-semibold">{t.configErrorTitle}</h3>
              </div>
              <p className="text-sm mb-4 leading-relaxed opacity-90">{t.configErrorDesc}</p>
              <div className="text-xs font-mono bg-white/50 p-3 rounded border border-amber-200/50 mb-4">
                 Key: VITE_API_KEY<br/>
                 Value: AIzaSy...
              </div>
              <a href="https://vercel.com/docs/projects/environment-variables" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-amber-700 hover:text-amber-900 border-b border-amber-300 pb-0.5">
                 Read Vercel Documentation &rarr;
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Result (65% width) */}
        <div className="flex flex-col gap-6 xl:col-span-8">
           <div className="no-print flex justify-between items-end">
             <div>
                <h2 className="text-3xl font-light text-gray-900 mb-2">{t.previewTitle}</h2>
                <p className="text-gray-400 text-sm">Form 075/у</p>
             </div>
             {/* Zoom Controls */}
             <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-white rounded-md text-gray-500 transition-colors"><ZoomOut size={16}/></button>
                <span className="text-xs font-mono w-10 text-center text-gray-500">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))} className="p-2 hover:bg-white rounded-md text-gray-500 transition-colors"><ZoomIn size={16}/></button>
             </div>
          </div>

          {/* Form 075 Workspace Container */}
          <div className="bg-gray-200/50 rounded-3xl border border-gray-200 shadow-inner h-[800px] overflow-auto flex justify-center p-8 relative print:h-auto print:overflow-visible print:bg-white print:p-0 print:border-none">
             
             {/* Actual Paper Representation - Centered */}
             {/* Width fixed to 794px (A4 at 96dpi) */}
            <div 
                className={`print-area bg-white shadow-2xl transition-transform origin-top duration-200 ${!generatedData ? 'flex items-center justify-center' : ''} print:shadow-none print:transform-none`}
                style={{ 
                  width: '794px', 
                  minHeight: '1123px', 
                  padding: '60px',
                  transform: `scale(${zoomLevel})`,
                  marginBottom: `${(zoomLevel - 1) * 1123}px` // Adjust margin to prevent clipping when zoomed out
                }}
            >
                {!generatedData ? (
                   <div className="flex flex-col items-center text-gray-300 no-print">
                      <FileText size={64} strokeWidth={1} />
                      <p className="mt-4 font-light">Document area</p>
                   </div>
                ) : (
                  // Exact Form 075 Layout
                  <div style={{ fontFamily: '"Times New Roman", Times, serif' }} className="text-black text-[12pt] leading-snug w-full">
                      
                      {/* Header */}
                      <div className="text-right text-[10pt] mb-6">
                          <p>(по приказу МЗ РК от 30.10.2020 № ҚР ДСМ-175/2020)</p>
                      </div>

                      {/* Title */}
                      <div className="text-center font-bold mb-8">
                          <p className="mb-2">Форма № 075/у</p>
                          <p>"Медицинская справка (врачебное профессионально-консультативное заключение)"</p>
                      </div>

                      {/* Fields */}
                      <div className="space-y-4">
                          
                          <InputLine 
                            label="Наименование МО" 
                            value={generatedData.healthcareFacility} 
                            onChange={(val) => handleFieldChange('healthcareFacility', val)}
                          />

                          <InputLine 
                            label="ИИН" 
                            value={generatedData.iin} 
                            onChange={(val) => handleFieldChange('iin', val)}
                          />

                          <InputLine 
                            label="Ф.И.О. (при его наличии)" 
                            value={generatedData.patientName} 
                            onChange={(val) => handleFieldChange('patientName', val)}
                          />

                           <InputLine 
                            label="Дата рождения" 
                            value={generatedData.dateOfBirth} 
                            onChange={(val) => handleFieldChange('dateOfBirth', val)}
                          />

                          {/* Gender */}
                          <div className="flex items-center gap-8 py-1">
                              <span>Пол</span>
                              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleFieldChange('gender', 'male')}>
                                <div className={`w-4 h-4 border border-black flex items-center justify-center`}>
                                    {generatedData.gender === 'male' && <div className="w-2.5 h-2.5 bg-black"></div>}
                                </div>
                                <span>мужской</span>
                              </div>
                              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleFieldChange('gender', 'female')}>
                                <div className={`w-4 h-4 border border-black flex items-center justify-center`}>
                                    {generatedData.gender === 'female' && <div className="w-2.5 h-2.5 bg-black"></div>}
                                </div>
                                <span>женский</span>
                              </div>
                          </div>

                          <InputLine 
                            label="Адрес проживания" 
                            value={generatedData.livingAddress} 
                            onChange={(val) => handleFieldChange('livingAddress', val)}
                          />

                          <InputLine 
                            label="Адрес регистрации" 
                            value={generatedData.registrationAddress} 
                            onChange={(val) => handleFieldChange('registrationAddress', val)}
                          />

                          <InputLine 
                            label="Место работы/учебы/детского учреждения" 
                            value={generatedData.workPlace} 
                            onChange={(val) => handleFieldChange('workPlace', val)}
                          />

                          <InputLine 
                            label="Должность" 
                            value={generatedData.position} 
                            onChange={(val) => handleFieldChange('position', val)}
                          />

                           <InputLine 
                            label="Дата последнего медицинского обследования" 
                            value={generatedData.lastCheckupDate} 
                            onChange={(val) => handleFieldChange('lastCheckupDate', val)}
                          />

                          {/* Illnesses - Multi-line if needed */}
                          <div className="flex flex-col">
                             <span className="mb-1">Заболевания, выявленные с момента последнего медосмотра наименование</span>
                             <div className="border-b border-black w-full">
                                <textarea 
                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-left resize-none font-serif text-[12pt] font-bold"
                                    rows={2}
                                    value={generatedData.pastIllnesses}
                                    onChange={(e) => handleFieldChange('pastIllnesses', e.target.value)}
                                ></textarea>
                             </div>
                          </div>

                          {/* Separator Line */}
                          <div className="border-t-2 border-black my-6"></div>

                          {/* Doctor */}
                          <div className="mb-4">
                              <p className="mb-1 text-[10pt]">Врач Ф.И.О. (ПРИ ЕГО НАЛИЧИИ), идентификатор (ЭЦП, QR код, или уникальный признак, позволяющий отличать его)</p>
                              <div className="border-b border-black w-full">
                                  <input 
                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-center font-bold italic font-serif text-[12pt]"
                                    value={generatedData.doctorName}
                                    onChange={(e) => handleFieldChange('doctorName', e.target.value)}
                                  />
                              </div>
                          </div>

                          {/* Conclusion */}
                          <div>
                              <p className="mb-1 text-[10pt]">Заключение терапевта/ВОП Ф.И.О. (ПРИ ЕГО НАЛИЧИИ), идентификатор (ЭЦП, QR код, или уникальный признак, позволяющий отличать его)</p>
                              <div className="border-b border-black w-full">
                                   <textarea 
                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-center font-bold text-blue-900 resize-none font-serif text-[12pt]"
                                    rows={2}
                                    value={generatedData.conclusion}
                                    onChange={(e) => handleFieldChange('conclusion', e.target.value)}
                                   ></textarea>
                              </div>
                          </div>

                      </div>
                  </div>
                )}
            </div>
          </div>

          {generatedData && (
             <div className="flex gap-4 no-print">
                <button 
                    onClick={handleDownloadDOCX}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                   <Download size={18} /> DOCX (Word)
                </button>
                <button 
                    onClick={handleDownloadPDF}
                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                   <Printer size={18} /> Print / Save PDF
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for single line inputs
const InputLine: React.FC<{label: string, value: string, onChange: (val: string) => void}> = ({ label, value, onChange }) => (
    <div className="flex items-baseline">
        <span className="whitespace-nowrap mr-2">{label}</span>
        <div className="border-b border-black flex-grow">
            <input 
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-center font-serif text-[12pt] font-bold"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

// Helper icon
const CheckCircle2Icon: React.FC<{size?: number}> = ({size}) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export default AppInterface;