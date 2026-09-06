import Downloader from "../components/Downloader";
import { CheckCircle2 } from "lucide-react";

interface HomeProps {
  platform: string;
}

export default function Home({ platform }: HomeProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full theme-gradient px-4 py-12 rounded-b-[2.5rem] shadow-xl">
        <div className="mx-auto w-full text-center">
          <h1 className="mb-3 text-3xl font-extrabold leading-tight text-white drop-shadow-sm">
            Download Any Video,<br />No Watermarks.
          </h1>
          <p className="mb-6 text-sm font-medium text-white/90 drop-shadow-sm">
            HD MP4 & MP3 support for {platform} & more.
          </p>
          <Downloader platform={platform} />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-10 w-full">
        <div className="grid gap-4">
          <div className="flex flex-col rounded-2xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-sm font-bold text-[rgb(var(--text-primary))]">Unlimited Downloads</h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--text-secondary))]">No daily limits or hidden costs. Save everything entirely for free.</p>
          </div>
          <div className="flex flex-col rounded-2xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-sm font-bold text-[rgb(var(--text-primary))]">Pure HD Export</h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--text-secondary))]">Native resolution export for MP4 and crystal clear 320kbps MP3 audio.</p>
          </div>
          <div className="flex flex-col rounded-2xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-sm font-bold text-[rgb(var(--text-primary))]">100% Secure & Private</h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--text-secondary))]">We do not track your downloads or store your data. Complete privacy.</p>
          </div>
        </div>
      </section>

      {/* How To Section */}
      <section className="px-6 pb-12 w-full">
        <h2 className="mb-6 text-xl font-black text-[rgb(var(--text-primary))]">How to download?</h2>
        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-[rgb(var(--border-color))]">
          <div className="relative pl-12">
            <span className="absolute left-0 top-0.5 flex h-10 w-10 items-center justify-center rounded-full theme-gradient text-white text-sm font-bold ring-4 ring-[rgb(var(--bg-primary))] shadow-sm">1</span>
            <h4 className="font-bold text-[rgb(var(--text-primary))] mb-1">Find the video</h4>
            <p className="text-xs leading-relaxed text-[rgb(var(--text-secondary))]">Open your app, find the video you want to save, hit share and click "Copy Link".</p>
          </div>
          <div className="relative pl-12">
            <span className="absolute left-0 top-0.5 flex h-10 w-10 items-center justify-center rounded-full theme-gradient text-white text-sm font-bold ring-4 ring-[rgb(var(--bg-primary))] shadow-sm">2</span>
            <h4 className="font-bold text-[rgb(var(--text-primary))] mb-1">Paste the link</h4>
            <p className="text-xs leading-relaxed text-[rgb(var(--text-secondary))]">Return here and paste the copied link into the search box at the top of the page.</p>
          </div>
          <div className="relative pl-12">
            <span className="absolute left-0 top-0.5 flex h-10 w-10 items-center justify-center rounded-full theme-gradient text-white text-sm font-bold ring-4 ring-[rgb(var(--bg-primary))] shadow-sm">3</span>
            <h4 className="font-bold text-[rgb(var(--text-primary))] mb-1">Download</h4>
            <p className="text-xs leading-relaxed text-[rgb(var(--text-secondary))]">Click the Download button and select your preferred format (HD Video or MP3 Audio).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
