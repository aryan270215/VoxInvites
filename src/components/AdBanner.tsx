import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdBanner({ format = 'banner' }: { format?: 'banner' | 'interstitial' | 'rewarded' | 'nativeAdvanced' | 'appOpen' }) {
  const [adCode, setAdCode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAdCode = async () => {
      try {
        const settingsRef = doc(db, 'settings', 'global');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists() && settingsSnap.data().adCodes) {
          const code = settingsSnap.data().adCodes[format];
          if (code) {
            setAdCode(code);
          }
        }
      } catch (err) {
        console.warn('Error fetching ad code:', err);
      }
    };
    fetchAdCode();
  }, [format]);

  useEffect(() => {
    if (adCode && containerRef.current) {
      containerRef.current.innerHTML = '';
      const range = document.createRange();
      range.selectNode(containerRef.current);
      const fragment = range.createContextualFragment(adCode);
      
      const scripts = fragment.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
      
      containerRef.current.appendChild(fragment);
    }
  }, [adCode]);

  if (!adCode) {
    return null; // Don't show anything and hide the banner space if there's no code provided
  }

  // Format specific wrapper styles
  const wrapperStyle = format === 'interstitial' || format === 'appOpen' 
    ? "fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" 
    : "w-full my-8 flex flex-col items-center justify-center overflow-hidden";

  return (
    <div className={wrapperStyle}>
      <div ref={containerRef} className="w-full flex justify-center items-center" />
    </div>
  );
}
