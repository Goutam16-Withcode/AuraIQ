'use client';

import React from 'react';
import { Bell, LayoutDashboard, Layers, Compass, Activity, Cpu } from 'lucide-react';

interface MoveIQHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MoveIQHeader({ activeTab, setActiveTab }: MoveIQHeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batch', label: '', icon: Layers, title: 'Batch Processing' },
    { id: 'circumplex', label: '', icon: Compass, title: 'Affect Circumplex' },
    { id: 'narrative', label: '', icon: Activity, title: 'Narrative Flow' },
    { id: 'lab', label: '', icon: Cpu, title: 'Architecture Lab' },
  ];

  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            Q
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            AuraIQ
          </span>
        </div>

        {/* Center: Segmented Floating Black Pill Menu */}
        <div className="flex items-center bg-black text-white p-1 rounded-2xl shadow-md border border-black/10">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            title="Batch Processing Studio"
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'batch'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('circumplex')}
            title="Affect Circumplex 2D Model"
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'circumplex'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('narrative')}
            title="Narrative Emotion Flow"
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'narrative'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            title="ML Comparison Lab"
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'lab'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Notification & Profile Avatar */}
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-sm">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <span className="text-sm">👨‍💻</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">Kent Torres</div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">Lead AI Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
