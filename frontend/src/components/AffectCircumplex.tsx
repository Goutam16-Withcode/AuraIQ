'use client';

import React from 'react';
import { AffectCoordinates } from '@/lib/types';

interface AffectCircumplexProps {
  coordinates: AffectCoordinates;
  subEmotion: string;
  dominantColor: string;
}

export default function AffectCircumplex({ coordinates, subEmotion, dominantColor }: AffectCircumplexProps) {
  const width = 280;
  const height = 260;
  const pad = 35;

  // Map valence [-1, 1] to [pad, width - pad]
  const markerX = pad + ((coordinates.valence + 1) / 2) * (width - 2 * pad);
  
  // Map arousal [0, 1] to [height - pad, pad] (higher arousal = higher on Y axis)
  const markerY = (height - pad) - (coordinates.arousal * (height - 2 * pad));

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>🧭</span> Affect Circumplex (Valence & Arousal)
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">Russell 2D Model</span>
      </div>

      <div className="relative w-[280px] h-[260px] bg-slate-950/60 rounded-xl border border-white/5 p-1">
        <svg width={width} height={height} className="overflow-visible">
          {/* Quadrant background tints */}
          <rect x={pad} y={pad} width={(width - 2 * pad) / 2} height={(height - 2 * pad) / 2} fill="#EF4444" fillOpacity="0.04" />
          <rect x={pad + (width - 2 * pad) / 2} y={pad} width={(width - 2 * pad) / 2} height={(height - 2 * pad) / 2} fill="#F59E0B" fillOpacity="0.05" />
          <rect x={pad} y={pad + (height - 2 * pad) / 2} width={(width - 2 * pad) / 2} height={(height - 2 * pad) / 2} fill="#3B82F6" fillOpacity="0.06" />
          <rect x={pad + (width - 2 * pad) / 2} y={pad + (height - 2 * pad) / 2} width={(width - 2 * pad) / 2} height={(height - 2 * pad) / 2} fill="#10B981" fillOpacity="0.04" />

          {/* Quadrant Labels */}
          <text x={pad + 8} y={pad + 14} className="text-[9px] fill-red-400/80 font-semibold">Q2: High Arousal / Agitation</text>
          <text x={width - pad - 8} y={pad + 14} textAnchor="end" className="text-[9px] fill-amber-400/80 font-semibold">Q1: Euphoria / Joy</text>
          <text x={pad + 8} y={height - pad - 8} className="text-[9px] fill-blue-400/80 font-semibold">Q3: Depletion / Burnout</text>
          <text x={width - pad - 8} y={height - pad - 8} textAnchor="end" className="text-[9px] fill-emerald-400/80 font-semibold">Q4: Calm Equilibrium</text>

          {/* Center Crosshairs */}
          <line
            x1={pad}
            y1={pad + (height - 2 * pad) / 2}
            x2={width - pad}
            y2={pad + (height - 2 * pad) / 2}
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
          <line
            x1={pad + (width - 2 * pad) / 2}
            y1={pad}
            x2={pad + (width - 2 * pad) / 2}
            y2={height - pad}
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />

          {/* Axes labels */}
          <text x={width / 2} y={pad - 12} textAnchor="middle" className="text-[10px] fill-slate-300 font-bold tracking-wide">
            ▲ HIGH AROUSAL (Active)
          </text>
          <text x={width / 2} y={height - pad + 18} textAnchor="middle" className="text-[10px] fill-slate-400 font-medium">
            ▼ LOW AROUSAL (Depleted/Calm)
          </text>
          <text x={pad - 4} y={height / 2} textAnchor="end" dominantBaseline="middle" className="text-[9px] fill-slate-400">
            - Valence
          </text>
          <text x={width - pad + 6} y={height / 2} textAnchor="start" dominantBaseline="middle" className="text-[9px] fill-slate-400">
            + Valence
          </text>

          {/* Pulsating marker for the current text */}
          <circle
            cx={markerX}
            cy={markerY}
            r="16"
            fill={dominantColor}
            fillOpacity="0.25"
            className="animate-ping"
          />
          <circle
            cx={markerX}
            cy={markerY}
            r="7"
            fill={dominantColor}
            stroke="#ffffff"
            strokeWidth="2.5"
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
          />
        </svg>
      </div>

      {/* Numerical Coordinate Cards */}
      <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-3 border-t border-white/5 text-center">
        <div className="bg-white/5 rounded-lg p-1.5">
          <div className="text-[10px] text-slate-400">Valence</div>
          <div className={`text-xs font-mono font-bold ${coordinates.valence < 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
            {coordinates.valence > 0 ? `+${coordinates.valence}` : coordinates.valence}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-1.5">
          <div className="text-[10px] text-slate-400">Arousal</div>
          <div className="text-xs font-mono font-bold text-amber-400">
            {coordinates.arousal}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-1.5">
          <div className="text-[10px] text-slate-400">Dominance</div>
          <div className="text-xs font-mono font-bold text-purple-400">
            {coordinates.dominance}
          </div>
        </div>
      </div>
    </div>
  );
}
