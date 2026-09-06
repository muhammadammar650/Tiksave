import { Link, useLocation } from "react-router-dom";
import { Menu, Droplets, Sun, X, Download } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../App";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "TikTok", path: "/tiktok" },
    { name: "Instagram", path: "/instagram" },
    { name: "Facebook", path: "/facebook" },
    { name: "YouTube", path: "/youtube" },
    { name: "SEO Tools", path: "/seo-tools" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[rgb(var(--bg-primary))]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[420px] sm:max-w-md md:max-w-lg items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg theme-gradient text-white">
            <Download className="h-5 w-5" />
          </div>
          <span className="font-black tracking-tight text-lg text-[rgb(var(--text-primary))]">
            UniDown
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "bright" ? "blue" : "bright")}
            className="rounded-full p-2 text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))] transition-colors"
            title="Toggle Theme"
          >
            {theme === "bright" ? <Droplets className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-full p-2 text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))] transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-16 w-full border-b border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] shadow-xl">
          <div className="mx-auto w-full max-w-[420px] sm:max-w-md md:max-w-lg p-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  location.pathname === link.path
                    ? "bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))]"
                    : "text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
