const { GoogleGenAI, Type } = require("@google/genai");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { topic, niche } = JSON.parse(event.body);
    
    if (!topic) {
      return { statusCode: 400, body: JSON.stringify({ error: "Topic is required" }) };
    }

    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });
    
    const prompt = `Act as an expert TikTok SEO and Social Media Manager.
    Topic: ${topic}
    Niche: ${niche || 'General'}
    
    Create a highly optimized TikTok video package including:
    1. Broad Hashtags.
    2. Niche Hashtags.
    3. SEO Keywords for search indexing.
    4. 3 Viral Hook Captions.
    
    Format the output as a valid JSON object matching the requested schema.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            broadHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            nicheHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            captions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["broadHashtags", "nicheHashtags", "seoKeywords", "captions"]
        }
      }
    });
    
    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to generate SEO data." })
    };
  }
};
