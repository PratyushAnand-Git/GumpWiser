"use client";
import dynamic from 'next/dynamic';

import { useRef, useState, useEffect } from 'react';

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { ssr: false }
) as React.ComponentType<{ 
  mapHeight?: number; 
  onMarkerClick?: (id: string, lat: number, lng: number) => void;
  activeMarkerId?: string | null;
}>;

const pill = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
  padding: '4px 11px', borderRadius: 20, background: bg, color: fg,
});
const card: React.CSSProperties = {
  background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc',
  padding: '13px 16px', boxShadow: '0 2px 16px rgba(28,20,9,.07)',
};

const ALL_INCIDENTS = [
  { lat: 32.3612, lng: -86.3095, ico: '🔥', bg: 'rgba(255,68,34,.1)',  title: 'Structure Fire',          detail: '1240 Mobile Hwy · 4 units dispatched', typeLabel: '🔴 EMERGENCY', bc: '#ff4422', sb: '#fee2e2', sf: '#991b1b', t: '4 min ago'  },
  { lat: 32.3780, lng: -86.2951, ico: '🚑', bg: 'rgba(0,153,128,.1)',  title: 'Medical Emergency',        detail: 'Oak Park Drive · 1 unit',              typeLabel: '🔴 EMERGENCY', bc: '#ff4422', sb: '#fee2e2', sf: '#991b1b', t: '11 min ago' },
  { lat: 32.3550, lng: -86.2720, ico: '👮', bg: 'rgba(14,165,233,.1)', title: 'Traffic Incident',         detail: 'I-85 N @ Exit 6 · 2 units',            typeLabel: '🔴 EMERGENCY', bc: '#ff4422', sb: '#fee2e2', sf: '#991b1b', t: '19 min ago' },
  { lat: 32.3650, lng: -86.3120, ico: '⚠️', bg: 'rgba(240,144,10,.1)', title: 'Unverified: Sinkhole',     detail: 'Mobile Hwy near Publix — 9%',          typeLabel: '🟡 UNVERIFIED',bc: '#f0900a', sb: '#fef3c7', sf: '#92400e', t: '8 min ago'  },
  { lat: 32.3700, lng: -86.2860, ico: '⚠️', bg: 'rgba(240,144,10,.1)', title: 'Unverified: Downtown Close',detail: 'All parking shut down — 15%',          typeLabel: '🟡 UNVERIFIED',bc: '#f0900a', sb: '#fef3c7', sf: '#92400e', t: '14 min ago' },
  { lat: 32.3810, lng: -86.3050, ico: '⚠️', bg: 'rgba(240,144,10,.1)', title: 'Unverified: Flooding',     detail: 'Rosa Parks Museum area — 18%',         typeLabel: '🟡 UNVERIFIED',bc: '#f0900a', sb: '#fef3c7', sf: '#92400e', t: '22 min ago' },
  { lat: 32.3738, lng: -86.2938, ico: '✅', bg: 'rgba(0,153,128,.1)',  title: 'Pothole Repair Crew',      detail: 'Perry St · 311 Confirmed · 88%',       typeLabel: '🟢 VERIFIED',  bc: '#009980', sb: '#d1fae5', sf: '#065f46', t: '12 min ago' },
  { lat: 32.3820, lng: -86.3100, ico: '✅', bg: 'rgba(0,153,128,.1)',  title: 'Park Cleanup Event',        detail: 'Oak Park · 9am–noon · 96%',            typeLabel: '🟢 VERIFIED',  bc: '#009980', sb: '#d1fae5', sf: '#065f46', t: '18 min ago' },
  { lat: 32.3580, lng: -86.2990, ico: '✅', bg: 'rgba(0,153,128,.1)',  title: 'Power Restoration',         detail: 'Ann St · APC confirmed · 74%',         typeLabel: '🟢 VERIFIED',  bc: '#009980', sb: '#d1fae5', sf: '#065f46', t: '30 min ago' },
  { lat: 32.3680, lng: -86.2780, ico: '✅', bg: 'rgba(0,153,128,.1)',  title: 'Trash Pickup Delay',        detail: 'District 5 · 311 confirmed · 84%',     typeLabel: '🟢 VERIFIED',  bc: '#009980', sb: '#d1fae5', sf: '#065f46', t: '45 min ago' },
];

