"use client";

import { useState, useEffect } from 'react';

const ALL_FEED = [
  { src: '𝕏 Twitter', dot: '#1d9bf0', time: '2m',  txt: 'Road crew on Perry St finally fixing those potholes!',                        sc: 88, v: 'v' as const, cat: 'Roads'      },
  { src: 'Reddit',     dot: '#ff4500', time: '5m',  txt: 'Rumor: water main burst near Rosa Parks Museum — whole downtown flooding???',   sc: 18, v: 'a' as const, cat: 'Utilities'  },
  { src: 'Facebook',   dot: '#1877f2', time: '9m',  txt: 'Power outage on Ann St since 6am, still nothing from APC 😤',                  sc: 74, v: 'v' as const, cat: 'Utilities'  },
  { src: 'Nextdoor',   dot: '#00b347', time: '13m', txt: 'HUGE sinkhole on Mobile Hwy — cars literally falling in, stay away!',           sc: 9,  v: 'a' as const, cat: 'Roads'      },
  { src: '𝕏 Twitter', dot: '#1d9bf0', time: '16m', txt: '311 confirmed: park cleanup at Oak Park 9am–noon today ✅',                     sc: 96, v: 'v' as const, cat: 'Parks'      },
  { src: 'Reddit',     dot: '#ff4500', time: '19m', txt: 'Is it true they shutting down ALL downtown parking for the whole month?',       sc: 15, v: 'a' as const, cat: 'Civic'      },
  { src: 'Facebook',   dot: '#1877f2', time: '22m', txt: 'Trash pickup delayed District 5 — equipment maintenance per city website',      sc: 84, v: 'v' as const, cat: 'Sanitation' },
  { src: '𝕏 Twitter', dot: '#1d9bf0', time: '25m', txt: 'Hearing gunshots near Madison Ave — anyone else got info?',                    sc: 52, v: 'c' as const, cat: 'Safety'     },
  { src: 'Nextdoor',   dot: '#00b347', time: '30m', txt: 'Street light out at Ann & Monroe for 3 days — filed 311 request',              sc: 78, v: 'v' as const, cat: 'Civic'      },
  { src: 'Reddit',     dot: '#ff4500', time: '38m', txt: 'City finally repaving Narrow Lane Rd — confirmed by 311',                      sc: 82, v: 'v' as const, cat: 'Roads'      },
  { src: 'Facebook',   dot: '#1877f2', time: '45m', txt: 'Explosion heard near the industrial park!! Anyone else hear it??',              sc: 8,  v: 'a' as const, cat: 'Safety'     },
  { src: 'Nextdoor',   dot: '#00b347', time: '52m', txt: 'Loose dog on Oak Park Dr — brown lab, very friendly, no collar',               sc: 95, v: 'v' as const, cat: 'Community'  },
];

type Filter = 'all' | 'v' | 'a' | 'c';
type SrcFilter = 'all' | string;

const VERDICT_STYLES = {
  v: { bg: '#d1fae5', color: '#065f46', label: '✅ VERIFIED' },
  a: { bg: '#fee2e2', color: '#991b1b', label: '🚫 ALERT'    },
  c: { bg: '#fef3c7', color: '#92400e', label: '⚠️ CAUTION'  },
};

const SOURCE_HEALTH = [
  { name: '𝕏 Twitter', dot: '#1d9bf0', pct: 78 },
  { name: 'Reddit',     dot: '#ff4500', pct: 52 },
  { name: 'Facebook',   dot: '#1877f2', pct: 71 },
  { name: 'Nextdoor',   dot: '#00b347', pct: 88 },
];

const TRENDING = [
  { tag: '#PotholeAlert', cat: 'Roads',     catC: '#3f3ad4', cnt: '2.3K' },
  { tag: '#WaterMain',    cat: 'Utilities', catC: '#0099dd', cnt: '1.8K' },
  { tag: '#APCOutage',    cat: 'Power',     catC: '#f0900a', cnt: '1.2K' },
  { tag: '#SinkholeRumor',cat: 'Warning',   catC: '#ff4422', cnt: '980'  },
  { tag: '#OakPark',      cat: 'Parks',     catC: '#009980', cnt: '744'  },
];

