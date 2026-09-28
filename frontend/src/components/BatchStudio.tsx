'use client';

import React, { useState } from 'react';
import { Upload, Download, CheckCircle, FileText } from 'lucide-react';
import { EmotionKey } from '@/lib/types';
import { EMOTION_META } from '@/lib/analyzer';

interface BatchItemResult {
  text: string;
  dominant_emotion: EmotionKey;
  dominant_label: string;
  sub_emotion: string;
  emoji: string;
  confidence: number;
  intent: string;
  intent_badge: string;
  valence: number;
  arousal: number;
}

export default function BatchStudio() {
  const [inputText, setInputText] = useState(
    "I am tried due to work in night\n" +
    "I finally got the job offer I prayed for!\n" +
    "Why did you cancel the presentation without asking me?\n" +
    "The weather report indicates rain tomorrow afternoon.\n" +
    "I'm terrified about the upcoming medical diagnosis."
  );
  const [results, setResults] = useState<BatchItemResult[]>([]);
  const [distribution, setDistribution] = useState<Record<EmotionKey, number> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessBatch = async () => {
    const lines = inputText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: lines }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setDistribution(data.emotion_distribution || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
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
    const headers = ['Text', 'Primary Emotion', 'Sub-Emotion Nuance', 'Confidence', 'Communicative Intent', 'Valence', 'Arousal'];
    const rows = results.map(r => [
      `"${r.text.replace(/"/g, '""')}"`,
      r.dominant_label,
      `"${r.sub_emotion}"`,
      (r.confidence * 100).toFixed(1) + '%',
      `"${r.intent}"`,
      r.valence,
      r.arousal
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_emotion_analysis_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-pink-400" /> Batch Processing & File Export Studio
            </h2>
            <p className="text-xs text-slate-400">
              Bulk evaluate customer reviews, chat logs, or survey responses with fine-grained intent detection.
            </p>
          </div>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Upload .txt / .csv
            <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="Enter one sentence per line..."
          className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-xs resize-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-slate-400">
            {inputText.split('\n').filter(l => l.trim().length > 0).length} lines ready for high-throughput batching
          </span>

          <div className="flex items-center gap-3">
            {results.length > 0 && (
              <button
                onClick={exportCSV}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Enriched CSV
              </button>
            )}

            <button
              onClick={handleProcessBatch}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              {isProcessing ? 'Processing Batch...' : 'Process All Lines'}
            </button>
          </div>
        </div>
      </div>

      {/* Distribution Summary */}
      {distribution && (
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Batch Distribution Breakdown ({results.length} total entries)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {(Object.keys(distribution) as EmotionKey[]).map((emo) => {
              const meta = EMOTION_META[emo];
              const count = distribution[emo];
              const pct = results.length > 0 ? Math.round((count / results.length) * 100) : 0;
              return (
                <div key={emo} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-xl mb-1">{meta.emoji}</div>
                  <div className="text-xs font-semibold text-slate-300">{meta.label}</div>
                  <div className="text-lg font-bold text-white mt-0.5">{count}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pr-4">Text Input</th>
                <th className="pb-3 px-3">Emotion</th>
                <th className="pb-3 px-3">Sub-Emotion Nuance</th>
                <th className="pb-3 px-3">Confidence</th>
                <th className="pb-3 px-3">Communicative Intent</th>
                <th className="pb-3 pl-3 text-right">Valence / Arousal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-medium text-white max-w-[260px] truncate" title={r.text}>
                    {r.text}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-semibold">
                      <span>{r.emoji}</span>
                      <span>{r.dominant_label}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-purple-300 whitespace-nowrap">
                    {r.sub_emotion}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {Math.round(r.confidence * 100)}%
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {r.intent}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-mono whitespace-nowrap">
                    <span className={r.valence >= 0 ? 'text-emerald-400' : 'text-blue-400'}>
                      {r.valence > 0 ? `+${r.valence}` : r.valence}
                    </span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-amber-400">{r.arousal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
