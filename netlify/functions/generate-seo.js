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

    if (!apiKey) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not configured.' })
        };
    }

    try {
        const prompt = `Act as an elite social media content strategist and viral growth algorithm specialist for ${platform}.
Platform: "${platform}".
Video/Content Topic: "${topic}".
Niche Category: "${niche}".
Target Audience: "${audience}".

Analyze the current recommendation algorithm for ${platform} and generate a high-performing, authentic content strategy.
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

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'aistudio-build'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    response_mime_type: "application/json",
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API responded with status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
        const successData = JSON.parse(jsonText);

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

    } catch (error) {
        console.error("Netlify Function Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || "Failed to generate content." })
        };
    }
};
