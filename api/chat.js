
export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle Options (Preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const MODEL = "openai/gpt-oss-120b:free";
  const BASE_URL = "https://openrouter.ai/api/v1";

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "Server Configuration Error: API Key missing" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input. 'messages' array is required." });
    }

    // 4. Call OpenRouter API
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medscribe.ai",
        "X-Title": "MedScribe"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        include_reasoning: true, 
        reasoning: { enabled: true },
        temperature: 0.2,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API Error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ error: `Provider Error: ${errorText}` });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "";

    // 5. Return success
    res.status(200).json({ content: assistantMessage });

  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
