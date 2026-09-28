'use client';

import React from 'react';
import { EmotionAnalysisResult } from '@/lib/types';
import { Lightbulb, Compass, AlertCircle, Target, Sparkles, BookOpen } from 'lucide-react';

interface CognitiveExplanationCardProps {
  result: EmotionAnalysisResult;
}

export default function CognitiveExplanationCard({ result }: CognitiveExplanationCardProps) {
  const { explanation, intent, components, dominant_label, sub_emotion, emoji, color } = result;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Title & Core Sub-Emotion Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{emoji}</span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {sub_emotion}
            </h2>
            <span
              style={{ backgroundColor: `${color}25`, borderColor: color, color }}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
            >
              {dominant_label} Domain
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Theme: <span className="text-slate-200">{explanation.theme}</span>
          </p>
        </div>

        {/* Pragmatic Intent Badge */}
        <div className="flex items-center gap-3 bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
              Communicative Intent
            </div>
            <div className="text-sm font-bold text-white">
              {intent.name}
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              {intent.badge} • {(intent.confidence * 100).toFixed(0)}% Certainty
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Causal Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Causal Antecedent / Trigger
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {components.cause ? (
              <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                &ldquo;{components.cause}&rdquo;
              </span>
            ) : (
              <span className="text-slate-500 italic">None explicitly stated</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {components.cause ? 'Externalized situational root cause' : 'Introspective sentiment reflection'}
          </div>
        </div>

        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" /> Temporal & Environmental
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {components.temporal_context ? (
              <span className="text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                &ldquo;{components.temporal_context}&rdquo;
              </span>
            ) : (
              <span className="text-slate-500 italic">Present / Unspecified</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {components.temporal_context ? 'Chronobiological or timing modifier' : 'Ongoing cognitive state'}
          </div>
        </div>

        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-purple-400" /> Subject Perspective
          </div>
          <div className="text-sm font-semibold text-purple-200">
            {components.subject}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Direct introspective self-evaluation
          </div>
        </div>
      </div>

      {/* Dynamic Deep Reasoning Narrative */}
      <div className="bg-slate-950/60 rounded-xl p-4 md:p-5 border border-white/5 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-pink-400" />
          Dynamic In-Depth Cognitive Reasoning
        </h4>
        <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-line space-y-3 font-normal">
          {explanation.reasoning.split('\n\n').map((paragraph, pIdx) => {
            // Check if bold prefix exists
            const boldMatch = paragraph.match(/^\*\*(.+?):\*\*\s*(.*)$/s);
            if (boldMatch) {
              return (
                <div key={pIdx} className="bg-white/[0.02] p-3 rounded-lg border border-white/5">
                  <strong className="text-purple-300 font-semibold">{boldMatch[1]}: </strong>
                  <span className="text-slate-300">{boldMatch[2]}</span>
                </div>
              );
            }
            return (
              <p key={pIdx} className="text-slate-300">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Cognitive Appraisal Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Hedonic Valence</div>
          <div className="text-sm font-bold text-white mt-0.5">
            {explanation.cognitive_appraisal.pleasantness}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Activation Energy</div>
          <div className="text-sm font-bold text-amber-300 mt-0.5">
            {explanation.cognitive_appraisal.activation_energy}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Locus of Attribution</div>
          <div className="text-sm font-bold text-indigo-300 mt-0.5">
            {explanation.cognitive_appraisal.attribution_source}
          </div>
        </div>
      </div>
    </div>
  );
}
