"use client";

export default function CityOperations() {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-800 tracking-tight">City Operations</h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montgomery AL • Live Data</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* === 911 Active Calls === */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.36 17.2 7.49 15.33 6.15 13.1A19.79 19.79 0 0 1 3.08 4.42 2 2 0 0 1 5.06 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800">911 Active Calls</span>
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">3 Active</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              { icon: '🔥', title: 'Structure Fire',      loc: '1240 Mobile Hwy',  time: '4 min ago',  detail: '3 units dispatched' },
              { icon: '🚗', title: 'Traffic Incident',    loc: 'I-85 N @ Exit 6',  time: '11 min ago', detail: '2 units' },
              { icon: '🚑', title: 'Medical Emergency', loc: 'Oak Park Drive',   time: '19 min ago', detail: '1 unit' },
              { icon: '🚧', title: 'Road Obstruction',   loc: 'Perry St & Monroe', time: '34 min ago', detail: 'Cleared', dim: true },
            ].map((c, i) => (
              <div key={i} className={`flex items-start gap-3 ${c.dim ? 'opacity-50' : ''}`}>
                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-sm shrink-0">{c.icon}</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{c.title}</p>
                  <p className="text-[10px] font-semibold text-slate-500">📍 {c.loc}</p>
                  <p className="text-[10px] text-slate-400">{c.time} · {c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Weather Pulse === */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-sky-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800">Weather Pulse</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">No Alerts</span>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-5xl">⛅</span>
              <div>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">74°</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Partly Cloudy · Montgomery AL</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'HUMIDITY', value: '62%', color: '' },
                { label: 'WIND',     value: 'NW 8mph', color: 'text-sky-500 font-black' },
                { label: 'UV INDEX', value: '6 — High', color: 'text-orange-500 font-black' },
                { label: 'VISIBILITY', value: '10 mi', color: '' },
              ].map((w, i) => (
                <div key={i} className="bg-[#F9F8F6] rounded-xl p-3 border border-slate-100">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{w.label}</p>
                  <p className={`text-sm font-bold text-slate-700 ${w.color}`}>{w.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === 311 Report Trends === */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800">311 Report Trends</span>
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">7-day</span>
          </div>

          <div className="flex-1 p-5 space-y-4">
            {[
              { label: 'Roads',      pct: 72, color: 'bg-[#4128E6]' },
              { label: 'Utilities',  pct: 55, color: 'bg-orange-500' },
              { label: 'Parks',      pct: 38, color: 'bg-emerald-500' },
              { label: 'Noise',      pct: 24, color: 'bg-purple-500' },
              { label: 'Sanitation', pct: 18, color: 'bg-red-500' },
            ].map((t, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-600">{t.label}</span>
                  <span className="text-xs font-bold text-slate-500">{t.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${t.color} h-2 rounded-full`} style={{ width: `${t.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-4 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 text-center">📍 District 5 · South Montgomery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
