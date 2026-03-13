"use client";

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc',
  padding: '16px 18px', boxShadow: '0 2px 16px rgba(28,20,9,.07)',
};
const pill = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
  padding: '4px 11px', borderRadius: 20, background: bg, color: fg,
});

const DAYS   = ['M','T','W','T','F','S','S','M','T','W'];
const V_DATA = [22,18,31,24,19,14,11,28,33,26];
const R_DATA = [8, 11,14, 9,13, 6, 5,10,12, 9];

// Dynamic Scale calculation
const STACKED_MAX = Math.max(...V_DATA.map((v, i) => v + R_DATA[i]));
const DYNAMIC_MAX = Math.ceil(STACKED_MAX / 10) * 10;
const SCALE_STEPS = Array.from({ length: 5 }, (_, i) => DYNAMIC_MAX - (i * (DYNAMIC_MAX / 4)));
const CHART_H = 120; // Base height for bars

const CATS = [
  { n: 'Roads',     pct: 32, c: '#3f3ad4' },
  { n: 'Utilities', pct: 24, c: '#f0900a' },
  { n: 'Safety',    pct: 18, c: '#ff4422' },
  { n: 'Civic',     pct: 14, c: '#009980' },
  { n: 'Parks',     pct: 8,  c: '#5cb800' },
  { n: 'Other',     pct: 4,  c: '#8a7c6a' },
];
const SRCS = [
  { n: '𝕏 Twitter', pct: 38, c: '#1d9bf0', ico: <span style={{ fontWeight: 900, fontSize: 11 }}>𝕏</span> },
  { n: 'Reddit',    pct: 26, c: '#ff4500', ico: <span style={{ color: '#ff4500', fontWeight: 'bold', fontSize: 11 }}>r/</span> },
  { n: 'Facebook',  pct: 22, c: '#1877f2', ico: <svg style={{ width: 12, height: 12, color: '#1877f2' }} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { n: 'Nextdoor',  pct: 14, c: '#00b347', ico: <span style={{ color: '#00b347', fontWeight: 900, fontSize: 10 }}>ND</span> },
];
const TOPICS = [
  '#PotholeAlert','#WaterMain','#APCOutage','#I85Incident','#SinkholeRumor','#OakParkCleanup',
];
const TOPIC_CNTS = ['34 mentions','21 mentions','18 mentions','14 mentions','9 mentions','7 mentions'];
const HD = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function SH({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 11, color: '#8a7c6a' }}>{sub}</div>
    </div>
  );
}

export default function CityTrendsView() {
  const hvals = Array.from({ length: 28 }, () => Math.floor(Math.random() * 10));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, borderRadius: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>City Trends</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>30-day analytics — civic signal patterns across Montgomery</div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ ...pill('rgba(63,58,212,.1)', '#3f3ad4') }}>30-day window</span>
          <span style={{ ...pill('rgba(0,153,128,.12)', '#009980') }}>↑ 18% civic activity</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {/* Bar chart — spans 2 cols */}
        <div style={{ ...card, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginTop: 60, marginBottom: 10 }}>
            {/* Y-Axis Scale */}
            <div style={{ 
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
              height: CHART_H, paddingBottom: 20, fontSize: 9, fontFamily: "'Fira Code',monospace", color: '#8a7c6a',
              textAlign: 'right', width: 22
            }}>
              {SCALE_STEPS.map(s => <div key={s}>{s}</div>)}
            </div>
            
            {/* Bars Container with Grid Lines */}
            <div style={{ flex: 1, display: 'flex', gap: 4, alignItems: 'flex-end', height: CHART_H, padding: '0 4px', position: 'relative' }}>
              {/* Grid Lines */}
              {SCALE_STEPS.map((_, i) => (
                <div key={i} style={{ 
                  position: 'absolute', left: 0, right: 0, 
                  bottom: 20 + ((SCALE_STEPS.length - 1 - i) * ((CHART_H - 20) / (SCALE_STEPS.length - 1))), 
                  borderTop: '1px solid rgba(0,0,0,0.05)', zIndex: 0 
                }} />
              ))}
              
              {DAYS.map((d, i) => (
                <div key={i} 
                  title={`${V_DATA[i]} Verified, ${R_DATA[i]} Rumors`}
                  style={{ 
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: 'rgba(0,0,0,0.05)', borderRadius: 4, padding: '0',
                    cursor: 'help', zIndex: 1
                  }}>
                  <div style={{ width: '90%', borderRadius: '0', background: '#db3b1d', height: Math.round(R_DATA[i] / DYNAMIC_MAX * (CHART_H - 20)), opacity: .9 }} />
                  <div style={{ 
                    width: '90%', borderRadius: '0', 
                    background: 'rgba(0, 153, 128, 0.35)', 
                    border: '1.5px solid #007a66',
                    height: Math.round(V_DATA[i] / DYNAMIC_MAX * (CHART_H - 20))
                  }} />
                  <div style={{ fontSize: 9, height: 20, display: 'flex', alignItems: 'center', fontFamily: "'Fira Code',monospace", color: '#8a7c6a' }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11, fontFamily: "'Fira Code',monospace", fontWeight: 700 }}>
            {[{ c: '#009980', l: 'Verified' }, { c: '#ff4422', l: 'Rumors/Alerts' }].map(({ c, l }) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c, display: 'inline-block' }} />
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Category pie (bar list) */}
        <div style={card}>
          <SH title="Report Categories" sub="Distribution" />
          {CATS.map(c => (
            <div key={c.n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1.5px solid #f5f1ea', fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.c, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>{c.n}</div>
              <div style={{ flex: 2, margin: '0 8px', height: 6, background: '#f5f1ea', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${c.pct * 3}%`, height: '100%', background: c.c, borderRadius: 3 }} />
              </div>
              <div style={{ fontFamily: "'Fira Code',monospace", fontWeight: 700, fontSize: 11 }}>{c.pct}%</div>
            </div>
          ))}
        </div>

        {/* Sources */}
        <div style={card}>
          <SH title="Signal Sources" sub="By platform" />
          {SRCS.map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
              <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.ico}</div>
              <div style={{ fontSize: 12, fontWeight: 700, width: 80, flexShrink: 0 }}>{s.n}</div>
              <div style={{ flex: 1, height: 6, background: '#f5f1ea', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${s.pct}%`, height: '100%', background: s.c, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, fontFamily: "'Fira Code',monospace", fontWeight: 700, width: 32, textAlign: 'right' }}>{s.pct}%</div>
            </div>
          ))}
        </div>

        {/* Topics */}
        <div style={card}>
          <SH title="Top Civic Topics" sub="By mention count" />
          {TOPICS.map((t, i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: i < TOPICS.length - 1 ? '1.5px solid #f5f1ea' : 'none' }}>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: '#8a7c6a', width: 20 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 12.5, fontWeight: 700 }}>{t}</div>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: '#8a7c6a' }}>{TOPIC_CNTS[i]}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
