exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        const { topic, niche } = JSON.parse(event.body || "{}");

        if (!topic) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Topic is required" })
            };
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY environment variable.");
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Server Configuration Error: Missing API Key" })
            };
        }

        const prompt = `Act as an expert TikTok growth strategist. Generate highly optimized, viral SEO content for a video about "${topic}".
Target Niche: ${niche || 'General'}

You MUST return the output as a valid JSON object ONLY. Do not include any markdown formatting, backticks, or extra text. Use this exact schema:
{
  "broadHashtags": ["#fyp", "#viral", "#trending", ... (8 total)],
  "nicheHashtags": ["#specific", ... (8 total)],
  "seoKeywords": ["search term 1", "search term 2", ... (5 total)],
  "captions": ["Viral Hook 1", "Viral Hook 2", "Viral Hook 3"]
}`;

        // Using Gemini 1.5 Flash API as requested
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
            const errText = await response.text();
            console.error("Gemini API Error:", response.status, errText);
            throw new Error("Failed to communicate with the AI service.");
        }

        const data = await response.json();
        const aiResultText = data.candidates[0].content.parts[0].text;
        
        // Ensure it parses correctly
        const resultJson = JSON.parse(aiResultText);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resultJson)
        };
    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal Server Error during SEO generation." })
        };
    }
};
