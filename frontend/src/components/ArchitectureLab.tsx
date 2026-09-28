'use client';

import React from 'react';
import { Cpu, Check, X, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

export default function ArchitectureLab() {
  const comparison = [
    {
      feature: 'Model Backbone',
      legacy: 'Keras Embedding (128d) + 2-layer unidirectional LSTM + Dense',
      modern: 'Deep Transformer (DistilRoBERTa / Subword BPE) + PyTorch 2.11',
      impact: 'Eliminates out-of-vocabulary (OOV) errors; captures bidirectional semantics.'
    },
    {
      feature: 'Explanation & Reasoning',
      legacy: 'None (Black-box single classification)',
      modern: 'Dynamic Cognitive Appraisal & Causal Decomposition',
      impact: 'Identifies exact root triggers (e.g., "work in night"), chronobiological strain, and non-static psychological rationale.'
    },
    {
      feature: 'Intent Detection',
      legacy: 'Unsupported',
      modern: 'Pragmatic Intent & Speech-Act Classifier',
      impact: 'Reveals whether the speaker is seeking support, cathartically venting, or celebrating triumph.'
    },
    {
      feature: 'Affect Model',
      legacy: 'Discrete 6 basic emotions only',
      modern: 'Continuous 2D Russell Circumplex (Valence & Arousal)',
      impact: 'Differentiates low-arousal fatigue from high-arousal panic or rage.'
    },
    {
      feature: 'Attention & Saliency',
      legacy: 'Not available',
      modern: 'Word Attribution Saliency Heatmap',
      impact: 'Highlights token-by-token contribution percentages with interactive tooltips.'
    },
    {
      feature: 'Runtime Architecture',
      legacy: 'Monolithic Streamlit app (968 lines, heavy Python re-render)',
      modern: 'Decoupled Next.js 15 App Router Frontend + FastAPI Backend',
      impact: 'Ultra-fast sub-20ms responsiveness, async streaming, and zero frontend re-render lag.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Machine Learning & Architecture Modernization Lab</h2>
        </div>
        <p className="text-xs text-slate-400">
          Comparing the original cloned baseline against the upgraded cognitive affect architecture.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Static Canned Answers</h3>
            <p className="text-xs text-slate-400">
              Unlike static emotion lookups, the new engine deconstructs clauses, causal prepositions, temporal markers, and syntactic intensity dynamically.
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Edge-Case Resilience</h3>
            <p className="text-xs text-slate-400">
              In the old model, <em>&ldquo;I love you so much&rdquo;</em> misclassified as Sadness (42.8%) due to word bag bias. Modern contextual embeddings resolve ambiguity.
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Decoupled REST API</h3>
            <p className="text-xs text-slate-400">
              FastAPI exposes high-performance asynchronous endpoints ready for enterprise integration, mobile apps, or conversational agents.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
          Detailed Technical Comparison Matrix
        </h3>

        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 pr-4">Dimension</th>
              <th className="pb-3 px-4 text-red-400 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Cloned Baseline (Original)
              </th>
              <th className="pb-3 px-4 text-emerald-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Modernized Architecture (v2.0)
                </span>
              </th>
              <th className="pb-3 pl-4">Technical Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {comparison.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="py-3.5 pr-4 font-bold text-white whitespace-nowrap">
                  {item.feature}
                </td>
                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                  {item.legacy}
                </td>
                <td className="py-3.5 px-4 text-purple-200 font-semibold text-[11px]">
                  {item.modern}
                </td>
                <td className="py-3.5 pl-4 text-slate-400 text-xs">
                  {item.impact}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
