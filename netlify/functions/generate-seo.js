exports.handler = async (event, context) => {
    // CORS Headers for secure cross-origin requests
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // Handle Preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { topic, niche } = JSON.parse(event.body || "{}");

        if (!topic) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Topic is required" }) };
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: "Missing API Key" }) };
        }

        const prompt = `Act as a TikTok algorithm expert. Return a clean JSON object for topic: "${topic}" and niche: "${niche || 'General'}".
The JSON MUST strictly follow this structure, with no markdown, no backticks, and no extra text:
{
  "broadHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "nicheHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "seoKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "captions": ["Catchy viral hook 1", "Catchy viral hook 2", "Catchy viral hook 3"]
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
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
        const aiResultText = data.candidates[0].content.parts[0].text;
        
        // Ensure it's valid JSON even if the model messes up slightly
        const resultJson = JSON.parse(aiResultText);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(resultJson)
        };
    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
