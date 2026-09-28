'use client';

import React, { useState } from 'react';
import { SaliencyWord } from '@/lib/types';

interface SaliencyHighlighterProps {
  saliency: SaliencyWord[];
  dominantColor: string;
}

export default function SaliencyHighlighter({ saliency, dominantColor }: SaliencyHighlighterProps) {
  const [hoveredWord, setHoveredWord] = useState<SaliencyWord | null>(null);

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <h3 className="text-sm font-semibold text-slate-200">Word Attribution & Saliency Heatmap</h3>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-purple-500/30 border border-purple-400"></span> Key Driver
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-white/10"></span> Neutral
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Hover over tokens to inspect attention attribution weights driving the model&apos;s cognitive determination:
      </p>

      {/* Tokens display */}
      <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-950/70 border border-white/5 min-h-[75px] items-center">
        {saliency.map((item, idx) => {
          const isKey = item.is_key_driver;
          const pct = Math.round(item.weight * 100);

          return (
            <span
              key={idx}
              onMouseEnter={() => setHoveredWord(item)}
              onMouseLeave={() => setHoveredWord(null)}
              style={{
                backgroundColor: isKey ? `${dominantColor}25` : item.weight > 0.3 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                borderColor: isKey ? dominantColor : 'rgba(255,255,255,0.1)',
                boxShadow: isKey ? `0 0 12px ${dominantColor}40` : 'none',
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                isKey ? 'text-white scale-105 font-semibold' : 'text-slate-300 hover:border-white/30'
              }`}
            >
              <span>{item.word}</span>
              {isKey && (
                <span
                  style={{ backgroundColor: dominantColor }}
                  className="text-[10px] text-black font-extrabold px-1.5 py-0.2 rounded-full"
                >
                  {pct}%
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Hover Inspector Bar */}
      <div className="mt-3 py-2 px-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Token Inspector:{' '}
          <strong className="text-slate-200">{hoveredWord ? `"${hoveredWord.word}"` : 'None (hover over token)'}</strong>
        </span>
        <span className="font-mono text-purple-300">
          {hoveredWord ? `Attribution Weight: ${(hoveredWord.weight * 100).toFixed(0)}% (${hoveredWord.is_key_driver ? 'Key Antecedent Driver' : 'Supporting Syntactic Context'})` : 'Hover to view breakdown'}
        </span>
      </div>
    </div>
  );
}
