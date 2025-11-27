import { GoogleGenAI, Type } from "@google/genai";
import { Form075Data } from "../types";

// Initialize Gemini Client Lazy
let aiInstance: GoogleGenAI | null = null;
let manualApiKey: string = '';

export const setManualApiKey = (key: string) => {
  manualApiKey = key;
  aiInstance = null; // Reset instance to force recreation with new key
};

const getAI = () => {
  if (!aiInstance) {
    let apiKey = manualApiKey;

    // 1. Try Vite standard way (import.meta.env)
    if (!apiKey && typeof import.meta !== 'undefined' && (import.meta as any).env) {
      apiKey = (import.meta as any).env.VITE_API_KEY || '';
    }

    // 2. Fallback to process.env (Legacy/CRA/Next.js compat)
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.VITE_API_KEY || 
               process.env.REACT_APP_API_KEY || 
               process.env.NEXT_PUBLIC_API_KEY || 
               process.env.API_KEY || 
               '';
    }

    // Sanitize: Remove any accidental quotes users might paste in Vercel
    if (apiKey) {
      apiKey = apiKey.replace(/["']/g, "").trim();
    }

    // Debugging Log (Safe, doesn't show full key)
    console.log("MedScribe AI Init:", { 
      keyExists: !!apiKey, 
      keyLength: apiKey?.length,
      prefix: apiKey?.substring(0, 4) 
    });

    if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
      console.error("API Key is missing. Environment check failed.");
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

const formSchema = {
  type: Type.OBJECT,
  properties: {
    healthcareFacility: { type: Type.STRING, description: "Название медицинской организации" },
    iin: { type: Type.STRING, description: "ИИН пациента" },
    patientName: { type: Type.STRING, description: "ФИО пациента (In Russian)" },
    dateOfBirth: { type: Type.STRING, description: "Дата рождения (DD.MM.YYYY)" },
    gender: { type: Type.STRING, enum: ["male", "female"], description: "Пол (male/female)" },
    livingAddress: { type: Type.STRING, description: "Адрес проживания (In Russian)" },
    registrationAddress: { type: Type.STRING, description: "Адрес регистрации" },
    workPlace: { type: Type.STRING, description: "Место работы или учебы" },
    position: { type: Type.STRING, description: "Должность" },
    lastCheckupDate: { type: Type.STRING, description: "Дата последнего медосмотра" },
    pastIllnesses: { type: Type.STRING, description: "Заболевания, выявленные с момента последнего медосмотра" },
    doctorName: { type: Type.STRING, description: "ФИО Врача" },
    conclusion: { type: Type.STRING, description: "Заключение терапевта (Здоров / Годен к работе/учебе)" },
  },
  required: ["patientName", "gender"],
};

export const generateFormFromAudio = async (audioBlob: Blob): Promise<Form075Data> => {
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
          {
            text: `You are an expert medical scribe assistant. 
            Listen to this doctor-patient consultation. 
            Extract the relevant information to fill out Kazakhstan Medical Form 075/у.
            
            CRITICAL RULES:
            1. Values MUST be in Russian.
            2. If specific details (like IIN, address, workplace) are NOT mentioned in the audio, return an EMPTY STRING (""). 
            3. DO NOT invent, hallucinate, or generate placeholder data. Only use what is explicitly said.
            4. For gender, infer from voice or context.
            5. Output strictly valid JSON matching the schema.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: formSchema,
        temperature: 0.1, // Lower temperature for more deterministic/factual output
      },
    });

    if (!response.text) throw new Error("No response generated from AI model");
    return JSON.parse(response.text) as Form075Data;

  } catch (error) {
    console.error("Gemini Service Error (Audio):", error);
    throw error;
  }
};

export const generateFormFromText = async (text: string): Promise<Form075Data> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `Analyze the following medical consultation notes and extract information to fill out Kazakhstan Medical Form 075/у.
            
            Notes: "${text}"
            
            CRITICAL RULES:
            1. Values MUST be in Russian.
            2. If specific details are missing in the text, return an EMPTY STRING (""). 
            3. DO NOT invent or placeholder data.
            4. Output strictly valid JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: formSchema,
        temperature: 0.1,
      },
    });

    if (!response.text) throw new Error("No response generated from AI model");
    return JSON.parse(response.text) as Form075Data;

  } catch (error) {
    console.error("Gemini Service Error (Text):", error);
    throw error;
  }
};