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

    const platform = payload.platform || 'TikTok';
    const topic = payload.topic || 'Viral Social Media Trends';
    const niche = payload.niche || 'General Entertainment';
    const audience = payload.audience || 'Target Audience';

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    const cleanTopic = topic.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const cleanNiche = niche.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Platform-specific defaults and rules
    const getPlatformFallbacks = () => {
        switch (platform) {
            case 'Instagram':
                return {
                    broadHashtags: ["#reels", "#explorepage", "#viralreels", "#instadaily", "#trendingnow", "#reelsinstagram", "#igreels"],
                    nicheHashtags: [`#${cleanTopic || 'trending'}`, `#${cleanNiche || 'creator'}`, `#${cleanTopic}reels`, `#${cleanNiche}tips`, `#creatorsofinstagram`, `#reelsoftheday`, `#viralcontent`],
                    hooks: [
                        `Save this reel before the Instagram algorithm changes! 📲`,
                        `The easiest way to level up your ${topic} this week...`,
                        `Stop scrolling if you want to grow your ${niche} page!`
                    ],
                    caption: `Here is everything you need to know about ${topic} in the ${niche} space! ✨\n\n📌 Save this reel so you don't lose it.\n💬 Drop your questions below & let's discuss!\n👉 Follow for daily ${niche} growth tips & strategies.`
                };
            case 'YouTube Shorts':
                return {
                    broadHashtags: ["#shorts", "#youtubeshorts", "#viralshorts", "#trending", "#shortsvideo", "#youtube", "#subscribe"],
                    nicheHashtags: [`#${cleanTopic || 'shorts'}`, `#${cleanNiche || 'tips'}`, `#${cleanTopic}shorts`, `#${cleanNiche}channel`, `#algorithm`, `#contentcreator`, `#creatoreconomy`],
                    hooks: [
                        `Watch this before you make your next YouTube video on ${topic}!`,
                        `The viral YouTube Shorts formula for ${topic} revealed:`,
                        `Why 99% of creators fail at ${topic} (and how to fix it)!`
                    ],
                    caption: `Learn the essential secrets of ${topic} for ${audience} in the ${niche} niche! 🚀\n\n🔔 Don't forget to LIKE and SUBSCRIBE for more daily shorts!\nShare your thoughts in the comments below!`
                };
            case 'Facebook':
                return {
                    broadHashtags: ["#facebookreels", "#viral", "#trending", "#reelsvideo", "#facebookviral", "#reelsfb", "#fbreels"],
                    nicheHashtags: [`#${cleanTopic || 'viral'}`, `#${cleanNiche || 'video'}`, `#${cleanTopic}tips`, `#facebookcommunity`, `#creator`, `#viralstory`, `#trendingtopics`],
                    hooks: [
                        `Has anyone else noticed this happening with ${topic}?`,
                        `3 things everyone should know about ${topic} today!`,
                        `You won't believe how simple it is to master ${topic}!`
                    ],
                    caption: `Everyone in the ${niche} community has been asking about ${topic}! Here's the complete breakdown you need to know. What are your thoughts on this? Let us know in the comments and share with a friend who needs to see this! 👇`
                };
            case 'LinkedIn':
                return {
                    broadHashtags: ["#leadership", "#innovation", "#networking", "#marketing", "#professionaldevelopment", "#business", "#strategy"],
                    nicheHashtags: [`#${cleanTopic || 'industry'}`, `#${cleanNiche || 'growth'}`, `#${cleanTopic}trends`, `#futureofwork`, `#productivity`, `#careeradvice`, `#digitalstrategy`],
                    hooks: [
                        `The biggest misconception most professionals have about ${topic}:`,
                        `How prioritizing ${topic} transformed our approach to ${niche}:`,
                        `3 key lessons I learned analyzing ${topic} for ${audience}:`
                    ],
                    caption: `In today's fast-evolving ${niche} landscape, understanding ${topic} is no longer optional for ${audience}.\n\nKey takeaway: Focus on structured consistency, data-driven optimization, and genuine value.\n\nWhat has been your experience navigating this in your industry? Let's connect and discuss in the comments below.`
                };
            case 'Twitter/X':
                return {
                    broadHashtags: ["#viral", "#trending", "#threads", "#techtwitter", "#buildinpublic", "#creator", "#x"],
                    nicheHashtags: [`#${cleanTopic || 'trends'}`, `#${cleanNiche || 'news'}`, `#${cleanTopic}tips`, `#xthreads`, `#growth`, `#insights`, `#dailyupdate`],
                    hooks: [
                        `A masterclass on ${topic} that took me 3 years to learn (in 30 seconds): 🧵`,
                        `The single most overlooked strategy in ${niche}: ${topic}.`,
                        `If you care about ${topic}, stop doing this immediately:`
                    ],
                    caption: `Everything you need to know about ${topic} in 2026.\n\nBookmark this post 🔖\nRepost if you found this valuable 🔁\nFollow for more daily ${niche} breakdowns.`
                };
            case 'TikTok':
            default:
                return {
                    broadHashtags: ["#fyp", "#viral", "#trending", "#foryou", "#foryoupage", "#tiktokviral", "#explore"],
                    nicheHashtags: [`#${cleanTopic || 'viral'}`, `#${cleanNiche || 'creator'}`, `#${cleanTopic}tips`, `#trending${cleanNiche}`, `#${cleanTopic}hacks`, `#creatorgrowth`, `#contentstrategy`],
                    hooks: [
                        `You won't believe what happened when we tried ${topic}!`,
                        `Stop scrolling if you want to know the truth about ${topic}...`,
                        `3 secrets about ${topic} that no one is telling you!`
                    ],
                    caption: `Here is everything you need to know about ${topic}! Make sure to save this video and follow for daily viral ${niche} updates. What do you think? Drop a comment below! 🔥 (Powered by Viralora Core Engine)`
                };
        }
    };

    // If no API key is present in Netlify environment variables yet, provide curated viral fallback
    if (!apiKey) {
        return {
            statusCode: 200,
            headers: defaultHeaders,
            body: JSON.stringify(getPlatformFallbacks())
        };
    }

    try {
        const prompt = `Act as an expert social media growth hacker and SEO algorithm strategist for ${platform}. 
Platform: "${platform}".
Video/Content topic: "${topic}". 
Niche: "${niche}". 
Target Audience: "${audience}".

Analyze the modern 2026 ${platform} recommendation algorithm and return a pure JSON object with these exact keys:
"broadHashtags": [array of 7 strings representing high-volume, high-reach hashtags calibrated for ${platform}],
"nicheHashtags": [array of 7 strings representing high-intent specific hashtags for the ${niche} niche on ${platform}],
"hooks": [array of 3 strings representing psychological, high-CTR hook titles/text overlays specifically optimized for ${platform}],
"caption": "A single string containing a high-converting, platform-specific caption formatted perfectly for ${platform} (e.g. spacing, emojis, call-to-action suitable for ${platform})."

Return ONLY valid JSON without markdown wrapping.`;

        // Model fallback chain: gemini-3.6-flash -> gemini-3.8-flash -> gemini-flash-latest
        const models = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
        let successData = null;
        let lastError = null;

        for (const model of models) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { 
                            response_mime_type: "application/json",
                            thinking_config: { thinking_level: "LOW" }
                        }
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
        return { 
            statusCode: 200, 
            headers: defaultHeaders,
            body: JSON.stringify(getPlatformFallbacks())
        };
    }
};
