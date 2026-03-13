"use client";
import { useEffect, useState } from 'react';

const VALS = ['14.2K', '14.3K', '14.4K', '14.5K', '14.6K'];

export default function StatCards() {
  const [sigVal, setSigVal] = useState('14.4K');

  // Live social signals counter
  useEffect(() => {
    const id = setInterval(() => setSigVal(VALS[Math.floor(Math.random() * VALS.length)]), 4200 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  const cards = [
    { stripe: 'linear-gradient(90deg,#3f3ad4,#6b21e8)', label: 'Analyzed Today',      val: '247',  valColor: '#3f3ad4', trend: '↑ 18% vs yesterday',      trendColor: '#009980' },
    { stripe: 'linear-gradient(90deg,#009980,#5cb800)', label: 'Verified Facts',       val: '189',  valColor: '#009980', trend: '↑ 76% verification rate', trendColor: '#009980' },
    { stripe: 'linear-gradient(90deg,#ff4422,#e8184f)', label: 'Misinformation Caught', val: '58',  valColor: '#ff4422', trend: '⚠ 24% of claims false',   trendColor: '#ff4422' },
    { stripe: 'linear-gradient(90deg,#f0900a,#e85c00)', label: 'Social Signals',      val: sigVal, valColor: '#f0900a', trend: '↑ 5 sources active',       trendColor: '#009980' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 13 }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          background: '#fff', borderRadius: 18, padding: '18px',
          boxShadow: '0 2px 16px rgba(28,20,9,.07)',
          position: 'relative', overflow: 'hidden',
          transition: 'transform .15s, box-shadow .15s', cursor: 'default',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(28,20,9,.13)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(28,20,9,.07)'; }}
        >
          {/* Gradient stripe */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: c.stripe }} />

          <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, marginTop: 4 }}>
            {c.label}
          </div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 900, lineHeight: 1, marginBottom: 4, color: c.valColor, transition: 'color .3s' }}>
            {c.val}
          </div>
          <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: c.trendColor }}>
            {c.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
