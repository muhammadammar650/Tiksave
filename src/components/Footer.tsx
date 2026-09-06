export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] pb-8 pt-10">
      <div className="px-6 text-center">
        <h3 className="mb-4 text-xl font-black text-[rgb(var(--text-primary))]">UniDown</h3>
        <p className="mb-8 text-xs leading-relaxed text-[rgb(var(--text-secondary))]">
          The ultimate multi-platform video downloader. Download TikTok, Instagram, Facebook, and YouTube videos securely in pure HD MP4 format. No watermarks, no registration, lightning fast. Plus, access our AI SEO Tools to boost your content.
        </p>
        
        <div className="mb-8 grid grid-cols-2 gap-4 text-sm font-semibold text-[rgb(var(--text-primary))]">
          <span className="cursor-pointer hover:opacity-70 transition-opacity">Privacy Policy</span>
          <span className="cursor-pointer hover:opacity-70 transition-opacity">Terms of Service</span>
          <span className="col-span-2 cursor-pointer hover:opacity-70 transition-opacity">Contact Us</span>
        </div>

        <div className="space-y-2 text-[11px] font-medium text-[rgb(var(--text-secondary))]">
          <p>businessammar650@gmail.com</p>
          <p>Copyright ©️ 2026. Created by Muhammad Ammar. 100% Free for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
