'use client';

import React, { useState } from 'react';
import { ArrowUpDown, ChevronRight, MoreHorizontal, Sparkles, AlertCircle, Compass, Target } from 'lucide-react';
import { EmotionAnalysisResult } from '@/lib/types';

interface MoveIQTableSectionProps {
  onSelectUtterance: (text: string) => void;
  activeResult: EmotionAnalysisResult | null;
}

interface TableRowData {
  id: string;
  speaker: string;
  text: string;
  subEmotion: string;
  cause: string;
  intent: string;
  statusDot: string;
  statusText: string;
}

const SAMPLE_ROWS: TableRowData[] = [
  {
    id: '#875412903',
    speaker: 'Clara Jensen',
    text: 'I am tried due to work in night',
    subEmotion: 'Exhaustion & Depletion',
    cause: 'work in night',
    intent: 'Sharing Exhaustion & Venting Strain',
    statusDot: 'bg-amber-500',
    statusText: 'Venting Strain',
  },
  {
    id: '#458729654',
    speaker: 'Michael Torres',
    text: 'I finally received the promotion and dream offer!',
    subEmotion: 'Triumph & Euphoric Relief',
    cause: 'promotion & effort',
    intent: 'Celebrating Personal Triumph',
    statusDot: 'bg-emerald-500',
    statusText: 'Celebration',
  },
  {
    id: '#913562478',
    speaker: 'Sofia Ricci',
    text: 'Why did you cancel the client presentation without asking?',
    subEmotion: 'Friction & Impatience',
    cause: 'unilateral cancellation',
    intent: 'Venting Frustration against Obstacles',
    statusDot: 'bg-rose-500',
    statusText: 'Boundary Defense',
  },
  {
    id: '#324561327',
    speaker: 'Olivia Novak',
    text: 'I feel so helpless and burdened by all these pending tasks.',
    subEmotion: 'Social Disconnection & Despair',
    cause: 'task backlog overload',
    intent: 'Reaching Out for Social Empathy',
    statusDot: 'bg-blue-500',
    statusText: 'Support Seeking',
  },
];

export default function MoveIQTableSection({
  onSelectUtterance,
  activeResult,
}: MoveIQTableSectionProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>('#875412903');

  const filters = [
    { label: 'All', count: 264 },
    { label: 'Exhaustion', count: 70 },
    { label: 'Frustration', count: 85 },
    { label: 'Triumph', count: 53 },
    { label: 'Support', count: 56 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Table Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Recent Inferences
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-bold">
            264
          </span>
        </div>

        {/* Filter Pills matching MoveIQ segmented buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map((f) => {
            const isSelected = activeFilter === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {f.label} {f.count}
              </button>
            );
          })}

          <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors ml-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3.5 pr-4">Utterance ID</th>
              <th className="pb-3.5 px-3">Speaker</th>
              <th className="pb-3.5 px-3">Input Text & Causal Connector</th>
              <th className="pb-3.5 px-3">Nuance</th>
              <th className="pb-3.5 px-3">Causal Trigger</th>
              <th className="pb-3.5 px-3">Intent Status</th>
              <th className="pb-3.5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SAMPLE_ROWS.map((row) => {
              const isExpanded = expandedId === row.id;

              return (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => {
                      setExpandedId(isExpanded ? null : row.id);
                      onSelectUtterance(row.text);
                    }}
                    className={`cursor-pointer hover:bg-slate-50/80 transition-colors ${
                      isExpanded ? 'bg-slate-50/60' : ''
                    }`}
                  >
                    <td className="py-4 pr-4 font-mono font-bold text-slate-900">
                      {row.id}
                    </td>

                    <td className="py-4 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {row.speaker}
                    </td>

                    <td className="py-4 px-3 max-w-[260px]">
                      <div className="font-medium text-slate-900 truncate">
                        &ldquo;{row.text}&rdquo;
                      </div>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {row.subEmotion}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-slate-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-medium text-[11px]">
                        {row.cause}
                      </span>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className={`w-2 h-2 rounded-full ${row.statusDot}`}></span>
                        <span>{row.statusText}</span>
                      </div>
                    </td>

                    <td className="py-4 pl-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setExpandedId(isExpanded ? null : row.id);
                            onSelectUtterance(row.text);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-black transition-all shadow-sm"
                        >
                          {isExpanded ? 'Hide' : 'See more'}
                        </button>
                        <button className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded In-Depth Cognitive Breakdown Drawer */}
                  {isExpanded && activeResult && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div className="p-6 bg-slate-900 text-white rounded-2xl my-2 mx-1 shadow-inner space-y-5 animate-in fade-in duration-300">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{activeResult.emoji}</span>
                              <div>
                                <h4 className="text-base font-bold text-white">
                                  {activeResult.sub_emotion} ({activeResult.dominant_label})
                                </h4>
                                <div className="text-xs text-slate-400 font-medium">
                                  Theme: {activeResult.explanation.theme}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                                {activeResult.intent.badge}
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-white/10 font-mono text-xs font-bold text-slate-200">
                                Valence: {activeResult.affect_coordinates.valence} • Arousal: {activeResult.affect_coordinates.arousal}
                              </span>
                            </div>
                          </div>

                          {/* Causal antecedents & stressor */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/10">
                              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" /> Root Causal Antecedent
                              </div>
                              <div className="text-sm font-bold text-slate-100 mt-1">
                                &ldquo;{activeResult.components.cause || 'Unspecified'}&rdquo;
                              </div>
                            </div>

                            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/10">
                              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Compass className="w-3.5 h-3.5" /> Chrono / Environmental Trigger
                              </div>
                              <div className="text-sm font-bold text-slate-100 mt-1">
                                &ldquo;{activeResult.components.temporal_context || 'Standard timeline'}&rdquo;
                              </div>
                            </div>

                            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/10">
                              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" /> Pragmatic Intent
                              </div>
                              <div className="text-sm font-bold text-slate-100 mt-1">
                                {activeResult.intent.name}
                              </div>
                            </div>
                          </div>

                          {/* In-depth Dynamic Narrative */}
                          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 space-y-2">
                            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Dynamic Linguistic & Psychological Reasoning
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                              {activeResult.explanation.reasoning}
                            </div>
                          </div>

                          {/* Word Saliency Tokens */}
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Token Saliency & Attention Attribution Weights:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {activeResult.saliency.map((token, tIdx) => (
                                <span
                                  key={tIdx}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                    token.is_key_driver
                                      ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                                      : 'bg-white/5 border-white/10 text-slate-300'
                                  }`}
                                >
                                  {token.word}
                                  {token.is_key_driver && (
                                    <span className="ml-1.5 text-[10px] font-mono text-purple-300">
                                      {Math.round(token.weight * 100)}%
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
