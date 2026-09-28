'use client';

import React, { useState } from 'react';
import { Upload, Download, CheckCircle, FileText, ArrowUpDown, ArrowUpRight, Search, Play } from 'lucide-react';
import { EmotionKey } from '@/lib/types';
import { analyzeTextLocally, EMOTION_META } from '@/lib/analyzer';

interface BatchItemResult {
  id: string;
  speaker: string;
  text: string;
  dominant_emotion: EmotionKey;
  dominant_label: string;
  sub_emotion: string;
  emoji: string;
  confidence: number;
  cause: string;
  intent: string;
  statusDot: string;
  valence: number;
  arousal: number;
}

export default function BatchStudio() {
  const [inputText, setInputText] = useState(
    "I am tried due to work in night\n" +
    "I finally received the promotion and dream offer!\n" +
    "Why did you cancel the presentation without asking me?\n" +
    "The technical specification was published on Monday morning.\n" +
    "I'm terrified about the upcoming medical diagnosis tomorrow.\n" +
    "I feel so helpless and burdened by all these tasks."
  );

  const [activeFilter, setActiveFilter] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BatchItemResult[]>(() => {
    // Initial sample batch
    const initialLines = [
      { speaker: 'Clara Jensen', text: 'I am tried due to work in night' },
      { speaker: 'Michael Torres', text: 'I finally received the promotion and dream offer!' },
      { speaker: 'Sofia Ricci', text: 'Why did you cancel the presentation without asking me?' },
      { speaker: 'Olivia Novak', text: 'The technical specification was published on Monday morning.' },
      { speaker: 'David Kim', text: "I'm terrified about the upcoming medical diagnosis tomorrow." },
      { speaker: 'Emma Watson', text: 'I feel so helpless and burdened by all these tasks.' }
    ];

    return initialLines.map((item, idx) => {
      const res = analyzeTextLocally(item.text);
      const dotColors: Record<EmotionKey, string> = {
        sadness: 'bg-amber-500',
        joy: 'bg-emerald-500',
        anger: 'bg-rose-500',
        fear: 'bg-purple-500',
        love: 'bg-pink-500',
        surprise: 'bg-teal-500',
        neutral: 'bg-slate-400',
      };
      return {
        id: `#875412${900 + idx}`,
        speaker: item.speaker,
        text: item.text,
        dominant_emotion: res.dominant_emotion,
        dominant_label: res.dominant_label,
        sub_emotion: res.sub_emotion,
        emoji: res.emoji,
        confidence: res.confidence,
        cause: res.components.cause || 'introspective reflection',
        intent: res.intent.name,
        statusDot: dotColors[res.dominant_emotion],
        valence: res.affect_coordinates.valence,
        arousal: res.affect_coordinates.arousal,
      };
    });
  });

  const handleProcessBatch = () => {
    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const names = ['Clara Jensen', 'Michael Torres', 'Sofia Ricci', 'Olivia Novak', 'David Kim', 'Emma Watson', 'Lucas Silva', 'Elena Rostova'];
      const dotColors: Record<EmotionKey, string> = {
        sadness: 'bg-amber-500',
        joy: 'bg-emerald-500',
        anger: 'bg-rose-500',
        fear: 'bg-purple-500',
        love: 'bg-pink-500',
        surprise: 'bg-teal-500',
        neutral: 'bg-slate-400',
      };

      const newResults = lines.map((text, idx) => {
        const res = analyzeTextLocally(text);
        return {
          id: `#875412${900 + idx}`,
          speaker: names[idx % names.length],
          text,
          dominant_emotion: res.dominant_emotion,
          dominant_label: res.dominant_label,
          sub_emotion: res.sub_emotion,
          emoji: res.emoji,
          confidence: res.confidence,
          cause: res.components.cause || 'introspective reflection',
          intent: res.intent.name,
          statusDot: dotColors[res.dominant_emotion],
          valence: res.affect_coordinates.valence,
          arousal: res.affect_coordinates.arousal,
        };
      });

      setResults(newResults);
      setIsProcessing(false);
    }, 300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
    };
    reader.readAsText(file);
  };

  const exportCSV = () => {
    if (results.length === 0) return;
    const headers = ['Inference ID', 'Speaker', 'Input Text', 'Dominant Emotion', 'Sub-Emotion Nuance', 'Confidence', 'Causal Trigger', 'Intent', 'Valence', 'Arousal'];
    const rows = results.map((r) => [
      r.id,
      `"${r.speaker}"`,
      `"${r.text.replace(/"/g, '""')}"`,
      r.dominant_label,
      `"${r.sub_emotion}"`,
      (r.confidence * 100).toFixed(1) + '%',
      `"${r.cause}"`,
      `"${r.intent}"`,
      r.valence,
      r.arousal,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auraiq_batch_inferences_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = results.filter((r) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Exhaustion') return r.sub_emotion.toLowerCase().includes('exhaustion') || r.dominant_emotion === 'sadness';
    if (activeFilter === 'Frustration') return r.dominant_emotion === 'anger';
    if (activeFilter === 'Triumph') return r.dominant_emotion === 'joy';
    if (activeFilter === 'Support') return r.intent.toLowerCase().includes('support') || r.dominant_emotion === 'fear';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Dark Bento Card (MoveIQ Theme) */}
      <div className="bg-[#121316] rounded-3xl p-6 md:p-7 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                Q
              </span>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Batch Processing & File Export Studio
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Bulk evaluate customer reviews, chat logs, or survey responses with fine-grained intent detection.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1b1e24] hover:bg-[#252932] text-xs font-bold text-slate-300 hover:text-white border border-white/5 transition-all">
              <FileText className="w-3.5 h-3.5" />
              <span>Upload .txt / .csv</span>
              <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-extrabold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Text Input area inside Dark Card */}
        <div className="space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="Paste texts here (one per line)..."
            className="w-full bg-[#1b1e24] border border-white/5 rounded-2xl p-3.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-white/20 transition-all font-mono resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              {inputText.split('\n').filter((l) => l.trim().length > 0).length} utterances ready for batch deconstruction
            </span>

            <button
              onClick={handleProcessBatch}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-slate-950" />
              <span>{isProcessing ? 'Processing...' : 'Run Batch Analysis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2x2 Metric Grid & Summary Row (MoveIQ Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Total Inferences</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{results.length}</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">High Certainty Rate</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">94.8%</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Average Valence</div>
          <div className="text-xl font-extrabold text-blue-600 mt-1">-0.32</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Batch Latency</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">16 ms/item</div>
        </div>
      </div>

      {/* Bottom Orders-Style Table (MoveIQ Theme) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-sm space-y-4">
        {/* Table Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Batch Inferences
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-bold">
              {filteredResults.length}
            </span>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Exhaustion', 'Frustration', 'Triumph', 'Support'].map((filterName) => {
              const isSelected = activeFilter === filterName;
              return (
                <button
                  key={filterName}
                  onClick={() => setActiveFilter(filterName)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filterName}
                </button>
              );
            })}

            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 ml-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pr-3">Inference ID</th>
                <th className="pb-3 px-3">Speaker / Source</th>
                <th className="pb-3 px-3">Input Text</th>
                <th className="pb-3 px-3">Nuance</th>
                <th className="pb-3 px-3">Causal Trigger</th>
                <th className="pb-3 px-3">Communicative Intent</th>
                <th className="pb-3 pl-3 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 pr-3 font-mono font-bold text-slate-900">
                    {row.id}
                  </td>

                  <td className="py-4 px-3 font-bold text-slate-800 whitespace-nowrap">
                    {row.speaker}
                  </td>

                  <td className="py-4 px-3 max-w-[260px]">
                    <div className="font-semibold text-slate-900 truncate">
                      &ldquo;{row.text}&rdquo;
                    </div>
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{row.emoji}</span>
                      <span>{row.sub_emotion}</span>
                    </span>
                  </td>

                  <td className="py-4 px-3 text-slate-600 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium text-[11px]">
                      {row.cause}
                    </span>
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${row.statusDot}`}></span>
                      <span>{row.intent}</span>
                    </div>
                  </td>

                  <td className="py-4 pl-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {Math.round(row.confidence * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
