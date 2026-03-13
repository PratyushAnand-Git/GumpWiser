"use client";

import { useEffect, useRef } from 'react';
import { FEED_DATA, VERDICT_MAP, type FeedItem } from '@/lib/dashboardData';

interface LiveTickerProps {
  /** Extra items prepended at runtime (e.g. newly analyzed rumors) */
  extraItems?: FeedItem[];
  onItemClick?: (txt: string) => void;
  label?: string;
}

export default function LiveTicker({ extraItems = [], onItemClick, label = 'SOCIAL PULSE LIVE' }: LiveTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const items = [...extraItems, ...FEED_DATA];

  // Rebuild the track whenever items change
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Duplicate for seamless loop
    const all = [...items, ...items];
    el.innerHTML = all
      .map(f => {
        const vm = VERDICT_MAP[f.v];
        const badge = f.v === 'v' ? '✅' : f.v === 'a' ? '🚫' : '⚠️';
        return `
        <span class="ti-item" data-txt="${encodeURIComponent(f.txt)}" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;flex-shrink:0;padding:0 4px">
          <span style="font-family:'Fira Code',monospace;font-size:9px;padding:2px 7px;border-radius:10px;font-weight:700;background:${vm.bg};color:${vm.fg}">${badge} ${f.sc}%</span>
          <span style="font-family:'Fira Code',monospace;font-size:9px;color:rgba(255,255,255,.45)">${f.src}</span>
          <span style="font-size:12px;color:rgba(255,255,255,.7);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.txt.slice(0, 72)}</span>
        </span>`;
      })
      .join('<span style="color:rgba(255,255,255,.2);padding:0 16px;flex-shrink:0">·</span>');

    // Attach click handlers
    el.querySelectorAll<HTMLElement>('.ti-item').forEach(el => {
      el.onclick = () => {
        const txt = decodeURIComponent(el.dataset.txt || '');
        onItemClick?.(txt);
      };
      el.onmouseenter = () => { el.style.opacity = '.8'; };
      el.onmouseleave = () => { el.style.opacity = '1'; };
    });
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      background: '#1c1409', borderRadius: 18, height: 42,
      display: 'flex', alignItems: 'center', overflow: 'hidden',
      marginBottom: 20, position: 'relative', flexShrink: 0,
    }}>
      {/* Label */}
      <div style={{
        padding: '0 14px', background: 'linear-gradient(90deg,#ff4422,#f0900a)',
        color: '#fff', fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 600,
        whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
        height: '100%', flexShrink: 0,
      }}>
        {label}
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 2s infinite' }} />
      </div>

      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          ref={trackRef}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 32,
            animation: 'tickerScroll 44s linear infinite',
            whiteSpace: 'nowrap', padding: '0 16px',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'; }}
        />
      </div>

      {/* Fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 70, pointerEvents: 'none',
        background: 'linear-gradient(90deg,transparent,#1c1409)',
      }} />

      <style>{`
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 6px #5cb800} 50%{box-shadow:0 0 14px #5cb800,0 0 24px #5cb800} }
      `}</style>
    </div>
  );
}
