'use client';

import React from 'react';
import { Volume2, Sparkles, Check } from 'lucide-react';

interface ActionKeyModeBarProps {
  currentUtterance?: string;
}

export default function ActionKeyModeBar({ currentUtterance }: ActionKeyModeBarProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-[#121316] text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md hover:scale-105 transition-transform duration-200 cursor-pointer">
        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-slate-300">
          <Volume2 className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold tracking-wide text-slate-100 flex items-center gap-2">
          Action key mode
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline border-l border-white/10 pl-3">
          Deep Deconstruction Active
        </span>
      </div>
    </div>
  );
}
