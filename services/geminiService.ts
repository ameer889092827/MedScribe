import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Form075Data, Form027Data, Form003Data, FormType, ConsultationRecord, AnalyticsInsight } from "../types";

// Initialize Gemini Client Lazy
let aiInstance: GoogleGenAI | null = null;
let manualApiKey: string = '';

export const setManualApiKey = (key: string) => {
  manualApiKey = key;
  aiInstance = null;
};

const getAI = () => {
  if (!aiInstance) {
    let apiKey = manualApiKey;

    if (!apiKey && typeof import.meta !== 'undefined' && (import.meta as any).env) {
      apiKey = (import.meta as any).env.VITE_API_KEY || '';
    }

    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.VITE_API_KEY || 
               process.env.REACT_APP_API_KEY || 
               process.env.NEXT_PUBLIC_API_KEY || 
               process.env.API_KEY || 
               '';
    }

    if (apiKey) {
      apiKey = apiKey.replace(/["']/g, "").trim();
    }

    if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
      console.error("API Key is missing.");
      throw new Error("MISSING_API_KEY");
    }
    
    aiInstance = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiInstance;
};

const modelId = "gemini-2.5-flash";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- SCHEMAS ---

const schema075: Schema = {
  type: Type.OBJECT,
  properties: {
    shortSummary: { type: Type.STRING, description: "One sentence clinical summary (e.g., 'Patient complains of cough, diagnosed with ARVI, treatment prescribed.')" },
    healthcareFacility: { type: Type.STRING },
    iin: { type: Type.STRING },
    patientName: { type: Type.STRING },
    dateOfBirth: { type: Type.STRING },
    gender: { type: Type.STRING, enum: ["male", "female"] },
    livingAddress: { type: Type.STRING },
    registrationAddress: { type: Type.STRING },
    workPlace: { type: Type.STRING },
    position: { type: Type.STRING },
    lastCheckupDate: { type: Type.STRING },
    pastIllnesses: { type: Type.STRING },
    doctorName: { type: Type.STRING },
    conclusion: { type: Type.STRING },
  },
  required: ["patientName", "gender", "shortSummary"],
};

const schema027: Schema = {
  type: Type.OBJECT,
  properties: {
    shortSummary: { type: Type.STRING },
    date: { type: Type.STRING },
    healthcareFacility: { type: Type.STRING },
    idNumber: { type: Type.STRING },
    patientName: { type: Type.STRING },
    dateOfBirth: { type: Type.STRING },
    address: { type: Type.STRING },
    workPlace: { type: Type.STRING },
    diagnosis: { type: Type.STRING },
    conclusion: { type: Type.STRING },
    recommendations: { type: Type.STRING },
    doctorName: { type: Type.STRING },
  },
  required: ["patientName", "conclusion", "shortSummary"],
};

const schema003: Schema = {
  type: Type.OBJECT,
  properties: {
    shortSummary: { type: Type.STRING },
    healthcareFacility: { type: Type.STRING },
    codeOkud: { type: Type.STRING },
    codeOkpo: { type: Type.STRING },
    admissionDate: { type: Type.STRING },
    dischargeDate: { type: Type.STRING },
    department: { type: Type.STRING },
    ward: { type: Type.STRING },
    daysSpent: { type: Type.STRING },
    transportType: { type: Type.STRING, enum: ["walking", "stretcher", "wheelchair"] },
    bloodType: { type: Type.STRING },
    rhFactor: { type: Type.STRING },
    sideEffects: { type: Type.STRING },
    patientName: { type: Type.STRING },
    gender: { type: Type.STRING, enum: ["male", "female"] },
    age: { type: Type.STRING },
    address: { type: Type.STRING },
    phone: { type: Type.STRING },
    workPlace: { type: Type.STRING },
    referredBy: { type: Type.STRING },
    emergency: { type: Type.BOOLEAN },
    referralDiagnosis: { type: Type.STRING },
    admissionDiagnosis: { type: Type.STRING },
    clinicalDiagnosis: { type: Type.STRING },
    diagnosisDate: { type: Type.STRING },
    doctorName: { type: Type.STRING },
  },
  required: ["patientName", "gender", "age", "shortSummary"],
};

const getPromptForForm = (formType: FormType): string => {
  const base = "You are an expert medical scribe assistant. Listen to the consultation OR the doctor's direct dictation. The input audio/text can be in English, Russian, or Kazakh. ";
  const rules = `
    CRITICAL RULES:
    1. Output Values MUST be in Russian (as it is the standard language for Form 075/027/003 documentation). Translate findings from English or Kazakh to Russian if necessary.
    2. If details are missing, return an EMPTY STRING (""). 
    3. DO NOT invent data.
    4. Infer gender/age if context permits.
    5. 'shortSummary' must be a concise 1-sentence overview (in Russian) of the patient's status.
    6. Output valid JSON matching the schema.`;

  if (formType === '075') return base + "Extract info for Kazakhstan Form 075/у (Medical Certificate)." + rules;
  if (formType === '027') return base + "Extract info for Kazakhstan Form 027/у (Extract from medical record)." + rules;
  if (formType === '003') return base + "Extract info for Kazakhstan Form 003/у (Inpatient Card)." + rules;
  return base + rules;
};

const getSchemaForForm = (formType: FormType): Schema => {
  if (formType === '027') return schema027;
  if (formType === '003') return schema003;
  return schema075;
};

// --- NEW FUNCTION: Detect Intent ---
export const identifyFormType = async (input: Blob | string): Promise<FormType | null> => {
  try {
    const ai = getAI();
    let parts: any[] = [];
    
    const promptText = `Analyze this input. The doctor might be speaking in English, Russian, or Kazakh.
      Did the doctor explicitly ask to CREATE, COMPOSE, or SWITCH TO a specific form type? 
      
      Look for patterns like:
      - English: "Form 075", "Form 027", "Form 003", "Compose 075"
      - Russian: "Форма 075", "Форма 027", "Форма 003", "Создать 075"
      - Kazakh: "075 нысаны", "027 нысаны", "003 нысаны", "075 форма"
      - Or just the numbers "075", "027", "003" in a command context.

      If yes, return the number (e.g. "075"). If not, return "null".`;

    if (typeof input === 'string') {
      parts = [{ text: `${promptText}\nText: "${input}"` }];
    } else {
       const base64Audio = await blobToBase64(input);
       parts = [
         { inlineData: { mimeType: input.type || "audio/webm", data: base64Audio } },
         { text: promptText }
       ];
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             detectedForm: { type: Type.STRING, enum: ["075", "027", "003", "null"] }
           }
        }
      }
    });

    if (response.text) {
      const json = JSON.parse(response.text);
      if (json.detectedForm && json.detectedForm !== "null") {
        return json.detectedForm as FormType;
      }
    }
    return null;
  } catch (e) {
    console.warn("Intent detection failed", e);
    return null;
  }
};

