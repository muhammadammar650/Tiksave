export default function Blog() {
  return (
    <div className="w-full flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 rounded-2xl theme-gradient p-6 text-white shadow-xl">
        <h1 className="mb-2 text-2xl font-black">Blog & Guides</h1>
        <p className="text-sm font-medium opacity-90">Master content creation and social media downloads.</p>
      </div>

      <div className="flex flex-col gap-6">
        <article className="rounded-2xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[rgb(var(--text-primary))]">How to Download TikTok Videos Without Watermark</h2>
          <p className="mb-4 text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
            Downloading TikTok videos without a watermark is easier than ever. Simply copy the link from the TikTok app, paste it into our Universal Downloader, and click "Download". Our system automatically processes the video and provides you with a clean, high-definition MP4 file.
          </p>
          <a href="/tiktok" className="text-sm font-bold theme-text-gradient">Try it now &rarr;</a>
        </article>

        <article className="rounded-2xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[rgb(var(--text-primary))]">The Secret to Viral Instagram Reels</h2>
          <p className="mb-4 text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
            Getting your Reels to go viral requires a combination of high-quality content, trending audio, and perfect SEO. Use our built-in AI SEO Tool to generate highly optimized hashtags and hooks that tell the algorithm exactly who to show your video to.
          </p>
          <a href="/seo-tools" className="text-sm font-bold theme-text-gradient">Generate SEO &rarr;</a>
        </article>

        <article className="rounded-2xl border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[rgb(var(--text-primary))]">Why Use a Universal Downloader?</h2>
          <p className="mb-4 text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
            Content creators often need to cross-post their content across multiple platforms. A universal downloader allows you to fetch your raw videos from YouTube, Facebook, or Instagram and repurpose them without platform-specific branding getting in the way.
          </p>
          <a href="/" className="text-sm font-bold theme-text-gradient">Start downloading &rarr;</a>
        </article>
      </div>
    </div>
  );
}
