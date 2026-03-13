"use client";

const S: Record<string, React.CSSProperties> = {};

const ACTIVE_CALLS = [
  { ico: '🔥', bg: 'rgba(255,68,34,.1)',  title: 'Structure Fire',    loc: '1240 Mobile Hwy',  t: '4 min ago',  u: '3 units dispatched',      status: 'ACTIVE',  sb: '#fee2e2', sf: '#991b1b', priority: 'HIGH'   },
  { ico: '👮', bg: 'rgba(14,165,233,.1)', title: 'Traffic Incident',  loc: 'I-85 N @ Exit 6',  t: '11 min ago', u: '2 units on scene',        status: 'ACTIVE',  sb: '#fee2e2', sf: '#991b1b', priority: 'MEDIUM' },
  { ico: '🚑', bg: 'rgba(0,153,128,.1)',  title: 'Medical Emergency', loc: 'Oak Park Drive',   t: '19 min ago', u: '1 unit — patient stable', status: 'ACTIVE',  sb: '#fee2e2', sf: '#991b1b', priority: 'HIGH'   },
  { ico: '🚧', bg: 'rgba(240,144,10,.1)', title: 'Road Obstruction',  loc: 'Perry St & Monroe',t: '34 min ago', u: 'Cleared — road open',     status: 'PENDING', sb: '#fef3c7', sf: '#92400e', priority: 'LOW'    },
];
const CLEARED_CALLS = [
  { ico: '🔦', bg: 'rgba(63,58,212,.1)',  title: 'Power Line Down',  loc: 'Ann St corridor',  t: '2h ago', u: 'APC confirmed restoration'        },
  { ico: '🐕', bg: 'rgba(0,153,128,.1)',  title: 'Animal Control',   loc: 'Oak Park Dr',      t: '3h ago', u: 'Animal retrieved'                 },
  { ico: '💧', bg: 'rgba(14,165,233,.1)', title: 'Water Main Leak',  loc: 'Narrow Lane Rd',  t: '5h ago', u: 'Repair crew — sealed'             },
  { ico: '🚨', bg: 'rgba(255,68,34,.1)',  title: 'Noise Complaint',  loc: 'Madison Ave',      t: '7h ago', u: 'Officers responded — dispersed'   },
];
const DISTRICTS = [
  { name: 'North Montgomery', calls: 4, color: '#ff4422', pct: 70 },
  { name: 'Downtown',         calls: 5, color: '#f0900a', pct: 85 },
  { name: 'South Montgomery', calls: 3, color: '#3f3ad4', pct: 50 },
  { name: 'East Side',        calls: 3, color: '#009980', pct: 50 },
];

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc',
  padding: '13px 16px', boxShadow: '0 2px 16px rgba(28,20,9,.07)',
};
const pill = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
  padding: '2px 9px', borderRadius: 6, background: bg, color: fg,
});

export default function NineOneOnePulseView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, borderRadius: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>911 Pulse</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>Live emergency dispatch — Montgomery AL · CAD feed simulation</div>
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <span style={{ ...pill('#fee2e2', '#991b1b') }}>3 Active</span>
          <span style={{ ...pill('#fef3c7', '#92400e') }}>1 Pending</span>
          <span style={{ ...pill('#d1fae5', '#065f46') }}>12 Cleared Today</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Main call lists */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <SectionHead title="Active Calls" tag="CAD · REAL-TIME" />
          {ACTIVE_CALLS.map((d, i) => (
            <div key={i} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10, transition: 'transform .15s' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: d.bg, display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>{d.ico}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{d.title}</div>
                <div style={{ fontSize: 11.5, color: '#8a7c6a', marginBottom: 4 }}>📍 {d.loc}</div>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ ...pill(d.sb, d.sf) }}>{d.status}</span>
                  <span style={{ ...pill('#f5f1ea', '#8a7c6a') }}>{d.priority}</span>
                  <span style={{ fontSize: 10.5, color: '#8a7c6a', fontFamily: "'Fira Code',monospace" }}>{d.t} · {d.u}</span>
                </div>
              </div>
            </div>
          ))}

          <SectionHead title="Cleared Today" tag="LAST 24H" style={{ marginTop: 22 }} />
          {CLEARED_CALLS.map((d, i) => (
            <div key={i} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10, opacity: 0.72 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: d.bg, display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>{d.ico}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{d.title}</div>
                <div style={{ fontSize: 11.5, color: '#8a7c6a', marginBottom: 4 }}>📍 {d.loc}</div>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                  <span style={{ ...pill('#d1fae5', '#065f46') }}>✅ CLEARED</span>
                  <span style={{ fontSize: 10.5, color: '#8a7c6a', fontFamily: "'Fira Code',monospace" }}>{d.t} · {d.u}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📊 Response Stats</div>
            {[
              { label: 'Avg Response Time', val: '4.2 min', color: '#009980' },
              { label: 'Units Deployed',    val: '7',       color: '#3f3ad4' },
              { label: 'Calls Today',       val: '15',      color: '#f0900a' },
              { label: 'Medical',           val: '6',       color: '#1c1409' },
              { label: 'Fire',              val: '3',       color: '#1c1409' },
              { label: 'Traffic',           val: '4',       color: '#1c1409' },
              { label: 'Other',             val: '2',       color: '#1c1409' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1.5px solid #f5f1ea', fontSize: 12 }}>
                <span style={{ color: '#8a7c6a', fontWeight: 600 }}>{label}</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 900, color }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>District Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DISTRICTS.map(d => (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span>{d.name}</span>
                    <span style={{ color: d.color, fontWeight: 700 }}>{d.calls} calls</span>
                  </div>
                  <div style={{ height: 6, background: '#f5f1ea', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ title, tag, style }: { title: string; tag: string; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, ...style }}>
      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>{title}</span>
      <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Fira Code',monospace", color: '#8a7c6a' }}>{tag}</span>
    </div>
  );
}
