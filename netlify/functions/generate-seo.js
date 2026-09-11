exports.handler = async function(event, context) {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: 'Method Not Allowed' 
        };
    }

    // Support all standard Netlify environment variable naming variants
    const apiKey = process.env.GEMINI_API_KEY 
        || process.env.GOOGLE_API_KEY 
        || process.env.VITE_GEMINI_API_KEY 
        || process.env.API_KEY 
        || process.env.GOOGLE_GENAI_API_KEY;

    let payload = {};
    try {
        payload = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
        payload = {};
    }

    const topic = payload.topic || 'Viral TikTok Trends';
    const niche = payload.niche || 'General Entertainment';
    const audience = payload.audience || 'Target Audience';

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    // If no API key is present in Netlify environment variables yet, provide curated viral fallback
    if (!apiKey) {
        const cleanTopic = topic.replace(/[^a-zA-Z0-9]/g, '');
        const cleanNiche = niche.replace(/[^a-zA-Z0-9]/g, '');
        return {
            statusCode: 200,
            headers: defaultHeaders,
            body: JSON.stringify({
                broadHashtags: ["#fyp", "#viral", "#trending", "#foryou", "#foryoupage", "#tiktokviral", "#explore"],
                nicheHashtags: [`#${cleanTopic || 'viral'}`, `#${cleanNiche || 'creator'}`, `#${cleanTopic}tips`, `#trending${cleanNiche}`, `#${cleanTopic}hacks`, `#creatorgrowth`, `#contentstrategy`],
                hooks: [
                    `You won't believe what happened when we tried ${topic}!`,
                    `Stop scrolling if you want to know the truth about ${topic}...`,
                    `3 secrets about ${topic} that no one is telling you!`
                ],
                caption: `Here is everything you need to know about ${topic}! Make sure to save this video and follow for daily viral ${niche} updates. What do you think? Drop a comment below! 🔥 (Note: Set GEMINI_API_KEY in Netlify settings for dynamic AI model synthesis.)`
            })
        };
    }

    try {
        const prompt = `Act as an expert TikTok growth hacker and SEO strategist. 
Video topic: "${topic}". 
Niche: "${niche}". 
Target Audience: "${audience}".

Analyze the TikTok recommendation algorithm and return a pure JSON object with these exact keys:
"broadHashtags": [array of 7 strings representing high-volume hashtags like #fyp, #viral],
"nicheHashtags": [array of 7 strings representing high-intent specific hashtags for this niche],
"hooks": [array of 3 strings representing highly engaging, high-CTR hook titles/text overlays],
"caption": "A single string containing a 3-4 sentence highly engaging, SEO-optimized TikTok caption/description including a Call-To-Action."

Return ONLY valid JSON without markdown wrapping.`;

        // Model fallback chain: gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash
        const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        let successData = null;
        let lastError = null;

        for (const model of models) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { response_mime_type: "application/json" }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
                    jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
                    successData = JSON.parse(jsonText);
                    break;
                } else {
                    const errText = await response.text();
                    lastError = `${model} returned ${response.status}: ${errText}`;
                }
            } catch (err) {
                lastError = err.message;
            }
        }

        if (successData && successData.broadHashtags) {
            return {
                statusCode: 200,
                headers: defaultHeaders,
                body: JSON.stringify(successData)
            };
        }

        throw new Error(lastError || "Could not generate content with available Gemini models");
    } catch (error) {
        console.error("Function Error:", error);
        // Resilient fallback with user guidance
        const cleanTopic = topic.replace(/[^a-zA-Z0-9]/g, '');
        const cleanNiche = niche.replace(/[^a-zA-Z0-9]/g, '');
        return { 
            statusCode: 200, 
            headers: defaultHeaders,
            body: JSON.stringify({
                broadHashtags: ["#fyp", "#viral", "#trending", "#foryou", "#tiktok", "#explore", "#viralvideo"],
                nicheHashtags: [`#${cleanTopic || 'tiktok'}`, `#${cleanNiche || 'tips'}`, `#${cleanTopic}viral`, `#${cleanNiche}growth`, `#algorithm`, `#contentcreator`, `#videooftheday`],
                hooks: [
                    `Wait until you see how this affects your ${topic}!`,
                    `The #1 mistake people make with ${topic}...`,
                    `Try this simple ${topic} strategy today!`
                ],
                caption: `Discover the top secrets about ${topic} in the ${niche} space! Hit bookmark to save for later and drop your thoughts in the comments! 🚀`
            })
        };
    }
};
