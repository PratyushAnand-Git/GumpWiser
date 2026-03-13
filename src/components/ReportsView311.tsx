"use client";
import { useState, useEffect } from 'react';

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc',
  padding: '13px 16px', boxShadow: '0 2px 16px rgba(28,20,9,.07)',
};
const pill = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
  padding: '4px 11px', borderRadius: 20, background: bg, color: fg,
});

const CATS = [
  { ico: '🛣️', name: 'Road & Pothole Repairs', val: 72, color: '#3f3ad4' },
  { ico: '💡', name: 'Utilities & Outages',     val: 55, color: '#f0900a' },
  { ico: '🌳', name: 'Parks & Recreation',       val: 38, color: '#009980' },
  { ico: '🔊', name: 'Noise Complaints',         val: 24, color: '#6b21e8' },
  { ico: '🗑️', name: 'Sanitation & Trash',       val: 18, color: '#ff4422' },
  { ico: '💧', name: 'Water & Drainage',          val: 14, color: '#0099dd' },
];
const ITEMS = [
  { num: '#31182', title: 'Pothole on Perry St near museum',       desc: 'Large pothole causing traffic issues. Reported by 3 residents.', loc: 'Perry St, Downtown',       date: '2 days ago', status: 'RESOLVED', sb: '#d1fae5', sf: '#065f46', cat: 'Roads'     },
  { num: '#31179', title: 'Power outage — Ann Street corridor',    desc: 'Multiple blocks without power since 6am. APC contacted.',       loc: 'Ann St, East Side',       date: '3 days ago', status: 'RESOLVED', sb: '#d1fae5', sf: '#065f46', cat: 'Utilities' },
  { num: '#31176', title: 'Broken streetlight at Ann & Monroe',    desc: 'Light has been out for 3+ days. Pedestrian safety concern.',    loc: 'Ann & Monroe St',         date: '5 days ago', status: 'OPEN',     sb: '#fef3c7', sf: '#92400e', cat: 'Civic'     },
  { num: '#31174', title: 'Missed trash pickup — District 5',      desc: 'Trash not collected on scheduled day. Multiple households.',    loc: 'South Montgomery, Dist.5',date: '5 days ago', status: 'RESOLVED', sb: '#d1fae5', sf: '#065f46', cat: 'Sanitation' },
  { num: '#31170', title: 'Overgrown vegetation blocking sign',    desc: 'Tree branches obscuring stop sign at Oak Park entrance.',       loc: 'Oak Park Dr',             date: '7 days ago', status: 'OPEN',     sb: '#fef3c7', sf: '#92400e', cat: 'Parks'     },
  { num: '#31165', title: 'Water main pressure drop — Mobile Hwy', desc: 'Low water pressure reported by 6 households.',                  loc: 'Mobile Hwy, South',       date: '8 days ago', status: 'OPEN',     sb: '#fef3c7', sf: '#92400e', cat: 'Utilities' },
];

function SH({ title, tag, extra }: { title: string; tag?: string; extra?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>{title}</span>
      <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
      {extra}
      {tag && <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Fira Code',monospace", color: '#8a7c6a' }}>{tag}</span>}
    </div>
  );
}

export default function ReportsView311() {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [anim, setAnim]     = useState(false);
  
  const items = filter === 'all' ? ITEMS : ITEMS.filter(x => x.status === (filter === 'open' ? 'OPEN' : 'RESOLVED'));

  useEffect(() => {
    const t = setTimeout(() => setAnim(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, borderRadius: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>311 Reports</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>Montgomery citizen service requests · ArcGIS Open Data · Last 30 days</div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ ...pill('rgba(63,58,212,.1)', '#3f3ad4') }}>247 Total</span>
          <span style={{ ...pill('#d1fae5', '#065f46') }}>189 Resolved</span>
          <span style={{ ...pill('#fef3c7', '#92400e') }}>58 Pending</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SH title="Category Breakdown" tag="30-DAY WINDOW" />
          {CATS.map(c => (
            <div key={c.name} style={{ ...card, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '11px 14px' }}>
              <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{c.name}</span>
              <div style={{ flex: 2, height: 8, background: '#f5f1ea', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: anim ? `${c.val}%` : '0%', height: '100%', background: c.color, borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
              </div>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, width: 36, textAlign: 'right', color: c.color }}>{c.val}</span>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 12px' }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>Recent Requests</span>
            <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
            <div style={{ display: 'flex', gap: 5 }}>
              {(['all', 'open', 'resolved'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  fontFamily: "'Fira Code',monospace", border: '1.5px solid #ebe6dc', cursor: 'pointer',
                  background: filter === f ? '#1c1409' : '#f5f1ea',
                  color: filter === f ? '#fff' : '#8a7c6a', textTransform: 'capitalize',
                  transition: 'all .15s',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {items.map(x => (
            <div key={x.num} style={{ ...card, marginBottom: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 700, color: '#8a7c6a' }}>{x.num}</span>
                <div style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{x.title}</div>
                <span style={{ fontSize: 10.5, fontWeight: 700, fontFamily: "'Fira Code',monospace", padding: '2px 9px', borderRadius: 6, background: x.sb, color: x.sf }}>{x.status}</span>
              </div>
              <div style={{ fontSize: 12, color: '#8a7c6a', marginBottom: 6, lineHeight: 1.5 }}>{x.desc}</div>
              <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#8a7c6a', fontFamily: "'Fira Code',monospace" }}>
                <span>📍 {x.loc}</span>
                <span>🕐 {x.date}</span>
                <span>🏷️ {x.cat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📊 Resolution Stats</div>
            {[
              { label: 'Avg Resolution Time', val: '3.4 days', color: '#009980' },
              { label: 'Resolution Rate',      val: '76%',      color: '#009980' },
              { label: 'Repeat Complaints',    val: '12%',      color: '#ff4422' },
              { label: 'High Priority',        val: '23 items', color: '#f0900a' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1.5px solid #f5f1ea', fontSize: 12 }}>
                <span style={{ color: '#8a7c6a', fontWeight: 600 }}>{label}</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 900, color }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📍 Hot Districts</div>
            {[
              { name: 'District 5 (South)', n: 68, color: '#ff4422', pct: 90 },
              { name: 'Downtown',           n: 52, color: '#f0900a', pct: 69 },
              { name: 'East Montgomery',    n: 41, color: '#3f3ad4', pct: 54 },
              { name: 'West Side',          n: 36, color: '#009980', pct: 48 },
            ].map(d => (
              <div key={d.name} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span>{d.name}</span>
                  <span style={{ color: d.color, fontWeight: 700 }}>{d.n} reports</span>
                </div>
                <div style={{ height: 6, background: '#f5f1ea', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⚡ Submit a Report</div>
            <div style={{ fontSize: 12, color: '#8a7c6a', marginBottom: 10, lineHeight: 1.5 }}>Spotted an issue? Paste a claim into the Analyzer and tag it as a 311 report.</div>
            <button style={{ width: '100%', padding: '10px 0', borderRadius: 12, background: 'linear-gradient(135deg,#3f3ad4,#6b21e8)', color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: "'Figtree',sans-serif", border: 'none', cursor: 'pointer' }}>
              Open Analyzer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