const SOURCES_LIST = ['All Sources', '𝕏 Twitter', 'Reddit', 'Facebook', 'Nextdoor'];
const SRC_COLORS: Record<string, string> = { 'All Sources': '#3f3ad4', '𝕏 Twitter': '#1d9bf0', Reddit: '#ff4500', Facebook: '#1877f2', Nextdoor: '#00b347' };
const TYPE_BTNS = [
  { key: 'all', label: '🌐 All'      },
  { key: 'v',   label: '✅ Verified' },
  { key: 'a',   label: '🚫 Misinfo'  },
  { key: 'c',   label: '⚠️ Caution'  },
];

export default function SocialFeedView({ onLoadToAnalyzer }: { onLoadToAnalyzer: (txt: string) => void }) {
  const [srcFilter, setSrcFilter] = useState<SrcFilter>('all');
  const [typeFilter, setTypeFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const { getSessionProfile } = require('@/lib/auth');
    setProfile(getSessionProfile());
  }, []);

  const filtered = ALL_FEED.filter(f => {
    const srcOk = srcFilter === 'all' || f.src === srcFilter;
    const typeOk = typeFilter === 'all' || f.v === typeFilter;
    const qOk   = !search || f.txt.toLowerCase().includes(search.toLowerCase());
    return srcOk && typeOk && qOk;
  });

  return (
    <div style={{ padding: '22px 26px', overflowY: 'auto', flex: 1 }}>

      {/* Hero */}
      <div style={{
        background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(28,20,9,.07)',
        padding: '20px 24px', marginBottom: 16, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900, color: '#1c1409' }}>Live Social Feed</div>
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px' }}>Bright Data · Montgomery Signals · Real-Time</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[{ val: '14.2K', lbl: 'Posts Scanned', c: '#3f3ad4' }, { val: '68%', lbl: 'Verified', c: '#009980' }, { val: '32%', lbl: 'Flagged', c: '#ff4422' }, { val: '4', lbl: 'Sources Live', c: '#f0900a' }].map(s => (
            <div key={s.lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '10px 14px', marginBottom: 14,
        boxShadow: '0 2px 16px rgba(28,20,9,.07)', display: 'flex', alignItems: 'center',
        gap: 10, flexWrap: 'wrap',
      }}>
        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px' }}>Sources</span>
        {SOURCES_LIST.map(src => {
          const key = src === 'All Sources' ? 'all' : src;
          const isOn = srcFilter === key;
          const c = SRC_COLORS[src];
          return (
            <button key={src} onClick={() => setSrcFilter(key)}
              style={{
                border: `1.5px solid ${isOn ? c : '#ddd8ce'}`, borderRadius: 20,
                padding: '5px 12px', fontFamily: "'Fira Code',monospace", fontSize: 10,
                fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
                background: isOn ? c : '#fff', color: isOn ? '#fff' : '#8a7c6a',
              }}>
              {src}
            </button>
          );
        })}
        <div style={{ width: 1, height: 24, background: '#ddd8ce', margin: '0 4px' }} />
        {TYPE_BTNS.map(t => {
          const isOn = typeFilter === t.key;
          return (
            <button key={t.key} onClick={() => setTypeFilter(t.key as Filter)}
              style={{
                border: '1.5px solid #ddd8ce', borderRadius: 8, padding: '5px 10px',
                fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 600,
                cursor: 'pointer', transition: 'all .15s',
                background: isOn ? '#1c1409' : '#fff', color: isOn ? '#fff' : '#8a7c6a',
              }}>
              {t.label}
            </button>
          );
        })}
        <div style={{ width: 1, height: 24, background: '#ddd8ce', margin: '0 4px' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
          style={{
            border: '1.5px solid #ebe6dc', borderRadius: 8, padding: '5px 10px', width: 160,
            fontFamily: "'Figtree',sans-serif", fontSize: 12, outline: 'none', color: '#1c1409', background: '#fff',
          }} />
      </div>

      {/* Main 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

        {/* Post Stream */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8a7c6a', fontSize: 13, background: '#fff', borderRadius: 14 }}>
              No posts match the current filters.
            </div>
          ) : filtered.map((f, i) => {
            const vs = VERDICT_STYLES[f.v];
            const borderC = f.v === 'v' ? '#009980' : f.v === 'a' ? '#ff4422' : '#f0900a';
            const circ = 88, off = circ - (f.sc / 100) * circ;
            return (
              <div key={i}
                onClick={() => onLoadToAnalyzer(f.txt)}
                style={{
                  background: '#fff', borderRadius: 12, padding: '14px 16px',
                  marginBottom: 10, cursor: 'pointer',
                  boxShadow: '0 2px 16px rgba(28,20,9,.07)',
                  borderLeft: `3px solid ${borderC}`,
                  transition: 'transform .15s, box-shadow .15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(28,20,9,.13)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(28,20,9,.07)'; }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: `${f.dot}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0, color: f.dot, fontFamily: "'Fira Code',monospace" }}>
                    {f.src === '𝕏 Twitter' ? <span style={{ fontWeight: 900 }}>𝕏</span> : 
                     f.src === 'Reddit'    ? <span style={{ fontWeight: 700 }}>r/</span> : 
                     f.src === 'Facebook'  ? <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> : 
                     <span style={{ fontWeight: 900, fontSize: 11 }}>ND</span>}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1c1409', fontFamily: "'Figtree',sans-serif" }}>{f.src}</div>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a' }}>{f.time} ago · {f.cat}</div>
                  </div>
                  {/* Score ring */}
                  <div style={{ marginLeft: 'auto', position: 'relative', width: 42, height: 42, flexShrink: 0 }}>
                    <svg width="42" height="42" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="21" cy="21" r="14" fill="none" stroke="#ebe6dc" strokeWidth="5" />
                      <circle cx="21" cy="21" r="14" fill="none" stroke={borderC} strokeWidth="5"
                        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fira Code',monospace", fontSize: 8, fontWeight: 700, color: borderC }}>{f.sc}</div>
                  </div>
                </div>
                {/* Body */}
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#3a2f1e', marginBottom: 8, fontFamily: "'Figtree',sans-serif" }}>{f.txt}</div>
                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: vs.bg, color: vs.color }}>{vs.label}</span>
                  <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, padding: '3px 8px', borderRadius: 8, background: '#ebe6dc', color: '#8a7c6a' }}>{f.cat}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    {profile && profile.session_type === 'verified_stakeholder' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); alert(`Refute Interface Triggered!\nAs a Verified Stakeholder (${profile.actual_name}), you can contest this claim.`); }}
                        style={{
                          background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 8, padding: '4px 10px',
                          fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 700, cursor: 'pointer', transition: 'all 0.1s'
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fecaca'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fee2e2'}
                      >
                        REFUTE
                      </button>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); onLoadToAnalyzer(f.txt); }}
                      style={{ background: 'linear-gradient(135deg,#3f3ad4,#6b21e8)', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 600, cursor: 'pointer' }}
                    >⚡ Analyze</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right sidebar */}
        <div>
          {/* Source Health */}
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(28,20,9,.07)', padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#1c1409' }}>📊 Source Health</div>
            {SOURCE_HEALTH.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, flex: 1, fontFamily: "'Figtree',sans-serif", color: '#1c1409' }}>{s.name}</span>
                <div style={{ flex: 1, height: 5, background: '#ebe6dc', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: s.dot, borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 600, color: '#1c1409', minWidth: 28, textAlign: 'right' }}>{s.pct}%</span>
              </div>
            ))}
          </div>

          {/* Trending */}
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(28,20,9,.07)', padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#1c1409' }}>🔥 Trending Topics</div>
            {TRENDING.map(t => (
              <div key={t.tag} onClick={() => setSearch(t.tag.replace('#', ''))}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid #ebe6dc', cursor: 'pointer' }}>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: `${t.catC}22`, color: t.catC }}>{t.cat}</span>
                <span style={{ fontSize: 12, fontWeight: 700, flex: 1, fontFamily: "'Figtree',sans-serif", color: '#1c1409' }}>{t.tag}</span>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a' }}>{t.cnt}</span>
              </div>
            ))}
          </div>

          {/* Quick Analyze CTA */}
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(28,20,9,.07)', padding: '14px 16px' }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#1c1409' }}>⚡ Quick Analyze</div>
            <p style={{ fontSize: 12, color: '#8a7c6a', marginBottom: 10, fontFamily: "'Figtree',sans-serif" }}>Load any post into the AI analyzer with one click</p>
            <button
              onClick={() => onLoadToAnalyzer('')}
              style={{ width: '100%', padding: 9, background: 'linear-gradient(135deg,#3f3ad4,#6b21e8)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: "'Figtree',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >Go to Analyzer →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
