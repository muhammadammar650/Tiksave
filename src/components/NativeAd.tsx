import { useEffect, useRef } from 'react';

export default function NativeAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = "https://pl30778496.profitableratecpmnetwork.com/052876bc9fe7b0dc10dd2194cdf2a6da/invoke.js";
      
      const container = document.createElement('div');
      container.id = "container-052876bc9fe7b0dc10dd2194cdf2a6da";
      
      adRef.current.appendChild(script);
      adRef.current.appendChild(container);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-6 overflow-hidden rounded-xl bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border-color))] min-h-[100px]">
      <div ref={adRef} className="w-full flex justify-center items-center">
        {/* Adsterra Native Ad Container */}
      </div>
    </div>
  );
}
