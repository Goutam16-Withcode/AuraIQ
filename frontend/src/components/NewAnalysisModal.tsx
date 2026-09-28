'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const PRESETS = [
  'I am tried due to work in night',
  'I finally received the promotion and dream offer!',
  'Why did you cancel the presentation without asking me?',
  'I feel so helpless and burdened by all these pending tasks.',
  'The technical specification was published on Monday morning.',
];

export default function NewAnalysisModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: NewAnalysisModalProps) {
  const [text, setText] = useState('I am tried due to work in night');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center text-xs font-bold">
              Q
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              New Cognitive Affect Inference
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Enter an utterance to decompose causal triggers, affective nuances, and communicative intent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="e.g. 'I am tried due to work in night'..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none font-sans"
            />
          </div>

          {/* Quick presets */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" /> Select Verified Preset:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setText(p)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Run Deep Deconstruction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