export default function IncidentMapFullView() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // When a map marker is clicked
  const handleMarkerClick = (id: string) => {
    setActiveId(id);
    // Scroll to the corresponding card
    const cardEl = cardRefs.current[id];
    if (cardEl && containerRef.current) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Clear highlight after 1 second
    setTimeout(() => {
      setActiveId(current => current === id ? null : current);
    }, 1000);
  };

  // When "IN MAP" button on a card is clicked
  const handleInMapClick = (e: React.MouseEvent, lat: number, lng: number) => {
    e.stopPropagation();
    const id = `${lat}-${lng}`;
    setActiveId(id);
    
    // Scroll back up to the map
    if (mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Clear highlight after 1 second
    setTimeout(() => {
      setActiveId(current => current === id ? null : current);
    }, 1000);
  };

  return (
    <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ background: '#fff', borderRadius: 18, border: '2px solid #ebe6dc', padding: '18px 22px', marginBottom: 20, boxShadow: '0 2px 16px rgba(28,20,9,.07)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>Incident Map</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>Live overlay — Montgomery metro area · OpenStreetMap + ArcGIS Open Data</div>
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <span style={{ ...pill('rgba(255,68,34,.12)', '#ff4422') }}>🔴 3 Emergency</span>
          <span style={{ ...pill('rgba(240,144,10,.12)', '#f0900a') }}>🟡 3 Rumors</span>
          <span style={{ ...pill('rgba(0,153,128,.12)', '#009980') }}>🟢 4 Verified</span>
          <span style={{ ...pill('rgba(107,114,128,.12)', '#6b7280') }}>⬛ 4 Restricted</span>
        </div>
      </div>

      {/* Reuse the shared MapComponent (with taller height) */}
      <div ref={mapContainerRef} style={{ marginBottom: 22, scrollMarginTop: 20 }}>
        <MapComponent 
          mapHeight={500} 
          onMarkerClick={handleMarkerClick}
          activeMarkerId={activeId}
        />
      </div>

      {/* Incident grid */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>All Incidents</span>
        <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Fira Code',monospace", color: '#8a7c6a' }}>LIVE · MONTGOMERY METRO</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {ALL_INCIDENTS.map((x, i) => {
          const id = `${x.lat}-${x.lng}`;
          const isHighlighted = activeId === id;
          
          return (
            <div 
              key={i} 
              ref={(el) => { cardRefs.current[id] = el; }} // Note: intentional mutation in render for simplicity in this file
              style={{
                ...card, 
                borderTop: `3px solid ${x.bc}`, 
                cursor: 'pointer', 
                transition: 'all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy pop animation
                ...(isHighlighted ? {
                  border: '5px double #ff9800', // Double orange boundary
                  boxShadow: '0 12px 35px rgba(255,152,0,.25)',
                  transform: 'scale(1.08)',
                  position: 'relative',
                  zIndex: 10
                } : {})
              }}
              onMouseEnter={e => { if (!isHighlighted) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(28,20,9,.13)'; } }}
              onMouseLeave={e => { if (!isHighlighted) { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 22, width: 40, height: 40, borderRadius: 11, background: x.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{x.ico}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{x.title}</div>
                  <div style={{ fontSize: 11, color: '#8a7c6a' }}>📍 {x.detail.split('·')[0].trim()}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#8a7c6a', marginBottom: 8 }}>{x.detail}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10.5, color: '#8a7c6a', fontFamily: "'Fira Code',monospace", flex: 1 }}>⏱ {x.t}</span>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Fira Code',monospace", padding: '2px 8px', borderRadius: 5, background: x.sb, color: x.sf }}>{x.typeLabel}</span>
                <button 
                  onClick={(e) => handleInMapClick(e, x.lat, x.lng)}
                  style={{
                    background: '#f5f1ea', border: '1px solid #ebe6dc', borderRadius: 5, padding: '2px 6px',
                    fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 700, color: '#1c1409',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3
                  }}
                >
                  📍 IN MAP
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
