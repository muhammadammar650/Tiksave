const express = require("express");
const path = require("path");
const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Security Middleware (CSP & Ad Filtering)
app.use((req, res, next) => {
  // Strict CSP to block malicious ads (adult, gambling, vulgar)
  // Only allows the specified Native Ad network and trusted CDNs for styling
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://pl30778496.profitableratecpmnetwork.com; " +
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
    "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; " +
    "img-src 'self' data: https: http:; " +
    "connect-src 'self' https: http:;"
  );
  // Anti-clickjacking & strict mime sniffing
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(express.json());

// Gemini AI SEO Generator Route
app.post("/api/seo/generate", async (req, res) => {
  try {
    const { platform, topic, niche } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured on the server.");
    }
    
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
    });
    
    const prompt = `Act as an expert SEO and Social Media Manager for ${platform}.
    Topic: ${topic}
    Niche: ${niche}
    
    Create a highly optimized video package including:
    1. Viral Hashtags grouped by size (Broad, Niche, Micro).
    2. 3 Optimized Video Titles.
    3. 3 Caption hooks and Call-to-Actions (CTAs).
    
    Format the output as a valid JSON object matching the requested schema.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hashtags: {
              type: Type.OBJECT,
              properties: {
                broad: { type: Type.ARRAY, items: { type: Type.STRING } },
                niche: { type: Type.ARRAY, items: { type: Type.STRING } },
                micro: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["broad", "niche", "micro"]
            },
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
            ctas: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["hashtags", "titles", "hooks", "ctas"]
        }
      }
    });
    
    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate SEO data." });
  }
});

// Serve frontend SPA
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running securely on port ${PORT}`);
});
