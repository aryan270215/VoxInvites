import React, { useState } from 'react';
import { PlayCircle, X } from 'lucide-react';

export default function AdBanner({ format = 'banner', onReward }: { format?: 'banner' | 'rewarded', onReward?: () => void }) {
  const [watching, setWatching] = useState(false);

  if (format === 'rewarded') {
    if (watching) {
      return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-white p-4">
          <p className="mb-4 text-xl font-medium">Sponsor Message</p>
          <div className="w-full max-w-md aspect-video bg-stone-800 flex items-center justify-center rounded-lg border border-stone-700 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 animate-pulse"></div>
            <span className="relative z-10 text-stone-400">Video Ad Playing (Simulated 3s)</span>
          </div>
          <button 
            onClick={() => {
              setWatching(false);
              if (onReward) onReward();
            }}
            className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-stone-200 transition-colors"
          >
            Skip / Close (Simulate Finish)
          </button>
        </div>
      );
    }
    return (
      <button 
        onClick={() => {
          setWatching(true);
          setTimeout(() => {
            setWatching(false);
            if (onReward) onReward();
          }, 3000); // Simulate 3 second ad
        }}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
      >
        <PlayCircle className="w-5 h-5" />
        Watch Ad to Unlock Gallery
      </button>
    );
  }

  return (
    <div className="w-full bg-stone-100 border-y border-stone-200 py-4 flex flex-col items-center justify-center text-stone-400 my-8">
      <p className="text-xs uppercase tracking-widest mb-1">Advertisement</p>
      <div className="w-[300px] h-[250px] md:w-[728px] md:h-[90px] bg-stone-200 flex items-center justify-center rounded border border-stone-300">
        <span className="text-sm">Ad Space (Google AdSense)</span>
      </div>
    </div>
  );
}