// --- NEW FUNCTION: Generate Doctor Insights ---
export const generateDoctorInsights = async (history: ConsultationRecord[]): Promise<AnalyticsInsight> => {
  try {
     const ai = getAI();
     const summaries = history.slice(0, 30).map(h => `- ${new Date(h.timestamp).toLocaleDateString()}: [Form ${h.formType}] ${h.summary}`).join("\n");
     const prompt = `
       You are an advanced medical analytics AI. Analyze the doctor's recent consultation history.
       
       HISTORY DATA:
       ${summaries}

       TASK:
       Generate a "Spotify Wrapped" style report for the doctor.
       The input data might be in English, Russian, or Kazakh.
       The output "narrative" and "title" should be in the language that best fits the input context (or English/Russian as a default professional choice).
       
       OUTPUT JSON:
       1. title: A catchy title like "Respiratory Month" or "Месяц Кардиологии".
       2. narrative: A 2-3 sentence summary of what they treated most.
       3. topCondition: The most common medical issue found.
       4. patientCountStr: A string like "42 Patients" / "42 Пациента".
       5. efficiencyGain: Estimate time saved. E.g. "12 Hours Saved".
     `;

     const response = await ai.models.generateContent({
       model: modelId,
       contents: { parts: [{ text: prompt }] },
       config: {
         responseMimeType: "application/json",
         responseSchema: {
           type: Type.OBJECT,
           properties: {
             title: {type: Type.STRING},
             narrative: {type: Type.STRING},
             topCondition: {type: Type.STRING},
             patientCountStr: {type: Type.STRING},
             efficiencyGain: {type: Type.STRING},
           }
         }
       }
     });

     return JSON.parse(response.text!) as AnalyticsInsight;

  } catch (e) {
    console.error("Analytics failed", e);
    // Fallback
    return {
      title: "Your Medical Month",
      narrative: "You have been active! Keep generating forms to see detailed insights.",
      topCondition: "General Practice",
      patientCountStr: `${history.length} Patients`,
      efficiencyGain: `${Math.round(history.length * 0.25)} Hours Saved`
    };
  }
};

export const generateFormFromAudio = async (audioBlob: Blob, formType: FormType = '075'): Promise<any> => {
  try {
    const ai = getAI();
    const base64Audio = await blobToBase64(audioBlob);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || "audio/webm",
              data: base64Audio,
            },
          },
          { text: getPromptForForm(formType) }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: getSchemaForForm(formType),
        temperature: 0.1,
      },
    });

    if (!response.text) throw new Error("No response generated");
    return JSON.parse(response.text);

  } catch (error) {
    console.error("Gemini Service Error (Audio):", error);
    throw error;
  }
};

export const generateFormFromText = async (text: string, formType: FormType = '075'): Promise<any> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { text: getPromptForForm(formType) + `\n\nNotes/Dictation: "${text}"` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: getSchemaForForm(formType),
        temperature: 0.1,
      },
    });

    if (!response.text) throw new Error("No response generated");
    return JSON.parse(response.text);

  } catch (error) {
    console.error("Gemini Service Error (Text):", error);
    throw error;
  }
};