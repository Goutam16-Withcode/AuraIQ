'use client';

import React from 'react';
import { EmotionAnalysisResult, EmotionKey } from '@/lib/types';
import { Search, Upload, Plus, Calendar, ArrowUpRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface MoveIQDarkBentoCardProps {
  result: EmotionAnalysisResult | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewAnalysis: () => void;
  onExport: () => void;
}

export default function MoveIQDarkBentoCard({
  result,
  searchQuery,
  setSearchQuery,
  onNewAnalysis,
  onExport,
}: MoveIQDarkBentoCardProps) {
  const scores = result?.scores || {
    joy: 0.10,
    love: 0.05,
    sadness: 0.42,
    anger: 0.12,
    fear: 0.15,
    surprise: 0.04,
    neutral: 0.12,
  };

  const dominantLabel = result?.dominant_label || 'Sadness';
  const confidence = result ? Math.round(result.confidence * 100) : 94;

  // Granular vertical bars mimicking the reference image
  const barHeights = [
    30, 45, 60, 50, 40, 55, 70, 65, 80, 75, 85, 90, 82, 70, 60, 78, 87, 82, 75, 68, 55, 62, 58, 48, 52, 60, 55, 45, 40, 35, 45, 50, 42
  ];

  return (
    <div className="bg-[#121316] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col gap-6">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search utterance, sentiment, or intent..."
            className="w-full bg-[#1b1e24] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-white/20 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b1e24] hover:bg-[#252932] text-xs font-semibold text-slate-300 hover:text-white border border-white/5 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add new analysis</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Timeline Bars + Right Gauge & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Left Side: Fulfillment Performance Bars (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">
              Affect Saliency Performance
            </h3>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-1 rounded-lg hover:bg-white/5 transition-colors">
                <Calendar className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg hover:bg-white/5 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month / Granular labels */}
          <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span className="text-white font-bold">May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
          </div>

          {/* Vertical Bar Chart with 87% Marker */}
          <div className="relative h-28 flex items-end justify-between gap-1 pt-6 px-1">
            {barHeights.map((h, i) => {
              const isPeak = i === 16; // 87% peak bar
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end relative">
                  {isPeak && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-white text-black font-extrabold text-[10px] shadow-md z-10 whitespace-nowrap">
                      87%
                    </div>
                  )}
                  <div
                    style={{ height: `${h}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isPeak
                        ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                        : 'bg-slate-700/60 hover:bg-slate-500'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Semicircular Arc Gauge & Overview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Affect State Overview
            </h3>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-1 rounded hover:bg-white/5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded hover:bg-white/5">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Big Headline */}
          <div className="flex items-baseline gap-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {dominantLabel.toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              {confidence}% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Semicircular Gauge and Legend */}
          <div className="flex items-center gap-4 pt-1">
            {/* Semicircular SVG Gauge matching reference image */}
            <div className="relative w-40 h-24 shrink-0 flex items-end justify-center overflow-hidden">
              <svg viewBox="0 0 160 90" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 15 85 A 65 65 0 0 1 145 85"
                  fill="none"
                  stroke="#262930"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Segment 1: Main Green/Lime (Joy / Dominant) */}
                <path
                  d="M 15 85 A 65 65 0 0 1 70 24"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Segment 2: Slate/Blue (Sadness/Exhaustion) */}
                <path
                  d="M 72 23 A 65 65 0 0 1 125 45"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="12"
                />
                {/* Segment 3: Lavender/Purple (Fear/Anxiety) */}
                <path
                  d="M 127 47 A 65 65 0 0 1 145 85"
                  fill="none"
                  stroke="#C084FC"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Legend list matching MoveIQ Swedish/Finland list */}
            <div className="space-y-1.5 text-[11px] font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                <span className="text-slate-200">Exhaustion</span>
                <span className="text-slate-400 font-mono text-[10px]">38%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400"></span>
                <span className="text-slate-200">Sadness</span>
                <span className="text-slate-400 font-mono text-[10px]">27%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-400"></span>
                <span className="text-slate-200">Weariness</span>
                <span className="text-slate-400 font-mono text-[10px]">22%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                <span className="text-slate-200">Neutral</span>
                <span className="text-slate-400 font-mono text-[10px]">13%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
