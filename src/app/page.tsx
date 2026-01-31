'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, Zap, Radio, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTryNow = () => {
    setIsLoading(true);
    // Simulate loading sequence
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) {
        currentProgress = 100;
        clearInterval(interval);
        router.push('/chat');
      }
      setProgress(currentProgress);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-900/50 flex flex-col items-center justify-center relative overflow-hidden font-sans">

      {/* Ambient Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-12">

        {/* Logo / Brand */}


        {/* Main Headline */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 ease-out fill-mode-backwards">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              SONIC
            </span>
            <span className="text-4xl md:text-6xl text-zinc-600 font-light tracking-wide block mt-2">
              INTELLIGENCE
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Next-generation non-destructive testing and real-time structural health monitoring.
          </p>
        </div>



        {/* Action Area */}
        <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 ease-out fill-mode-backwards">
          {isLoading ? (
            <div className="w-full max-w-sm mx-auto space-y-4">
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-150 ease-linear shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
                <span>Initializing Modules...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleTryNow}
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-white text-black text-lg font-bold tracking-wide rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              <span className="relative">TRY NOW</span>
              <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

      </main>

      {/* Footer Status */}

    </div>
  );
}
