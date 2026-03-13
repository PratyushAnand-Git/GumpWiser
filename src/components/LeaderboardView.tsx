"use client";
import { useState, useEffect } from 'react';
import { getSessionProfile } from '@/lib/auth';

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc',
  padding: '13px 16px', boxShadow: '0 2px 16px rgba(28,20,9,.07)',
};
const pill = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
  padding: '4px 11px', borderRadius: 20, background: bg, color: fg,
});

const LB = [
  { rank: 1, name: 'CivicHero_Monty', meta: 'District 5 · 47 reports', pts: 2840, acc: '94%', badges: ['🏅','🌟','⚡'], grad: 'linear-gradient(135deg,#f0900a,#e85c00)' },
  { rank: 2, name: 'Rosa_Reports',    meta: 'Downtown · 38 reports',   pts: 2410, acc: '91%', badges: ['🏅','🌟'], grad: 'linear-gradient(135deg,#8a7c6a,#ddd8ce)' },
  { rank: 3, name: 'MontgomeryWatch', meta: 'North · 33 reports',      pts: 2180, acc: '89%', badges: ['🏅','📍'], grad: 'linear-gradient(135deg,#cd7c2f,#f0900a)' },
  { rank: 4, name: 'AlabamaAlerts',   meta: 'East Side · 29 reports',  pts: 1920, acc: '87%', badges: ['📍'], grad: 'linear-gradient(135deg,#3f3ad4,#6b21e8)' },
  { rank: 5, name: 'PerryStPatrol',   meta: 'Downtown · 24 reports',   pts: 1650, acc: '85%', badges: ['⚡'], grad: 'linear-gradient(135deg,#009980,#5cb800)' },
  { rank: 6, name: 'OakParkOscar',    meta: 'Parks · 21 reports',      pts: 1440, acc: '83%', badges: [], grad: 'linear-gradient(135deg,#0099dd,#3f3ad4)' },
  { rank: 7, name: '311_Champion',    meta: 'South Montg. · 19 reports',pts: 1280, acc: '88%', badges: ['🌟'], grad: 'linear-gradient(135deg,#ff4422,#e8184f)' },
  { rank: 8, name: 'TruthInMontgom', meta: 'West Side · 16 reports',   pts: 1100, acc: '80%', badges: [], grad: 'linear-gradient(135deg,#6b21e8,#0099dd)' },
];

const STAT_ROW = [
  { label: 'Reports Submitted', val: '84',  color: '#3f3ad4' },
  { label: 'Verified',           val: '67',  color: '#009980' },
  { label: 'Flagged as False',   val: '17',  color: '#ff4422' },
  { label: 'New Contributors',   val: '23',  color: '#f0900a' },
];

export default function LeaderboardView({ refreshKey = 0 }: { refreshKey?: number }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setProfile(getSessionProfile());
  }, [refreshKey]);

  // Merge user into leaderboard if they exist and have analyzed
  const displayLB = [...LB];
  if (profile && profile.analysis_count > 0) {
    const accuracy = profile.analysis_count > 0 
      ? Math.round((profile.verified_count / profile.analysis_count) * 100) 
      : 85;
    
    // Check if user is already in LB (simulation would usually have them higher)
    // For demo, we just add the 'You' entry if they have significant activity
    const userEntry = {
      rank: 9, // For demo, let's say they're 9th or based on pts
      name: `${profile.username} (You)`,
      meta: `Personal · ${profile.analysis_count} reports`,
      pts: profile.analysis_count * 50 + profile.verified_count * 100, // Weighted score
      acc: `${accuracy}%`,
      badges: profile.verified_count >= 5 ? ['🏅'] : [],
      grad: profile.session_type === 'verified_stakeholder' 
        ? 'linear-gradient(135deg,#3f3ad4,#6b21e8)' 
        : 'linear-gradient(135deg,#8a7c6a,#1c1409)',
      isUser: true
    };
    displayLB.push(userEntry);
    // Sort by points
    displayLB.sort((a, b) => b.pts - a.pts);
    // Re-assign ranks
    displayLB.forEach((p, i) => p.rank = i + 1);
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, borderRadius: 18 }}>
        <div style={{ fontSize: 28, width: 52, height: 52, background: '#f5f1ea', borderRadius: 14, display: 'grid', placeItems: 'center', border: '2px solid #ebe6dc', flexShrink: 0 }}>🏆</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>Top Reporters</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>Community contributors ranked by accuracy + civic impact</div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ ...pill('rgba(240,144,10,.12)', '#f0900a') }}>142 Contributors</span>
          <span style={{ ...pill('#d1fae5', '#065f46') }}>↑ 23 new this week</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Leaderboard list */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>Community Leaderboard</span>
            <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Fira Code',monospace", color: '#8a7c6a' }}>ACCURACY × VOLUME</span>
          </div>

          {displayLB.map(p => {
            const isTop = p.rank <= 3;
            const isUser = (p as any).isUser;
            const borderColor = isUser ? '#3f3ad4' : (p.rank === 1 ? '#f0900a' : p.rank === 2 ? '#ddd8ce' : p.rank === 3 ? '#cd7c2f' : '#ebe6dc');
            const initials = p.name.slice(0, 2).toUpperCase();
            const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : p.rank;
            return (
              <div key={p.rank} style={{
                ...card, display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 9, borderColor, transition: 'transform .15s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: typeof medal === 'number' ? 15 : 22, fontWeight: 900, width: 36, textAlign: 'center', flexShrink: 0 }}>{medal}</div>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: p.grad, display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#8a7c6a', fontFamily: "'Fira Code',monospace" }}>{p.meta}</div>
                  {p.badges.length > 0 && <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>{p.badges.map(b => <span key={b} style={{ fontSize: 14 }}>{b}</span>)}</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, color: '#3f3ad4' }}>{p.pts.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: '#009980', fontWeight: 700 }}>✅ {p.acc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>🎖️ Badges Earned</div>
            {[
              { ico: '🏅', name: 'Truth Seeker',      desc: '5+ verified reports'         },
              { ico: '🌟', name: 'Civic Champion',     desc: '90%+ accuracy rate'          },
              { ico: '⚡', name: 'First Responder',    desc: 'First to report incident'    },
              { ico: '📍', name: 'District Guardian',  desc: '10+ reports in one district' },
            ].map(({ ico, name, desc }) => (
              <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{ico}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#8a7c6a' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📈 This Week</div>
            {STAT_ROW.map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1.5px solid #f5f1ea', fontSize: 12 }}>
                <span style={{ color: '#8a7c6a', fontWeight: 600 }}>{label}</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 900, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
