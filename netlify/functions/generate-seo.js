/**
 * Viralora - Real Gemini AI Social SEO & Content Synthesizer
 * Netlify Serverless Function
 * Generates platform-specific titles, descriptions, and hashtags using Google Gemini API
 */

exports.handler = async function(event, context) {
    // 1. CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    // 2. Parse incoming payload
    let payload = {};
    try {
        payload = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
        payload = {};
    }

    const platform = payload.platform || 'TikTok';
    const topic = payload.topic || 'Trending Viral Video';
    const niche = payload.niche || 'Entertainment';
    const audience = payload.audience || 'General Audience';

    // 3. Retrieve Google Gemini API Key from environment
    const apiKey = process.env.GEMINI_API_KEY 
        || process.env.GOOGLE_API_KEY 
        || process.env.VITE_GEMINI_API_KEY 
        || process.env.API_KEY 
        || process.env.GOOGLE_GENAI_API_KEY;

    // Platform-tailored fallback generator if API key is missing or quota exceeded
    const getPlatformFallbacks = () => {
        const cleanTopic = topic.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const cleanNiche = niche.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        
        switch (platform.toLowerCase()) {
            case 'instagram':
                return {
                    titles: [
                        `Save this Reel before the algorithm changes! 📲`,
                        `The easiest way to master ${topic} this week...`,
                        `Stop scrolling if you want to grow your ${niche} page!`
                    ],
                    description: `Here is everything you need to know about ${topic} in the ${niche} space! ✨\n\n📌 Save this reel so you don't lose it.\n💬 Drop your questions below & let's discuss!\n👉 Follow for daily ${niche} growth tips & strategies.`,
                    hashtags: `#reels #explorepage #viralreels #${cleanTopic || 'trending'} #${cleanNiche || 'creator'} #${cleanTopic}reels #${cleanNiche}tips #creatorsofinstagram #reelsoftheday #viralcontent`,
                    broadHashtags: ["#reels", "#explorepage", "#viralreels", "#instadaily", "#trendingnow"],
                    nicheHashtags: [`#${cleanTopic || 'trending'}`, `#${cleanNiche || 'creator'}`, `#${cleanTopic}reels`, `#${cleanNiche}tips`, `#creatorsofinstagram`],
                    hooks: [
                        `Save this Reel before the algorithm changes! 📲`,
                        `The easiest way to master ${topic} this week...`,
                        `Stop scrolling if you want to grow your ${niche} page!`
                    ],
                    caption: `Here is everything you need to know about ${topic} in the ${niche} space! ✨\n\n📌 Save this reel so you don't lose it.\n💬 Drop your questions below & let's discuss!\n👉 Follow for daily ${niche} growth tips & strategies.`
                };
            case 'youtube':
            case 'youtube shorts':
                return {
                    titles: [
                        `Watch this before you make your next video on ${topic}!`,
                        `The viral YouTube Shorts formula for ${topic} revealed:`,
                        `Why 99% of creators fail at ${topic} (and how to fix it)!`
                    ],
                    description: `Learn the essential secrets of ${topic} for ${audience} in the ${niche} niche! 🚀\n\n🔔 Don't forget to LIKE and SUBSCRIBE for more daily shorts!\nShare your thoughts in the comments below!`,
                    hashtags: `#shorts #youtubeshorts #viralshorts #${cleanTopic || 'shorts'} #${cleanNiche || 'tips'} #${cleanTopic}shorts #algorithm #creatoreconomy #trending`,
                    broadHashtags: ["#shorts", "#youtubeshorts", "#viralshorts", "#trending", "#shortsvideo"],
                    nicheHashtags: [`#${cleanTopic || 'shorts'}`, `#${cleanNiche || 'tips'}`, `#${cleanTopic}shorts`, `#${cleanNiche}channel`, `#algorithm`],
                    hooks: [
                        `Watch this before you make your next video on ${topic}!`,
                        `The viral YouTube Shorts formula for ${topic} revealed:`,
                        `Why 99% of creators fail at ${topic} (and how to fix it)!`
                    ],
                    caption: `Learn the essential secrets of ${topic} for ${audience} in the ${niche} niche! 🚀\n\n🔔 Don't forget to LIKE and SUBSCRIBE for more daily shorts!\nShare your thoughts in the comments below!`
                };
            case 'tiktok':
            default:
                return {
                    titles: [
                        `You won't believe what happened when we tried ${topic}!`,
                        `Stop scrolling if you want to know the truth about ${topic}...`,
                        `3 secrets about ${topic} that no one is telling you!`
                    ],
                    description: `Here is everything you need to know about ${topic}! Make sure to save this video and follow for daily viral ${niche} updates. What do you think? Drop a comment below! 🔥`,
                    hashtags: `#fyp #viral #trending #foryou #${cleanTopic || 'viral'} #${cleanNiche || 'creator'} #${cleanTopic}tips #trending${cleanNiche} #${cleanTopic}hacks #creatorgrowth`,
                    broadHashtags: ["#fyp", "#viral", "#trending", "#foryou", "#foryoupage"],
                    nicheHashtags: [`#${cleanTopic || 'viral'}`, `#${cleanNiche || 'creator'}`, `#${cleanTopic}tips`, `#trending${cleanNiche}`, `#${cleanTopic}hacks`],
                    hooks: [
                        `You won't believe what happened when we tried ${topic}!`,
                        `Stop scrolling if you want to know the truth about ${topic}...`,
                        `3 secrets about ${topic} that no one is telling you!`
                    ],
                    caption: `Here is everything you need to know about ${topic}! Make sure to save this video and follow for daily viral ${niche} updates. What do you think? Drop a comment below! 🔥`
                };
        }
    };

    if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not configured. Serving platform-curated fallback.");
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(getPlatformFallbacks())
        };
    }

    try {
        const prompt = `Act as an elite social media content strategist and viral growth algorithm specialist for ${platform}.
Platform: "${platform}".
Video/Content Topic: "${topic}".
Niche Category: "${niche}".
Target Audience: "${audience}".

Analyze the current 2026 recommendation algorithm for ${platform} and generate a high-performing, authentic content strategy.
You MUST return a STRICT VALID JSON object with EXACTLY these keys:
{
  "titles": ["High-converting Title/Hook 1", "High-converting Title/Hook 2", "High-converting Title/Hook 3"],
  "description": "Engaging, platform-tailored caption and description formatted for ${platform} with an interactive question or call to action.",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10",
  "broadHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "nicheHashtags": ["#tag6", "#tag7", "#tag8", "#tag9", "#tag10"]
}

Guidelines:
- Titles: 3 psychological, high-CTR hook lines or video title text overlays to maximize 0-3 second retention.
- Description: High-retention caption formatted cleanly with appropriate emojis and clear call to action.
- Hashtags: 10 relevant hashtags starting with '#' and space-separated.
- Return ONLY the JSON object. Do not include markdown code fences (no \`\`\`json).`;

        // Model fallback chain: gemini-3.6-flash -> gemini-3.8-flash -> gemini-flash-latest
        const candidateModels = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
        let successData = null;
        let lastError = null;

        for (const model of candidateModels) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'User-Agent': 'aistudio-build'
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { 
                            response_mime_type: "application/json",
                            thinking_config: { thinking_level: "LOW" },
                            temperature: 0.7
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
                    lastError = `Model ${model} responded ${response.status}: ${errText}`;
                }
            } catch (modelErr) {
                lastError = modelErr.message;
            }
        }

        if (successData) {
            // Normalize properties
            const titles = Array.isArray(successData.titles) 
                ? successData.titles 
                : (Array.isArray(successData.hooks) ? successData.hooks : []);
            
            const description = successData.description || successData.caption || '';

            let hashtagsStr = '';
            if (typeof successData.hashtags === 'string') {
                hashtagsStr = successData.hashtags.trim();
            } else if (Array.isArray(successData.hashtags)) {
                hashtagsStr = successData.hashtags.join(' ');
            }

            let tagsList = hashtagsStr ? hashtagsStr.split(/\s+/).filter(t => t.startsWith('#')) : [];
            if (!tagsList.length && (successData.broadHashtags || successData.nicheHashtags)) {
                tagsList = [...(successData.broadHashtags || []), ...(successData.nicheHashtags || [])];
                hashtagsStr = tagsList.join(' ');
            }

            const mid = Math.ceil(tagsList.length / 2);
            const broadHashtags = (Array.isArray(successData.broadHashtags) && successData.broadHashtags.length)
                ? successData.broadHashtags
                : tagsList.slice(0, mid);

            const nicheHashtags = (Array.isArray(successData.nicheHashtags) && successData.nicheHashtags.length)
                ? successData.nicheHashtags
                : tagsList.slice(mid);

            const finalPayload = {
                titles: titles.length ? titles : ["Title 1", "Title 2", "Title 3"],
                description: description || `Trending content strategy for ${topic}.`,
                hashtags: hashtagsStr || "#viral #trending #explore",
                // Backwards-compatible aliases
                hooks: titles.length ? titles : ["Title 1", "Title 2", "Title 3"],
                caption: description || `Trending content strategy for ${topic}.`,
                broadHashtags: broadHashtags.length ? broadHashtags : ["#viral", "#trending"],
                nicheHashtags: nicheHashtags.length ? nicheHashtags : ["#content", "#creator"]
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(finalPayload)
            };
        }

        throw new Error(lastError || "All Gemini candidate models failed to return content.");
    } catch (error) {
        console.error("Netlify Function Error:", error);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(getPlatformFallbacks())
        };
    }
};
