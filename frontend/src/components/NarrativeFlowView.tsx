'use client';

import React, { useState } from 'react';
import { NarrativeStep } from '@/lib/types';
import { Activity, ArrowRight, Play, Sparkles } from 'lucide-react';

interface NarrativeFlowViewProps {
  onAnalyzeSentence?: (text: string) => void;
}

export default function NarrativeFlowView({ onAnalyzeSentence }: NarrativeFlowViewProps) {
  const [narrativeText, setNarrativeText] = useState(
    "I was working all night to complete the high-priority deadline. By 4 AM, I was completely tried and drained due to work in night. But morning arrived, and our team demo was met with tremendous applause from the client! We celebrated our breakthrough together."
  );
  const [steps, setSteps] = useState<NarrativeStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runFlowAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: narrativeText }),
      });
      if (res.ok) {
        const data = await res.json();
        setSteps(data.flow || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Narrative Emotion & Intent Flow Tracker</h2>
          </div>
          <span className="text-xs text-slate-400">Multi-Sentence Dynamic Trajectory</span>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Deconstruct paragraphs, dialogue turns, or customer transcripts sentence-by-sentence to uncover emotional climaxes, mood shifts, and intentional pivots.
        </p>

        <textarea
          value={narrativeText}
          onChange={(e) => setNarrativeText(e.target.value)}
          rows={4}
          placeholder="Paste narrative text or multi-turn conversational transcript..."
          className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
        />

        <div className="flex justify-between items-center mt-3">
          <button
            type="button"
            onClick={() => setNarrativeText("I started the shift feeling overwhelmed by backlogged tickets. The server crashed and everyone was angry at us. But after staying calm and fixing the root cause, everything stabilized and relief washed over me.")}
            className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2"
          >
            Load Example Narrative
          </button>

          <button
            onClick={runFlowAnalysis}
            disabled={isLoading || !narrativeText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            {isLoading ? <span className="animate-spin">⏳</span> : <Play className="w-4 h-4 fill-white" />}
            Analyze Emotional Arc
          </button>
        </div>
      </div>

      {/* Trajectory Steps Timeline */}
      {steps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Sentence-by-Sentence Progression ({steps.length} Phases)
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative glass-card rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Timeline Node Dot */}
                <div
                  style={{ backgroundColor: step.color }}
                  className="absolute -left-[27px] top-4 w-4 h-4 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center text-[8px]"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      Phase {step.step}
                    </span>
                    <span className="text-base">{step.emoji}</span>
                    <span className="text-sm font-bold text-white">{step.sub_emotion}</span>
                    <span
                      style={{ color: step.color }}
                      className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5"
                    >
                      {step.dominant_label} ({Math.round(step.confidence * 100)}%)
                    </span>
                  </div>

                  <span className="text-xs font-medium text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    {step.intent}
                  </span>
                </div>

                <p className="text-sm text-slate-300 italic mb-3">
                  &ldquo;{step.sentence}&rdquo;
                </p>

                {/* Affect metrics bar */}
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span>Valence:</span>
                    <strong className={step.valence >= 0 ? 'text-emerald-400' : 'text-blue-400'}>
                      {step.valence > 0 ? `+${step.valence}` : step.valence}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Arousal:</span>
                    <strong className="text-amber-400">{step.arousal}</strong>
                  </div>
                  {onAnalyzeSentence && (
                    <button
                      onClick={() => onAnalyzeSentence(step.sentence)}
                      className="ml-auto text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      Deep Inspect <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
