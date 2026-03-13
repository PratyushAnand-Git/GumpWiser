"use client";

import { useState, useEffect } from 'react';
import { SOURCES_COL, VERDICT_MAP, type Verdict } from '@/lib/dashboardData';

type FilterTab = 'all' | 'civic' | 'safety' | 'hot';

const CIVIC_CATS  = new Set(['Civic','Roads','Utilities','Parks','Sanitation','Community']);
const SAFETY_CATS = new Set(['Safety','Emergency']);

interface FeedGridProps {
  onItemClick: (txt: string) => void;
}

export default function FeedGrid({ onItemClick }: FeedGridProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const { getSessionProfile } = require('@/lib/auth');
    setProfile(getSessionProfile());
  }, []);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all',    label: 'All'     },
    { key: 'civic',  label: 'Civic'   },
    { key: 'safety', label: 'Safety'  },
    { key: 'hot',    label: '🔥 Hot'  },
  ];

  const filterItems = (items: typeof SOURCES_COL[0]['items']) => {
    let out = [...items];
    if (activeTab === 'civic')  out = out.filter(i => CIVIC_CATS.has(i.cat));
    if (activeTab === 'safety') out = out.filter(i => SAFETY_CATS.has(i.cat));
    if (activeTab === 'hot')    out = [...out].sort((a, b) => b.sc - a.sc);
    return out;
  };

  const VBadge = ({ v, sc }: { v: Verdict; sc: number }) => {
    const vm = VERDICT_MAP[v];
    const icon = v === 'v' ? '✅' : v === 'a' ? '🚫' : '⚠️';
    return (
      <span style={{
        fontFamily: "'Fira Code',monospace", fontSize: 8, fontWeight: 700,
        padding: '2px 6px', borderRadius: 6, background: vm.bg, color: vm.fg,
        display: 'inline-block',
      }}>
        {icon} {sc}% {v === 'v' ? 'VERIFIED' : v === 'a' ? 'ALERT' : 'CAUTION'}
      </span>
    );
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: '#1c1409' }}>Live Social Feed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Bright Data · Montgomery Signals
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                background: activeTab === t.key ? '#1c1409' : '#ebe6dc',
                color: activeTab === t.key ? '#fff' : '#3a2f1e',
                border: 'none', borderRadius: 8, padding: '4px 10px',
                fontFamily: "'Figtree',sans-serif", fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'all .15s',
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {SOURCES_COL.map(col => {
          const items = filterItems(col.items);
          return (
            <div key={col.key} style={{
              background: '#fff', borderRadius: 14,
              boxShadow: '0 2px 16px rgba(28,20,9,.07)', overflow: 'hidden',
            }}>
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderBottom: '1px solid #ebe6dc',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#1c1409', fontFamily: "'Figtree',sans-serif" }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot }} />
                  {col.label}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: "'Fira Code',monospace", fontSize: 8, color: '#8a7c6a',
                  background: '#f5f1ea', borderRadius: 6, padding: '2px 6px',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: col.dot, animation: 'pulse 2s infinite' }} />
                  LIVE · {items.length}
                </div>
              </div>

              {/* Items list — scrollable with styled scrollbar */}
              <div className="feed-col-scroll" style={{ height: 260, overflowY: 'scroll' }}>
                {items.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 11, color: '#8a7c6a', textAlign: 'center', fontFamily: "'Figtree',sans-serif" }}>
                    No items in this category
                  </div>
                ) : items.map((item, i) => (
                  <div key={i}
                    onClick={() => onItemClick(item.txt)}
                    style={{
                      padding: '8px 12px', borderBottom: i < items.length - 1 ? '1px solid #f5f1ea' : 'none',
                      cursor: 'pointer', transition: 'background .12s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f5f1ea'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  >
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: '#8a7c6a', marginBottom: 3 }}>
                      {item.time} ago · {item.cat}
                    </div>
                    <div style={{ fontSize: 11.5, lineHeight: 1.4, color: '#3a2f1e', marginBottom: 4, fontFamily: "'Figtree',sans-serif" }}>
                      {item.txt}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <VBadge v={item.v} sc={item.sc} />
                      {profile && profile.session_type === 'verified_stakeholder' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert(`Refute Interface Triggered!\nAs a Verified Stakeholder (${profile.actual_name}), you can contest this claim.`); }}
                          style={{
                            background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 6, padding: '2px 6px',
                            fontFamily: "'Fira Code',monospace", fontSize: 8, fontWeight: 700, cursor: 'pointer', transition: 'all 0.1s'
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fecaca'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fee2e2'}
                        >
                          REFUTE
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .feed-col-scroll::-webkit-scrollbar { width: 5px; }
        .feed-col-scroll::-webkit-scrollbar-track { background: #f5f1ea; border-radius: 3px; }
        .feed-col-scroll::-webkit-scrollbar-thumb { background: #ddd8ce; border-radius: 3px; }
        .feed-col-scroll::-webkit-scrollbar-thumb:hover { background: #bbb3a8; }
      `}</style>
    </div>
  );
}
