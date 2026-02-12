
import { FormType, ConsultationRecord, AnalyticsInsight } from "../types";

// BACKEND CONFIGURATION
// On Vercel, functions in 'api/' are mapped to '/api/*'.
// So 'api/chat.js' becomes available at '/api/chat'.
const BACKEND_URL = "/api"; 

/**
 * Call Backend API
 */
// DIRECT OPENROUTER CALL (FOR TESTING ONLY)

const OPENROUTER_API_KEY = "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";

async function queryBackend(messages: any[]) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost", // required by OpenRouter
                "X-Title": "Medical AI Test"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b:free",
                messages: messages,
                reasoning: { enabled: true }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenRouter Error: ${response.status} - ${err}`);
        }

        const data = await response.json();

        return data.choices?.[0]?.message?.content || "";
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
}


/**
 * Generate Form Data
 */
export const generateForm = async (text: string, formType: FormType): Promise<any> => {
    const systemPrompt = `You are an expert medical scribe assistant.
    YOUR TASK: Extract consultation data into valid JSON for Kazakhstan Form ${formType}.
    LANGUAGE: Output values in RUSSIAN.
    FORMAT: Return ONLY raw JSON. No markdown formatting (no \`\`\`), no introductory text.

    REQUIRED FIELDS:
    - shortSummary (1 sentence summary)
    - healthcareFacility
    - patientName
    - dateOfBirth
    - gender (male/female)
    - doctorName
    - conclusion
    ${formType === '075' ? '- pastIllnesses, lastCheckupDate, workPlace' : ''}
    ${formType === '027' ? '- diagnosis, recommendations, idNumber' : ''}
    ${formType === '003' ? '- department, ward, admissionDate, clinicalDiagnosis' : ''}
    
    If information is missing, use empty strings "".
    `;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transcript: "${text}"` }
    ];

    try {
        const content = await queryBackend(messages);
        
        // Clean up response if it contains markdown code blocks
        let cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanContent = jsonMatch[0];
        }

        return JSON.parse(cleanContent);
    } catch (error) {
        console.error("Form Generation Failed:", error);
        throw new Error("Failed to generate form data. Please try again.");
    }
};

/**
 * Detect Form Type from Text
 */
export const identifyFormType = async (text: string): Promise<FormType | null> => {
    const systemPrompt = `Analyze the text. Did the user ask to create/switch to a form?
    Return ONLY JSON: {"detectedForm": "075" | "027" | "003" | "null"}`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
    ];

    try {
        const content = await queryBackend(messages);
        let cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        const json = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
        return (json.detectedForm && json.detectedForm !== "null") ? json.detectedForm : null;
    } catch (e) {
        return null;
    }
};

/**
 * Generate Doctor Analytics/Insights
 */
export const generateDoctorInsights = async (history: ConsultationRecord[]): Promise<AnalyticsInsight> => {
    if (!history || history.length === 0) {
        return {
            title: "No Data Available",
            narrative: "Start your first consultation to see AI-powered insights here.",
            topCondition: "-",
            patientCountStr: "0",
            efficiencyGain: "0%"
        };
    }

    const contextData = history.slice(0, 50).map(h => ({
        summary: h.summary,
        formType: h.formType,
        date: new Date(h.timestamp).toISOString().split('T')[0]
    }));

    const systemPrompt = `Analyze this medical consultation history and generate a practice summary.
    Data: ${JSON.stringify(contextData)}
    
    Return ONLY a JSON object with:
    - title: A short, professional title for the summary (e.g., "Monthly Overview").
    - narrative: A 2-3 sentence analysis of the practice trends and patient mix.
    - topCondition: The most common type of case or condition inferred from the summaries.
    - patientCountStr: Total patients count as a string.
    - efficiencyGain: Estimated time saved (assume 15m saved per patient) as a percentage string.
    
    No markdown blocks.`;

    const messages = [
        { role: "system", content: systemPrompt }
    ];

    try {
        const content = await queryBackend(messages);
        let cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleanContent = jsonMatch[0];

        return JSON.parse(cleanContent);
    } catch (error) {
        console.error("Insight Generation Failed:", error);
        return {
            title: "Analysis Unavailable",
            narrative: "Unable to generate insights at this time.",
            topCondition: "N/A",
            patientCountStr: String(history.length),
            efficiencyGain: "0%"
        };
    }
};
