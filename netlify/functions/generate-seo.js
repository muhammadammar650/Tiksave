exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Missing GEMINI_API_KEY environment variable." }) 
        };
    }

    try {
        const { topic, niche, audience } = JSON.parse(event.body);
        
        const prompt = `Act as an expert TikTok growth hacker and SEO strategist. 
        Video topic: "${topic}". 
        Niche: "${niche}". 
        Target Audience: "${audience}".
        
        Analyze the algorithm and return a pure JSON object with these exact keys:
        "broadHashtags": [array of 7 strings representing high-volume hashtags],
        "nicheHashtags": [array of 7 strings representing high-intent specific hashtags],
        "hooks": [array of 3 strings representing highly engaging, high-CTR hook titles/text overlays],
        "caption": "A single string containing a 3-4 sentence highly engaging, SEO-optimized TikTok caption/description including a Call-To-Action."
        
        Return ONLY valid JSON without markdown wrapping.`;

        // We use the standard fetch API available in Node 18+ (Netlify's default)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`TikSave Core Engine Service Unavailable (${response.status})`);
        }

        const data = await response.json();
        
        // Extract the JSON text response from the model and strip code fences if any
        let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: jsonText
        };
    } catch (error) {
        console.error("Function Error:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message || "Failed to generate AI SEO content." }) 
        };
    }
};
