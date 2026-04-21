import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface FallbackAd {
  imageUrl: string;
  linkUrl: string;
  title: string;
  description: string;
}

export default function AdBanner({ format = 'banner' }: { format?: 'banner' | 'interstitial' | 'rewarded' | 'nativeAdvanced' | 'appOpen' }) {
  const [adCode, setAdCode] = useState<string | null>(null);
  const [fallbackAd, setFallbackAd] = useState<FallbackAd | null>(null);
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect Adblock by checking if an element with Ad classes gets hidden by superficial filters
    // or by attempting a network request blocked by trackers
    const detector = document.createElement('div');
    detector.className = 'ad-banner adsbox doubleclick sponsored';
    detector.style.position = 'absolute';
    detector.style.left = '-999px';
    detector.style.width = '1px';
    detector.style.height = '1px';
    document.body.appendChild(detector);

    const testAdblock = async () => {
      // 1. Cosmetic Filter test
      let blockedByCSS = false;
      if (!detector || detector.offsetHeight === 0 || window.getComputedStyle(detector).display === 'none') {
        blockedByCSS = true;
      }
      
      // 2. Network Block Test
      let blockedByNetwork = false;
      try {
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { 
          method: 'HEAD', 
          mode: 'no-cors',
          cache: 'no-store'
        });
      } catch (e) {
        blockedByNetwork = true;
      }

      if (blockedByCSS || blockedByNetwork) {
        setAdBlockDetected(true);
      }
      
      if (document.body.contains(detector)) {
        document.body.removeChild(detector);
      }
    };

    setTimeout(() => testAdblock(), 150);
  }, []);

  useEffect(() => {
    const fetchAdCode = async () => {
      try {
        const settingsRef = doc(db, 'settings', 'global');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          if (data.adCodes && data.adCodes[format]) {
            setAdCode(data.adCodes[format]);
          }
          if (data.fallbackAd && (data.fallbackAd.imageUrl || data.fallbackAd.title)) {
            setFallbackAd(data.fallbackAd);
          }
        }
      } catch (err) {
        console.warn('Error fetching ad code:', err);
      }
    };
    fetchAdCode();
  }, [format]);

  // Handle standard Ad Code injection
  useEffect(() => {
    if (!adBlockDetected && adCode && containerRef.current) {
      containerRef.current.innerHTML = '';
      const range = document.createRange();
      range.selectNode(containerRef.current);
      try {
        const fragment = range.createContextualFragment(adCode);
        
        const scripts = fragment.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
        
        containerRef.current.appendChild(fragment);
      } catch (e) {
        console.error("Failed to parse ad code", e);
      }
    }
  }, [adCode, adBlockDetected]);

  // Decide if we shouldn't show anything
  if (!adCode && !fallbackAd) {
    return null;
  }

  // Format specific wrapper styles
  const isOverlay = format === 'interstitial' || format === 'appOpen';
  const wrapperStyle = isOverlay 
    ? "fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" 
    : "w-full my-8 flex flex-col items-center justify-center overflow-hidden";

  if (isHidden) return null;

  return (
    <div className={wrapperStyle}>
      <div className={`relative w-full max-w-4xl max-h-full flex flex-col items-center justify-center overflow-y-auto ${isOverlay && adBlockDetected ? 'bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full' : 'bg-transparent'}`}>
        
        {isOverlay && (
          <button 
            onClick={() => setIsHidden(true)} 
            className={`absolute top-2 right-2 p-2 rounded-full font-bold z-[101] shadow-lg flex items-center justify-center w-10 h-10 ${
              adBlockDetected ? 'bg-stone-100 text-stone-500 hover:bg-stone-200' : 'bg-white text-black hover:bg-stone-200'
            }`}
            aria-label="Close Ad"
          >
            ✕
          </button>
        )}

        {adBlockDetected && fallbackAd ? (
          // NATIVE FALLBACK AD
          <a
            href={fallbackAd.linkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-left transition-transform hover:scale-[1.01] ${!isOverlay && 'bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden'}`}
          >
            {fallbackAd.imageUrl && (
              <img 
                src={fallbackAd.imageUrl} 
                alt={fallbackAd.title || 'Advertisement'} 
                className={`w-full object-cover ${isOverlay ? 'h-64' : 'max-h-48'} bg-stone-100`}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            {(fallbackAd.title || fallbackAd.description) && (
              <div className="p-4 bg-white">
                <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-1">Sponsored</div>
                {fallbackAd.title && <h3 className="font-bold font-serif text-stone-900 text-lg mb-1">{fallbackAd.title}</h3>}
                {fallbackAd.description && <p className="text-stone-600 text-sm">{fallbackAd.description}</p>}
              </div>
            )}
          </a>
        ) : (
          // STANDARD AD CODE
          <div ref={containerRef} className="w-full flex justify-center items-center" />
        )}

      </div>
    </div>
  );
}
