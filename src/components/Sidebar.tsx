"use client";

import Logo from './Logo';

export type ViewId =
  | 'rumor-analyzer'
  | 'social-feed'
  | 'incident-map'
  | '911-pulse'
  | 'weather-alert'
  | '311-reports'
  | 'city-trends'
  | 'top-reporters'
  | 'settings';

interface SidebarProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}

const NAV = [
  {
    section: 'CORE',
    items: [
      { id: 'rumor-analyzer' as ViewId, label: 'Rumor Analyzer', badge: 'LIVE', badgeType: 'live' as const },
      { id: 'social-feed'    as ViewId, label: 'Social Feed' },
      { id: 'incident-map'   as ViewId, label: 'Incident Map' },
    ],
  },
  {
    section: 'PUBLIC SAFETY',
    items: [
      { id: '911-pulse'     as ViewId, label: '911 Pulse' },
      { id: 'weather-alert' as ViewId, label: 'Weather Alert' },
      { id: '311-reports'   as ViewId, label: '311 Reports'   },
    ],
  },
  {
    section: 'ANALYTICS',
    items: [
      { id: 'city-trends'    as ViewId, label: 'City Trends'    },
      { id: 'top-reporters'  as ViewId, label: 'Top Reporters'  },
      { id: 'settings'       as ViewId, label: 'Settings'       },
    ],
  },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-[220px] min-w-[220px] flex flex-col h-full overflow-hidden z-20"
      style={{ background: '#fffdf9', borderRight: '2px solid #ebe6dc' }}>

      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #ebe6dc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Logo size={36} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900, lineHeight: 1 }}>
            <span style={{ color: '#1c1409' }}>Gump</span>
            <span style={{ color: '#ff4422' }}>Wiser</span>
          </div>
        </div>
        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 9, color: '#8a7c6a', letterSpacing: '1.5px', textTransform: 'uppercase', lineHeight: 1.5 }}>
          Civic Intelligence ◆<br />Montgomery AL
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: "'Fira Code', monospace", fontSize: 9, color: '#3a2f1e',
              textTransform: 'uppercase', letterSpacing: '2px', padding: '0 8px 6px',
              fontWeight: 800,
            }}>
              {group.section}
            </div>
            {group.items.map(item => {
              const isActive = activeView === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 8px', borderRadius: 9, cursor: 'pointer', fontSize: 13,
                    fontWeight: isActive ? 700 : 500, marginBottom: 2,
                    color: isActive ? '#3f3ad4' : '#8a7c6a',
                    background: isActive
                      ? 'linear-gradient(135deg,rgba(63,58,212,.1),rgba(107,33,232,.07))'
                      : 'transparent',
                    border: isActive ? '1.5px solid rgba(63,58,212,.2)' : '1.5px solid transparent',
                    transition: 'all .15s',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = '#ebe6dc'; (e.currentTarget as HTMLDivElement).style.color = '#1c1409'; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = '#8a7c6a'; } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: "'Figtree', sans-serif" }}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      fontFamily: "'Fira Code', monospace", fontSize: 9, fontWeight: 600,
                      padding: '2px 6px', borderRadius: 20,
                      background: item.badgeType === 'live' ? '#009980' : '#ff4422',
                      color: '#fff', lineHeight: 1.4,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer status */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid #ebe6dc' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f5f1ea', border: '2px solid #ebe6dc',
          borderRadius: 10, padding: '8px 10px',
        }}>
          <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
            <div style={{
              width: 8, height: 8, background: '#5cb800', borderRadius: '50%',
              boxShadow: '0 0 6px #5cb800', animation: 'pulse 2s infinite',
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1c1409', fontFamily: "'Figtree',sans-serif" }}>
              Montgomery, AL
            </div>
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: '#8a7c6a' }}>
              ArcGIS ◆ Bright Data ◆ Gemini
            </div>
          </div>
        </div>

        {/* Global Logout */}
        <button
          onClick={() => {
            const { logoutUser } = require('@/lib/auth');
            logoutUser();
            window.location.href = '/register';
          }}
          style={{ width: '100%', padding: '6px 0', marginTop: 8, background: 'none', border: 'none', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#ff4422', fontWeight: 600, cursor: 'pointer', textAlign: 'center', borderTop: '1px dashed #ebe6dc' }}
        >
          [ END SESSION ]
        </button>
      </div>
    </div>
  );
}
