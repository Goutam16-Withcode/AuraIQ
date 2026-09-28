'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MoveIQHeader from '@/components/MoveIQHeader';
import MoveIQMetricsSidebar from '@/components/MoveIQMetricsSidebar';
import MoveIQDarkBentoCard from '@/components/MoveIQDarkBentoCard';
import MoveIQTableSection from '@/components/MoveIQTableSection';
import ActionKeyModeBar from '@/components/ActionKeyModeBar';
import NewAnalysisModal from '@/components/NewAnalysisModal';
import AffectCircumplex from '@/components/AffectCircumplex';
import EmotionRadar from '@/components/EmotionRadar';
import CognitiveExplanationCard from '@/components/CognitiveExplanationCard';
import SaliencyHighlighter from '@/components/SaliencyHighlighter';
import NarrativeFlowView from '@/components/NarrativeFlowView';
import BatchStudio from '@/components/BatchStudio';
import ArchitectureLab from '@/components/ArchitectureLab';
import { EmotionAnalysisResult } from '@/lib/types';
import { analyzeTextLocally } from '@/lib/analyzer';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentText, setCurrentText] = useState('I am tried due to work in night');
  const [analysisResult, setAnalysisResult] = useState<EmotionAnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = useCallback(async (textToAnalyze: string) => {
    const text = textToAnalyze.trim();
    if (!text) return;
    setIsLoading(true);
    setCurrentText(text);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      } else {
        setAnalysisResult(analyzeTextLocally(text));
      }
    } catch {
      setAnalysisResult(analyzeTextLocally(text));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load with the user's specific test case
  useEffect(() => {
    runAnalysis('I am tried due to work in night');
  }, [runAnalysis]);

  const handleExport = () => {
    if (!analysisResult) return;
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', jsonStr);
    dl.setAttribute('download', `affect_analysis_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
  };

  return (
    <div className="min-h-screen bg-[#eff2f6] text-slate-900 flex flex-col font-sans pb-16 antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Header */}
      <MoveIQHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Canvas Body */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Sidebar Overview */}
            <MoveIQMetricsSidebar
              result={analysisResult}
              onOpenInspector={() => setIsModalOpen(true)}
            />

            {/* Right Main Bento Flow */}
            <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
              {/* Top Dark Bento Card (Timeline Bars & Semicircular Arc Gauge) */}
              <MoveIQDarkBentoCard
                result={analysisResult}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNewAnalysis={() => setIsModalOpen(true)}
                onExport={handleExport}
              />

              {/* Bottom White Table Section */}
              <MoveIQTableSection
                onSelectUtterance={(txt) => runAnalysis(txt)}
                activeResult={analysisResult}
              />
            </div>
          </div>
        )}

        {/* Circumplex & Radar Deep Lab Tab */}
        {activeTab === 'circumplex' && analysisResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Russell 2D Circumplex & 7-Axis Radar Visualization
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Active Analysis: &ldquo;<strong className="text-slate-800">{currentText}</strong>&rdquo;
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-900 transition-all self-start sm:self-auto shadow-sm"
              >
                Change Utterance
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AffectCircumplex
                coordinates={analysisResult.affect_coordinates}
                subEmotion={analysisResult.sub_emotion}
                dominantColor={analysisResult.color}
              />

              <EmotionRadar
                scores={analysisResult.scores}
                dominantEmotion={analysisResult.dominant_emotion}
              />
            </div>

            <CognitiveExplanationCard result={analysisResult} />
            <SaliencyHighlighter
              saliency={analysisResult.saliency}
              dominantColor={analysisResult.color}
            />
          </div>
        )}

        {/* Narrative Flow Tab */}
        {activeTab === 'narrative' && (
          <NarrativeFlowView
            onAnalyzeSentence={(sent) => {
              runAnalysis(sent);
              setActiveTab('dashboard');
            }}
          />
        )}

        {/* Batch Processing Studio Tab */}
        {activeTab === 'batch' && <BatchStudio />}

        {/* ML Comparison Lab Tab */}
        {activeTab === 'lab' && <ArchitectureLab />}
      </main>

      {/* Floating Bottom Action Key Mode Bar */}
      <ActionKeyModeBar currentUtterance={currentText} />

      {/* New Analysis Modal */}
      <NewAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(txt) => runAnalysis(txt)}
        isLoading={isLoading}
      />
    </div>
  );
}
