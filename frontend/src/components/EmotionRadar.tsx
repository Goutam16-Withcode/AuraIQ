'use client';

import React from 'react';
import { EmotionKey, EmotionAnalysisResult } from '@/lib/types';
import { EMOTION_META } from '@/lib/analyzer';

interface EmotionRadarProps {
  scores: Record<EmotionKey, number>;
  dominantEmotion: EmotionKey;
}

export default function EmotionRadar({ scores, dominantEmotion }: EmotionRadarProps) {
  const emotions: EmotionKey[] = ['joy', 'love', 'surprise', 'neutral', 'sadness', 'fear', 'anger'];
  const size = 300;
  const center = size / 2;
  const radius = 105;
  const totalAxes = emotions.length;

  // Compute coordinate points for polygon
  const points = emotions.map((emo, index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const score = Math.max(0.08, scores[emo] || 0.05);
    const r = radius * Math.min(1, score * 1.25);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, emo, score, angle };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Radial levels (rings)
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>🕸️</span> Emotion Spectrum Radar
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">7-Axis Density</span>
      </div>

      <div className="relative w-[300px] h-[300px]">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#EC4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Web Rings */}
          {rings.map((factor, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={radius * factor}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeDasharray={idx < 3 ? '3,3' : 'none'}
              strokeWidth="1"
            />
          ))}

          {/* Radial Spokes */}
          {emotions.map((_, index) => {
            const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Radar Polygon Shape */}
          <polygon
            points={polygonPath}
            fill="url(#radarGradient)"
            stroke="#C084FC"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(192,132,252,0.4)]"
          />

          {/* Vertex Circles and Labels */}
          {points.map((p, idx) => {
            const meta = EMOTION_META[p.emo];
            const isDominant = p.emo === dominantEmotion;
            const labelDist = radius + 24;
            const lx = center + labelDist * Math.cos(p.angle);
            const ly = center + labelDist * Math.sin(p.angle);

            return (
              <g key={idx}>
                {/* Vertex Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isDominant ? 6 : 4}
                  fill={meta.color}
                  stroke="#ffffff"
                  strokeWidth={isDominant ? 2 : 1}
                  className="transition-all duration-500"
                />

                {/* Label text & score */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[11px] font-semibold transition-all duration-300 ${
                    isDominant ? 'fill-white font-bold' : 'fill-slate-400'
                  }`}
                >
                  {meta.emoji} {meta.label}
                </text>
                <text
                  x={lx}
                  y={ly + 13}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {Math.round((scores[p.emo] || 0) * 100)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend summary pills */}
      <div className="w-full flex flex-wrap gap-1.5 justify-center mt-3 pt-3 border-t border-white/5">
        {emotions.map((emo) => {
          const meta = EMOTION_META[emo];
          const isDom = emo === dominantEmotion;
          const pct = Math.round((scores[emo] || 0) * 100);
          return (
            <div
              key={emo}
              className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                isDom
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                  : 'text-slate-400 bg-white/5'
              }`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}:</span>
              <span className="font-mono text-slate-200">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
