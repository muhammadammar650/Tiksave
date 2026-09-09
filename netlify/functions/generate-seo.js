const { GoogleGenAI } = require('@google/genai');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { topic, niche } = JSON.parse(event.body);
        
        if (!process.env.GEMINI_API_KEY) {
            return { 
                statusCode: 500, 
                body: JSON.stringify({ error: 'Missing Gemini API Key in environment variables.' }) 
            };
        }

        // Initialize Gemini SDK
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `Act as an expert TikTok SEO and growth strategist.
Topic: ${topic}
Niche: ${niche || 'General'}

Generate a viral SEO package for this TikTok video. Return ONLY a valid JSON object with this exact structure:
{
  "broadHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "nicheHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "searchKeywords": ["keyword phrase 1", "keyword phrase 2", "keyword phrase 3", "keyword phrase 4", "keyword phrase 5"],
  "hookCaptions": ["Hook 1", "Hook 2", "Hook 3"]
}

Do not include markdown blocks, just the pure JSON string.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const data = JSON.parse(response.text);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("AI Generation Error:", error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to generate SEO data.', details: error.message })
        };
    }
};
