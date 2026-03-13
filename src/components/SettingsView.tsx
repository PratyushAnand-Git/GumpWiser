"use client";
import { useState, useEffect } from 'react';
import { getSessionProfile } from '@/lib/auth';

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc',
  boxShadow: '0 2px 16px rgba(28,20,9,.07)', overflow: 'hidden',
};
const pill = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
  padding: '4px 11px', borderRadius: 20, background: bg, color: fg,
});

const INTEGRATIONS = [
  { label: 'Gemini 1.5 Flash API',         sub: 'AI rumor analysis engine',           badge: '✅ Connected', bs: 'set-ok'  },
  { label: 'Bright Data Social Scraper',    sub: 'Twitter, Reddit, Facebook, Nextdoor', badge: '⚠️ Demo Mode', bs: 'set-warn' },
  { label: 'Montgomery ArcGIS 311',         sub: 'City of Montgomery open data portal', badge: '⚠️ Demo Mode', bs: 'set-warn' },
  { label: 'Montgomery CAD 911 Feed',       sub: 'Computer Aided Dispatch system',      badge: '🔌 Not Connected', bs: 'set-off' },
  { label: 'NWS Weather API',               sub: 'National Weather Service alerts',     badge: '✅ Connected', bs: 'set-ok'  },
];
const ALERTS = [
  { label: 'Emergency Alerts',        sub: '911 incidents, fires, major accidents',            init: true  },
  { label: 'Weather Warnings',        sub: 'Severe thunderstorms, tornado watches',            init: true  },
  { label: 'High-Score Rumors (>80%)',sub: 'Auto-alert on verified high-credibility claims',   init: true  },
  { label: 'Misinformation Flags',    sub: 'Alert when known false info spreads',              init: false },
];
const DISPLAY = [
  { label: 'Live Ticker',            sub: 'Scrolling social pulse bar on dashboard',  init: true  },
  { label: 'Auto-refresh (60s)',     sub: 'Silently refresh feed and map data',       init: false },
  { label: 'Show Restricted Zones', sub: 'Display restricted overlays on map',       init: true  },
];

function badgeStyle(bs: string): React.CSSProperties {
  if (bs === 'set-ok')   return { ...pill('#d1fae5', '#065f46'), flexShrink: 0 };
  if (bs === 'set-warn') return { ...pill('#fef3c7', '#92400e'), flexShrink: 0 };
  return { ...pill('#ebe6dc', '#8a7c6a'), flexShrink: 0 };
}

function Toggle({ init }: { init: boolean }) {
  const [on, setOn] = useState(init);
  return (
    <div onClick={() => setOn(!on)} style={{
      width: 42, height: 24, borderRadius: 12,
      background: on ? '#009980' : '#ddd8ce',
      position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.2)',
      }} />
    </div>
  );
}

function SH({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 14px' }}>
      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>{title}</span>
      <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
    </div>
  );
}

export default function SettingsView({ refreshKey = 0 }: { refreshKey?: number }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setProfile(getSessionProfile());
  }, [refreshKey]);

  // Derive display stats
  const accuracy = profile && profile.analysis_count > 0 
    ? Math.round((profile.verified_count / profile.analysis_count) * 100) 
    : 0;
  
  const stats = [
    { label: 'Reports Submitted', val: profile?.analysis_count || 0, color: '#1c1409' },
    { label: 'Accuracy Score',    val: `${accuracy}%`, color: '#009980' },
    { label: 'Verified Reports',  val: profile?.verified_count || 0, color: '#f0900a' },
  ];

  const initials = profile?.username?.slice(0, 1).toUpperCase() || 'M';
  const role = profile?.session_type === 'verified_stakeholder' ? 'Verified Stakeholder' : 'Montgomery Resident';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ background: '#fff', borderRadius: 18, border: '2px solid #ebe6dc', padding: '18px 22px', marginBottom: 4, boxShadow: '0 2px 16px rgba(28,20,9,.07)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 28, width: 52, height: 52, background: '#f5f1ea', borderRadius: 14, display: 'grid', placeItems: 'center', border: '2px solid #ebe6dc', flexShrink: 0 }}>⚙️</div>
        <div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>Settings</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>GumpWiser preferences, integrations &amp; data sources</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SH title="Data Integrations" />
          <div style={card}>
            {INTEGRATIONS.map(({ label, sub, badge, bs }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < INTEGRATIONS.length - 1 ? '1.5px solid #f5f1ea' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11.5, color: '#8a7c6a' }}>{sub}</div>
                </div>
                <span style={badgeStyle(bs)}>{badge}</span>
              </div>
            ))}
          </div>

          <SH title="Alert Preferences" />
          <div style={card}>
            {ALERTS.map(({ label, sub, init }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < ALERTS.length - 1 ? '1.5px solid #f5f1ea' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11.5, color: '#8a7c6a' }}>{sub}</div>
                </div>
                <Toggle init={init} />
              </div>
            ))}
          </div>

          <SH title="Display" />
          <div style={card}>
            {DISPLAY.map(({ label, sub, init }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < DISPLAY.length - 1 ? '1.5px solid #f5f1ea' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11.5, color: '#8a7c6a' }}>{sub}</div>
                </div>
                <Toggle init={init} />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc', padding: '14px 16px', boxShadow: '0 2px 16px rgba(28,20,9,.07)' }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>👤 Profile</div>
            <div style={{ textAlign: 'center', padding: '10px 0 14px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: profile?.session_type === 'verified_stakeholder' ? 'linear-gradient(135deg,#3f3ad4,#6b21e8)' : 'linear-gradient(135deg,#8a7c6a,#ddd8ce)', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 auto 10px' }}>{initials}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{profile?.actual_name || profile?.username || 'Guest User'}</div>
              <div style={{ fontSize: 11, color: '#8a7c6a', fontFamily: "'Fira Code',monospace" }}>{role} · Montgomery AL</div>
            </div>
            {stats.map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1.5px solid #f5f1ea', fontSize: 12 }}>
                <span style={{ color: '#8a7c6a', fontWeight: 600 }}>{label}</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 900, color }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc', padding: '14px 16px', boxShadow: '0 2px 16px rgba(28,20,9,.07)' }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>ℹ️ About GumpWiser</div>
            <div style={{ fontSize: 12, color: '#8a7c6a', lineHeight: 1.65 }}>
              <p style={{ marginBottom: 6 }}><strong style={{ color: '#1c1409' }}>GumpWiser v1.0</strong> — Civic Intelligence Platform for Montgomery, AL.</p>
              <p style={{ marginBottom: 6 }}>Track: Civic Access &amp; Community Communication</p>
              <p style={{ marginBottom: 6 }}>Stack: Gemini 1.5 Flash · Bright Data · ArcGIS · Leaflet.js</p>
              <p>Built to empower citizens with real-time, verified civic intelligence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
