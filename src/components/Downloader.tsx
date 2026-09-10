import { useState, type FormEvent } from "react";
import { Download, Loader2, Link as LinkIcon, Video, Music } from "lucide-react";
import type { VideoData } from "../types";
import NativeAd from "./NativeAd";

interface DownloaderProps {
  platform: string;
}

export default function Downloader({ platform }: DownloaderProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      setError("Please allow clipboard permissions or paste manually.");
    }
  };

  const handleDownload = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("⚠️ Invalid video link. Please check the URL and try again.");
      return;
    }
    
    setError("");
    setIsLoading(true);
    setVideoData(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "⚠️ Failed to process link.");
      }
      
      setVideoData(data.data);
    } catch (err: any) {
      setError(err.message || "⚠️ An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerBlobDownload = async (fileUrl: string, filename: string) => {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(a);
    } catch (e) {
      // Fallback for CORS blocks during simulation
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleDownload} className="w-full mx-auto">
        <div className="relative flex items-center rounded-2xl bg-white p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] transition-all focus-within:ring-4 focus-within:ring-white/30">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`Paste ${platform} link...`}
            className="w-full bg-transparent px-4 py-3 text-[16px] text-slate-900 outline-none placeholder:text-slate-400"
            required
          />
          <button
            type="button"
            onClick={handlePaste}
            className="mr-1 shrink-0 rounded-xl bg-slate-100 px-4 py-2.5 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Paste
          </button>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 p-4 text-[16px] font-black text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          <span>{isLoading ? "Processing..." : "Download Now"}</span>
        </button>
        
        {error && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 rounded-xl bg-red-500/90 backdrop-blur border border-red-400 p-3 text-sm font-bold text-white shadow-lg flex items-center gap-2">
            {error}
          </div>
        )}
      </form>

      {videoData && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full overflow-hidden rounded-3xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] shadow-xl">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 bg-[rgb(var(--bg-secondary))] p-4 border-b border-[rgb(var(--border-color))]">
                <img
                  src={videoData.profilePic}
                  alt={videoData.username}
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-[rgb(var(--text-primary))] truncate">@{videoData.username}</h3>
                  <p className="line-clamp-2 text-[12px] text-[rgb(var(--text-secondary))] leading-snug">
                    {videoData.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 p-4">
                <button
                  onClick={() => triggerBlobDownload(videoData.downloads.hd, 'video_hd.mp4')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] p-3.5 text-[14px] font-bold text-white shadow-md shadow-emerald-500/20 transition-transform active:scale-[0.98]"
                >
                  <Video className="h-4 w-4" /> Without Watermark HD
                </button>
                
                {/* Native Ad Integration */}
                <NativeAd />
                
                <button
                  onClick={() => triggerBlobDownload(videoData.downloads.sd, 'video.mp4')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl theme-gradient p-3.5 text-[14px] font-bold text-white shadow-md shadow-purple-500/20 transition-transform active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" /> Without Watermark
                </button>
                
                <button
                  onClick={() => triggerBlobDownload(videoData.downloads.audio, 'audio.mp3')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] p-3.5 text-[14px] font-bold transition-transform active:scale-[0.98] border border-[rgb(var(--border-color))]"
                >
                  <Music className="h-4 w-4" /> Download MP3
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
