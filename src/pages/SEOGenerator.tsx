import { useState } from "react";
import { Sparkles, Loader2, Copy, CheckCircle2 } from "lucide-react";
import type { SEOData } from "../types";

export default function SEOGenerator() {
  const [platform, setPlatform] = useState("TikTok");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<SEOData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !niche) {
      setError("Please fill out the required fields.");
      return;
    }

    setError("");
    setIsLoading(true);
    setData(null);

    try {
      const response = await fetch("/api/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic, niche, targetAudience }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate SEO package.");
      }
      
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    
    let textToCopy = `🔥 ${platform} SEO Package\n\n`;
    textToCopy += `📝 Titles:\n`;
    data.titles.forEach((t) => (textToCopy += `- ${t}\n`));
    textToCopy += `\n🎣 Hooks:\n`;
    data.hooks.forEach((h) => (textToCopy += `- ${h}\n`));
    textToCopy += `\n🎯 CTAs:\n`;
    data.ctas.forEach((c) => (textToCopy += `- ${c}\n`));
    textToCopy += `\n#️⃣ Broad Hashtags:\n${data.hashtags.broad.join(" ")}\n`;
    textToCopy += `\n#️⃣ Niche Hashtags:\n${data.hashtags.niche.join(" ")}\n`;
    textToCopy += `\n#️⃣ Micro Hashtags:\n${data.hashtags.micro.join(" ")}\n`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="w-full theme-gradient px-4 py-10 text-center rounded-b-[2.5rem] shadow-xl">
        <h1 className="mb-2 text-3xl font-black text-white drop-shadow-sm flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6" /> AI SEO Creator
        </h1>
        <p className="text-sm font-medium text-white/90 px-4">
          Generate viral hashtags, titles, and hooks using Gemini AI.
        </p>
      </section>

      <section className="px-5 py-8 w-full -mt-6">
        <form onSubmit={handleGenerate} className="bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-color))] rounded-2xl shadow-lg p-5">
          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--text-secondary))]">Platform</label>
              <select 
                className="w-full rounded-xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] px-3 py-3 text-sm font-semibold text-[rgb(var(--text-primary))] outline-none focus:border-purple-500 transition-colors"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option>TikTok</option>
                <option>Instagram Reels</option>
                <option>Facebook Reels</option>
                <option>YouTube Shorts</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--text-secondary))]">Video Topic *</label>
              <input 
                type="text"
                required
                placeholder="e.g. 5 tips for glowing skin"
                className="w-full rounded-xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] px-3 py-3 text-sm font-medium text-[rgb(var(--text-primary))] outline-none focus:border-purple-500 transition-colors"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--text-secondary))]">Niche / Industry *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Skincare, Finance, Tech"
                className="w-full rounded-xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] px-3 py-3 text-sm font-medium text-[rgb(var(--text-primary))] outline-none focus:border-purple-500 transition-colors"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-100 flex gap-2 items-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl theme-gradient py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{isLoading ? "Generating Magic..." : "Generate SEO Package"}</span>
          </button>
        </form>

        {data && (
          <div className="mt-8 rounded-2xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="border-b border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] p-4 flex justify-between items-center">
              <h2 className="text-sm font-black flex items-center gap-2 theme-text-gradient">
                <Sparkles className="h-4 w-4 text-purple-500" /> Viral Output Ready
              </h2>
            </div>
            
            <div className="p-4">
              <div className="h-64 w-full overflow-y-auto rounded-xl bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border-color))] p-4 font-mono text-[11px] leading-relaxed text-[rgb(var(--text-primary))]">
                <span className="font-bold text-purple-600">#️⃣ Broad:</span> {data.hashtags.broad.join(" ")}
                <br /><br />
                <span className="font-bold text-purple-600">#️⃣ Niche:</span> {data.hashtags.niche.join(" ")}
                <br /><br />
                <span className="font-bold text-purple-600">#️⃣ Micro:</span> {data.hashtags.micro.join(" ")}
                <br /><br />
                <span className="font-bold text-purple-600">📝 Titles:</span><br />
                {data.titles.map(t => `- ${t}`).join('\n')}
                <br /><br />
                <span className="font-bold text-purple-600">🎣 Hooks:</span><br />
                {data.hooks.map(h => `- ${h}`).join('\n')}
                <br /><br />
                <span className="font-bold text-purple-600">🎯 CTAs:</span><br />
                {data.ctas.map(c => `- ${c}`).join('\n')}
              </div>

              <button
                onClick={handleCopy}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(var(--text-primary))] py-3 text-sm font-bold text-[rgb(var(--bg-primary))] transition-transform active:scale-[0.98]"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied Successfully!" : "Copy All"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
