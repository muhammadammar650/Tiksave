exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { topic, audience, tone } = JSON.parse(event.body);

        if (!topic) {
            return { statusCode: 400, body: JSON.stringify({ error: "Topic is required" }) };
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: "Missing API Key" }) };
        }

        const prompt = `Act as an expert TikTok growth strategist. Generate viral SEO content for a video about "${topic}".
Target audience: ${audience || 'General'}
Tone: ${tone || 'Viral'}

Return a JSON object EXACTLY in this format, with no markdown formatting or other text:
{
  "broad": ["#fyp", "#viral", "#trending", ...],
  "niche": ["#specific", ...],
  "keywords": ["keyword 1", "keyword 2", ...],
  "hooks": ["Catchy hook 1", "Catchy hook 2", "Catchy hook 3"]
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                }
            })
        });

        if (!response.ok) {
            console.error("Gemini API Error", response.status, await response.text());
            throw new Error("Failed to fetch from Gemini API");
        }

        const data = await response.json();
        let aiResultText = data.candidates[0].content.parts[0].text;
        
        // Ensure it's valid JSON even if the model messes up slightly
        const resultJson = JSON.parse(aiResultText);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resultJson)
        };
    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
