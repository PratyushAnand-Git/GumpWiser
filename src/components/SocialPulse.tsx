"use client";
import { useState } from 'react';

const FEED = [
  { id: 1, platform: 'Twitter', time: '2m ago', text: 'Anyone see the road crew on Perry St? Finally fixing those potholes!', score: 88, label: 'VERIFIED', cat: 'Roads', isVerified: true },
  { id: 2, platform: 'Reddit', time: '5m ago', text: 'Rumor: water main burst near Rosa Parks Museum — whole downtown flooding???', score: 10, label: 'ALERT', cat: 'Utilities', isVerified: false },
  { id: 3, platform: 'Facebook', time: '9m ago', text: 'Power outage on Ann St since 6am, still nothing from APC 😫', score: 74, label: 'VERIFIED', cat: 'Utilities', isVerified: true },
  { id: 4, platform: 'Nextdoor', time: '13m ago', text: 'HUGE sinkhole on Mobile Hwy — cars literally falling in, do not drive there!', score: 9, label: 'ALERT', cat: 'Roads', isVerified: false },
  { id: 5, platform: 'Twitter', time: '16m ago', text: '311 confirmed: park cleanup at Oak Park 9am—noon today ✅', score: 96, label: 'VERIFIED', cat: 'Parks', isVerified: true },
  { id: 6, platform: 'Reddit', time: '19m ago', text: 'Is it true they shutting down ALL downtown parking for the whole month?', score: 15, label: 'ALERT', cat: 'Civic', isVerified: false },
  { id: 7, platform: 'Facebook', time: '22m ago', text: 'Trash pickup delayed District 5 — equipment maintenance per city website', score: 84, label: 'VERIFIED', cat: 'Sanitation', isVerified: true },
  { id: 8, platform: 'Twitter', time: '25m ago', text: 'Hearing gunshots near Madison Ave — anyone else got info?', score: 52, label: 'CAUTION', cat: 'Safety', isVerified: false },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === 'Twitter') return <span className="font-black text-[11px]">𝕏</span>;
  if (platform === 'Reddit') return <span className="text-orange-600 font-bold text-[11px]">r/</span>;
  if (platform === 'Facebook') return (
    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  );
  if (platform === 'Nextdoor') return <span className="text-emerald-600 font-black text-[10px]">ND</span>;
  return <span>•</span>;
};

export default function SocialPulse() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Civic', 'Safety', 'Hot'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-none">Live Social Pulse</p>
              <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Montgomery • Bright Data</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black text-emerald-600">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            LIVE
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 text-[11px] font-bold transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'Hot' ? '🔥 Hot' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {FEED.map(item => (
          <div key={item.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <PlatformIcon platform={item.platform} />
                <span>{item.platform}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
            </div>
            <p className="text-[12px] font-medium text-slate-800 leading-snug mb-2">
              {item.text}
            </p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${
                item.label === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                item.label === 'CAUTION' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {item.label === 'VERIFIED' ? '✓' : item.label === 'CAUTION' ? '⚠' : '✕'}
                {' '}{item.score}% {item.label}
              </div>
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {item.cat}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
