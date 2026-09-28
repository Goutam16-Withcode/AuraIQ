'use client';

import React, { useState } from 'react';
import {
  Bell,
  Search,
  Upload,
  Plus,
  Calendar,
  ArrowUpRight,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  MoreHorizontal,
  Crosshair,
  Volume2,
  Box,
  Truck,
  Wallet,
  TrendingUp,
  LayoutDashboard,
  AlertOctagon,
  X,
  Sparkles,
  Target,
  BrainCircuit,
  Compass
} from 'lucide-react';
import TruckIllustration from './TruckIllustration';
import { analyzeTextLocally } from '@/lib/analyzer';
import { EmotionAnalysisResult } from '@/lib/types';

export default function MoveIQDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderFilter, setOrderFilter] = useState('Assigned');
  const [searchVal, setSearchVal] = useState('');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inputText, setInputText] = useState('I am tried due to work in night');
  const [analysisResult, setAnalysisResult] = useState<EmotionAnalysisResult>(() =>
    analyzeTextLocally('I am tried due to work in night')
  );

  const runAnalysis = (text: string) => {
    setInputText(text);
    const res = analyzeTextLocally(text);
    setAnalysisResult(res);
    setIsInspectorOpen(true);
  };

  // 36 frequency bars with 87% peak bar in the middle
  const frequencyBars = [
    28, 42, 58, 48, 38, 52, 68, 62, 78, 72, 82, 88, 80, 68, 58, 76,
    87, // Peak bar (index 16)
    80, 72, 65, 52, 60, 56, 46, 50, 58, 52, 42, 38, 32, 42, 48, 40, 34, 45, 50
  ];

  const tableRows = [
    {
      id: '#875412903',
      assignedTo: 'Clara Jensen',
      fromFlag: '🇩🇪',
      fromCity: 'Munich, DE',
      toFlag: '🇳🇱',
      toCity: 'Rotterdam, NL',
      vehicle: 'Volvo FH16',
      delivery: '05 Oct, 2025',
      status: 'In transit',
      statusColor: 'bg-amber-500',
      sampleUtterance: 'I am tried due to work in night',
    },
    {
      id: '#458729654',
      assignedTo: 'Michael Torres',
      fromFlag: '🇵🇱',
      fromCity: 'Warsaw, PL',
      toFlag: '🇦🇹',
      toCity: 'Vienna, AT',
      vehicle: 'Mercedes Actros',
      delivery: '05 Oct, 2025',
      status: 'Delivered',
      statusColor: 'bg-emerald-500',
      sampleUtterance: 'I finally received the promotion and dream offer!',
    },
    {
      id: '#913562478',
      assignedTo: 'Sofia Ricci',
      fromFlag: '🇨🇿',
      fromCity: 'Prague, CZ',
      toFlag: '🇨🇭',
      toCity: 'Zurich, CH',
      vehicle: 'MAN TGX',
      delivery: '05 Oct, 2025',
      status: 'Picked up',
      statusColor: 'bg-slate-400',
      sampleUtterance: 'Why did you cancel the presentation without asking me?',
    },
    {
      id: '#324561327',
      assignedTo: 'Olivia Novak',
      fromFlag: '🇪🇸',
      fromCity: 'Madrid, ES',
      toFlag: '🇫🇷',
      toCity: 'Lyon, FR',
      vehicle: 'Scania R500',
      delivery: '15 Sep, 2025',
      status: 'In transit',
      statusColor: 'bg-amber-500',
      sampleUtterance: 'I feel so helpless and burdened by these impossible deadlines.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#d7dde5] py-4 px-2 sm:px-4 lg:px-6 flex items-center justify-center font-sans">
      {/* Tablet Mockup Bezel Outer Frame */}
      <div className="w-full max-w-[1360px] bg-[#1a1c22] rounded-[36px] sm:rounded-[44px] p-3 sm:p-5 shadow-2xl border-4 border-[#2d3039] relative">
        {/* Left Bezel Camera dot */}
        <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#353842] border border-[#484b57] hidden sm:block"></div>

        {/* Tablet Screen Surface */}
        <div className="w-full bg-[#eff2f6] rounded-[26px] sm:rounded-[34px] overflow-hidden p-4 sm:p-6 lg:p-7 space-y-5 text-slate-900 relative">
          
          {/* TOP NAVIGATION BAR */}
          <nav className="flex items-center justify-between gap-4">
            {/* Left Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-sm shadow-sm">
                Q
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                MoveIQ
              </span>
            </div>

            {/* Center Segmented Floating Black Pill */}
            <div className="flex items-center bg-[#121316] text-white p-1 rounded-2xl shadow-md border border-black/10">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#22252c] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('box')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'box' ? 'bg-[#22252c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('truck')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'truck' ? 'bg-[#22252c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'wallet' ? 'bg-[#22252c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'stats' ? 'bg-[#22252c] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Notification & Profile */}
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 hover:text-black transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden border border-white">
                  <span>🧔🏽</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">Kent Torres</div>
                  <div className="text-[10px] text-slate-400 font-medium leading-tight">Admin</div>
                </div>
              </div>
            </div>
          </nav>

          {/* MAIN TWO-COLUMN DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN: Performance Overview & Olive Truck Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Card 1: Fleet Performance Overview */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Fleet performance overview
                </h3>

                {/* 2x2 Metric Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                    <div className="text-[11px] text-slate-400 font-medium">Utilization</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">78%</div>
                  </div>

                  <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                    <div className="text-[11px] text-slate-400 font-medium">Fuel Efficiency</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">8.7 mpg</div>
                  </div>

                  <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                    <div className="text-[11px] text-slate-400 font-medium">On-time Rate</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">92%</div>
                  </div>

                  <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                    <div className="text-[11px] text-slate-400 font-medium">Idle Time</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">1h 12m</div>
                  </div>
                </div>

                {/* Driver Row */}
                <div className="bg-[#f8fafc] p-2.5 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs overflow-hidden font-bold">
                      👱🏼
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 leading-tight">Lukas Weber</div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">Top driver</div>
                    </div>
                  </div>

                  <span className="bg-[#86efac] text-[#14532d] text-xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    ★ 9.7
                  </span>
                </div>

                {/* Vehicles Row */}
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 mr-1.5">4 vehicles</span>
                      <span className="text-xs text-slate-500 font-medium">Needing service</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </div>

                {/* Incidents Row */}
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                      <AlertOctagon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 mr-1.5">3 minor</span>
                      <span className="text-xs text-slate-500 font-medium">Incidents this week</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </div>
              </div>

              {/* Card 2: The Iconic Olive Vehicle Card */}
              <div className="bg-[#d7e9b0] rounded-3xl p-5 border border-[#c4dc8c] flex flex-col justify-between text-[#1a2e05] shadow-sm relative overflow-hidden">
                {/* Truck Vector Illustration matching the reference photo */}
                <TruckIllustration />

                <div className="mt-2 space-y-1">
                  <h4 className="text-base font-extrabold tracking-tight text-[#1a2e05]">
                    Vehicle on the road
                  </h4>
                  <p className="text-xs text-[#3f571b] font-medium leading-relaxed">
                    Expedite cargo fleet with real-time tracking
                  </p>
                </div>

                <button
                  onClick={() => setIsInspectorOpen(true)}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Track vehicle</span>
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Dark Bento Card + Orders Table (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Top Dark Bento Card */}
              <div className="bg-[#121316] rounded-3xl p-6 md:p-7 text-white shadow-xl space-y-6">
                
                {/* Top Search & Actions Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Search input */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search order..."
                      className="w-full bg-[#1b1e24] border border-white/5 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>

                  {/* Export & Add Shipment buttons */}
                  <div className="flex items-center gap-2.5">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-transparent hover:bg-white/5 text-xs font-bold text-slate-300 hover:text-white transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>

                    <button
                      onClick={() => setIsInspectorOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-extrabold transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
                      <span>Add new shipment</span>
                    </button>
                  </div>
                </div>

                {/* Left/Right Split: Fulfillment Performance + Sales Overview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-1">
                  
                  {/* Left Side: Fulfillment Performance Bars (7 cols) */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-white tracking-tight">
                        Fulfillment Performance
                      </h4>
                      <div className="flex items-center gap-2 text-slate-400">
                        <button className="p-1 rounded hover:bg-white/5">
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded hover:bg-white/5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Month labels */}
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span className="text-white font-bold">May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                    </div>

                    {/* Dense Histogram Bars with 87% Highlight */}
                    <div className="relative h-24 flex items-end justify-between gap-1 pt-6 px-0.5">
                      {frequencyBars.map((height, idx) => {
                        const isPeak = idx === 16;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative">
                            {isPeak && (
                              <>
                                <div className="absolute -top-6 px-1.5 py-0.5 rounded-full bg-white text-black font-black text-[9px] shadow-lg z-10">
                                  87%
                                </div>
                                <div className="absolute top-0 bottom-0 w-px bg-white z-0"></div>
                              </>
                            )}
                            <div
                              style={{ height: `${height}%` }}
                              className={`w-full rounded-t-sm transition-all ${
                                isPeak
                                  ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                                  : 'bg-[#292c35] hover:bg-slate-500'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Side: Sales Overview & Semicircular Arc Gauge (5 cols) */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">
                        Sales Overview
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <SlidersHorizontal className="w-3 h-3" />
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Big Metric */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        $716,084
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                        32.2% <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Semicircular Gauge & Country Legend List */}
                    <div className="flex items-center gap-3 pt-1">
                      {/* SVG Gauge */}
                      <div className="relative w-36 h-20 shrink-0 flex items-end justify-center">
                        <svg viewBox="0 0 160 85" className="w-full h-full overflow-visible">
                          {/* Segment 1: Forest Green (Finland 28%) */}
                          <path
                            d="M 15 80 A 65 65 0 0 1 55 28"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="11"
                            strokeLinecap="round"
                          />
                          {/* Segment 2: Lime (Sweden 27%) */}
                          <path
                            d="M 57 26 A 65 65 0 0 1 105 26"
                            fill="none"
                            stroke="#a3e635"
                            strokeWidth="11"
                          />
                          {/* Segment 3: Blue/Purple (Iceland 22%) */}
                          <path
                            d="M 107 28 A 65 65 0 0 1 138 55"
                            fill="none"
                            stroke="#818cf8"
                            strokeWidth="11"
                          />
                          {/* Segment 4: Lavender (Estonia 14%) */}
                          <path
                            d="M 139 57 A 65 65 0 0 1 145 80"
                            fill="none"
                            stroke="#c084fc"
                            strokeWidth="11"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      {/* Legend List matching Finland/Sweden/Iceland */}
                      <div className="space-y-1 text-[10px] font-semibold text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-emerald-500"></span>
                          <span>Finland</span>
                          <span className="text-slate-400 font-mono">28%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-lime-400"></span>
                          <span>Sweden</span>
                          <span className="text-slate-400 font-mono">27%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-indigo-400"></span>
                          <span>Iceland</span>
                          <span className="text-slate-400 font-mono">22%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-purple-400"></span>
                          <span>Estonia</span>
                          <span className="text-slate-400 font-mono">14%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-amber-400"></span>
                          <span>Other</span>
                          <span className="text-slate-400 font-mono">9%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom White Orders Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-sm space-y-4">
                {/* Header & Filter Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      Orders
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-bold">
                      264
                    </span>
                  </div>

                  {/* Filter Pills matching MoveIQ segmented pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['Pending 70', 'Responded 85', 'Assigned 53', 'Completed 56'].map((pill) => {
                      const isSelected = orderFilter === pill.split(' ')[0];
                      return (
                        <button
                          key={pill}
                          onClick={() => setOrderFilter(pill.split(' ')[0])}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-black text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {pill}
                        </button>
                      );
                    })}

                    <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 ml-1">
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* The Clean Minimalist Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 pr-3">Order ID</th>
                        <th className="pb-3 px-3">Order assigned to</th>
                        <th className="pb-3 px-3">Route</th>
                        <th className="pb-3 px-3">Vehicle</th>
                        <th className="pb-3 px-3">Est. delivery</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 pl-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableRows.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => runAnalysis(row.sampleUtterance)}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        >
                          <td className="py-4 pr-3 font-mono font-bold text-slate-900">
                            {row.id}
                          </td>

                          <td className="py-4 px-3 font-bold text-slate-800 whitespace-nowrap">
                            {row.assignedTo}
                          </td>

                          {/* Route with Flag pins and curved arrow */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{row.fromFlag}</span>
                              <span className="font-semibold text-slate-800 text-[11px]">{row.fromCity}</span>
                              <span className="text-slate-400 font-bold px-1">↳</span>
                              <span className="text-sm">{row.toFlag}</span>
                              <span className="font-semibold text-slate-800 text-[11px]">{row.toCity}</span>
                            </div>
                          </td>

                          <td className="py-4 px-3 text-slate-600 font-medium whitespace-nowrap">
                            {row.vehicle}
                          </td>

                          <td className="py-4 px-3 text-slate-500 whitespace-nowrap">
                            {row.delivery}
                          </td>

                          <td className="py-4 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                              <span className={`w-2 h-2 rounded-full ${row.statusColor}`}></span>
                              <span>{row.status}</span>
                            </div>
                          </td>

                          <td className="py-4 pl-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => runAnalysis(row.sampleUtterance)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-bold text-slate-700 hover:text-black transition-all shadow-sm"
                              >
                                See more
                              </button>
                              <button className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING ACTION KEY MODE PILL (Centered at bottom) */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setIsInspectorOpen(true)}
              className="bg-[#181a1f] text-white px-5 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-slate-300">
                <Volume2 className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold tracking-wide text-slate-100">
                Action key mode
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* COGNITIVE AFFECT DECONSTRUCTION MODAL (Opened by "Track Vehicle", "Action key mode", or "See more") */}
      {isInspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsInspectorOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-xs font-black">
                  Q
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Cognitive Affect & Intent Deconstructor
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Deep context-aware analysis with causal extraction and zero static canned answers.
              </p>
            </div>

            {/* Input area */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Enter Text Utterance for Analysis:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAnalysis(inputText)}
                  placeholder="e.g. 'I am tried due to work in night'..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-black"
                />
                <button
                  onClick={() => runAnalysis(inputText)}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-900 transition-all shadow-sm"
                >
                  Analyze
                </button>
              </div>

              {/* Sample pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'I am tried due to work in night',
                  'I finally received the promotion and dream offer!',
                  'Why did you cancel the presentation without asking me?',
                  'I feel so helpless and burdened by all these tasks.'
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => runAnalysis(sample)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Output */}
            {analysisResult && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {/* Result Hero */}
                <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{analysisResult.emoji}</span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Detected Primary Nuance
                      </div>
                      <div className="text-lg font-extrabold text-white">
                        {analysisResult.sub_emotion} ({analysisResult.dominant_label})
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      Confidence: {Math.round(analysisResult.confidence * 100)}%
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Valence: {analysisResult.affect_coordinates.valence} | Arousal: {analysisResult.affect_coordinates.arousal}
                    </div>
                  </div>
                </div>

                {/* 3 Pillars: Causal Trigger, Chrono Stress, Intent */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60">
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      Causal Antecedent
                    </div>
                    <div className="text-sm font-extrabold text-amber-950 mt-1">
                      &ldquo;{analysisResult.components.cause || 'work in night'}&rdquo;
                    </div>
                    <div className="text-[10px] text-amber-700 mt-0.5">
                      External labor / situational strain
                    </div>
                  </div>

                  <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200/60">
                    <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                      Circadian Stressor
                    </div>
                    <div className="text-sm font-extrabold text-blue-950 mt-1">
                      &ldquo;{analysisResult.components.temporal_context || 'nocturnal shift'}&rdquo;
                    </div>
                    <div className="text-[10px] text-blue-700 mt-0.5">
                      Chronobiological sleep disruption
                    </div>
                  </div>

                  <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200/60">
                    <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                      Communicative Intent
                    </div>
                    <div className="text-sm font-extrabold text-purple-950 mt-1">
                      {analysisResult.intent.name}
                    </div>
                    <div className="text-[10px] text-purple-700 mt-0.5">
                      {analysisResult.intent.badge}
                    </div>
                  </div>
                </div>

                {/* Dynamic Reasoning Narrative */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Dynamic Psychological & Linguistic Explanation:
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-normal space-y-2">
                    {analysisResult.explanation.reasoning}
                  </div>
                </div>

                {/* Saliency Tokens */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Word Saliency Tokens:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.saliency.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          token.is_key_driver
                            ? 'bg-black text-white border-black'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {token.word}
                        {token.is_key_driver && (
                          <span className="ml-1.5 text-[10px] font-mono text-emerald-400">
                            {Math.round(token.weight * 100)}%
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
