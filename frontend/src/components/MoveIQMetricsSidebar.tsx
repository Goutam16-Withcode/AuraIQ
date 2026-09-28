'use client';

import React from 'react';
import { EmotionAnalysisResult } from '@/lib/types';
import { ChevronRight, Zap, AlertTriangle, Sparkles, BrainCircuit } from 'lucide-react';

interface MoveIQMetricsSidebarProps {
  result: EmotionAnalysisResult | null;
  onOpenInspector: () => void;
}

export default function MoveIQMetricsSidebar({ result, onOpenInspector }: MoveIQMetricsSidebarProps) {
  const confidence = result ? Math.round(result.confidence * 100) : 94;
  const valence = result ? result.affect_coordinates.valence : -0.45;
  const arousal = result ? result.affect_coordinates.arousal : 0.15;
  const cause = result?.components.cause || 'work in night';
  const temporal = result?.components.temporal_context || 'nocturnal shift';
  const dominantEmotion = result?.dominant_label || 'Sadness';
  const subEmotion = result?.sub_emotion || 'Exhaustion & Depletion';

  return (
    <aside className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
      {/* Top Card: Affect Performance Overview */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Affect performance overview
          </h2>
        </div>

        {/* 2x2 Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Confidence</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">{confidence}%</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Arousal Level</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">{arousal} <span className="text-[10px] text-slate-500 font-normal">low</span></div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Valence Ratio</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">
              {valence > 0 ? `+${valence}` : valence}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Latency Speed</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">18 ms</div>
          </div>
        </div>

        {/* Featured State Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <span>{result?.emoji || '😢'}</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {dominantEmotion}
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight truncate max-w-[130px]">
                {subEmotion}
              </div>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-lime-100 text-lime-900 text-[11px] font-bold flex items-center gap-1 border border-lime-200">
            ★ 9.7
          </span>
        </div>

        {/* Interactive Triggers rows */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={onOpenInspector}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  Causal Trigger
                </div>
                <div className="text-[11px] text-slate-500 font-medium capitalize">
                  {cause}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>

          <button
            onClick={onOpenInspector}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  Circadian Stressor
                </div>
                <div className="text-[11px] text-slate-500 font-medium capitalize">
                  {temporal}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>
        </div>
      </div>

      {/* Bottom Accent Card (Olive / Chartreuse Tinted Card) */}
      <div className="bg-[#dcecb7] rounded-3xl p-5 border border-[#cadca0] flex flex-col justify-between text-[#213009] shadow-sm relative overflow-hidden min-h-[260px]">
        {/* Decorative Neural Wave Graphic */}
        <div className="w-full h-28 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center relative overflow-hidden p-3 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-t from-[#dcecb7]/30 to-transparent"></div>
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#213009] shadow-md flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-[#354f0e]" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#354f0e] tracking-wider uppercase">
              <Sparkles className="w-3 h-3" /> Live Context Neural Saliency
            </div>
          </div>
        </div>

        {/* Content & CTA */}
        <div className="mt-4 space-y-1">
          <h3 className="text-base font-extrabold tracking-tight text-[#1e2d07]">
            Cognitive Deconstruction
          </h3>
          <p className="text-xs text-[#394f15] font-medium leading-relaxed">
            Deconstruct causal triggers and psychological strain without static templates.
          </p>
        </div>

        <button
          onClick={onOpenInspector}
          className="mt-4 w-full py-2.5 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Inspect Utterance</span>
          <span className="text-sm">◎</span>
        </button>
      </div>
    </aside>
  );
}
