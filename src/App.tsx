/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SEOGenerator from "./pages/SEOGenerator";
import Blog from "./pages/Blog";
import type { Theme } from "./types";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>("bright");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("bright", "blue");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col transition-colors duration-300">
          <Navbar />
          <main className="flex-1 w-full max-w-[420px] mx-auto sm:max-w-md md:max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.05)] bg-[rgb(var(--bg-primary))]">
            <Routes>
              <Route path="/" element={<Home platform="Universal" />} />
              <Route path="/tiktok" element={<Home platform="TikTok" />} />
              <Route path="/instagram" element={<Home platform="Instagram" />} />
              <Route path="/facebook" element={<Home platform="Facebook" />} />
              <Route path="/youtube" element={<Home platform="YouTube" />} />
              <Route path="/seo-tools" element={<SEOGenerator />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </main>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
