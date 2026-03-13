import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { getSessionProfile, logoutUser, type UserAccount } from '@/lib/auth';

interface HeaderProps {
  viewTitle?: string;
  onSubmitRumor?: () => void;
}

export default function Header({ viewTitle = 'GumpWiser', onSubmitRumor }: HeaderProps) {
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(getSessionProfile());
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  return (
    <div style={{
      height: 60, background: '#fff', flexShrink: 0,
      borderBottom: '2px solid #ebe6dc',
      display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
        {/* View title intentionally left blank for a cleaner header */}
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 420, position: 'relative', margin: '0 8px' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8a7c6a', fontSize: 14 }}>🔎</div>
        <input
          type="text"
          style={{
            width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 7, paddingBottom: 7,
            background: '#f5f1ea', border: '1.5px solid #ebe6dc', borderRadius: 24,
            fontFamily: "'Figtree', sans-serif", fontSize: 13, outline: 'none', color: '#1c1409',
            transition: 'border .2s, background .2s',
          }}
          placeholder="Search rumors, streets, incidents…"
          onFocus={e => { e.target.style.borderColor = '#3f3ad4'; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = '#ebe6dc'; e.target.style.background = '#f5f1ea'; }}
        />
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', position: 'relative' }} ref={dropdownRef}>
        <button
          style={{
            background: 'none', border: '1.5px solid #ddd8ce', borderRadius: 24,
            padding: '6px 14px', fontFamily: "'Figtree', sans-serif", fontSize: 13, fontWeight: 600,
            cursor: 'pointer', color: '#3a2f1e', transition: 'all .15s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3f3ad4'; (e.currentTarget as HTMLButtonElement).style.color = '#3f3ad4'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ddd8ce'; (e.currentTarget as HTMLButtonElement).style.color = '#3a2f1e'; }}
        >
          ↻ Refresh
        </button>

        <button
          onClick={onSubmitRumor}
          style={{
            background: '#ff4422', color: '#fff', border: 'none', borderRadius: 24,
            padding: '7px 16px', fontFamily: "'Figtree', sans-serif", fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(255,68,34,.3)', transition: 'opacity .15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
        >
          + Submit Rumor
        </button>

        {/* Identity Card (Replaces Avatar) */}
        <div 
          onClick={() => {
            if (!showProfile) setProfile(getSessionProfile());
            setShowProfile(!showProfile);
          }}
          style={{
            padding: '4px 12px 4px 6px', borderRadius: 20, background: '#f5f1ea', border: '1.5px solid #ebe6dc',
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all .2s',
            userSelect: 'none'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff4422'; e.currentTarget.style.background = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebe6dc'; e.currentTarget.style.background = '#f5f1ea'; }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6b21e8,#3f3ad4)',
            color: '#fff', fontWeight: 800, fontSize: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {profile?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, fontWeight: 700, color: '#1c1409' }}>
            {profile?.username || 'User'}
          </span>
        </div>

        {/* Profile Dropdown Panel */}
        {showProfile && (
          <div style={{
            position: 'absolute', top: 48, right: 0, width: 280,
            background: '#fff', borderRadius: 16, border: '1.5px solid #ebe6dc',
            boxShadow: '0 12px 40px rgba(28,20,9,.15)', padding: '16px',
            animation: 'slideUp 0.2s ease-out'
          }}>
            <div style={{ borderBottom: '1px solid #f5f1ea', paddingBottom: 12, marginBottom: 12 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, color: '#1c1409' }}>User Profile</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: 12, color: '#8a7c6a' }}>Local Intelligence Node</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontFamily: "'Fira Code', monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px' }}>Authenticated Path</label>
                <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 700, color: '#ff4422' }}>
                  {profile?.session_type === 'anonymous_local' ? 'Anonymous Local Node' : 'Verified Stakeholder'}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "'Fira Code', monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Radius</label>
                <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 600, color: '#1c1409' }}>
                  Montgomery, Alabama
                </div>
              </div>

              <div style={{ background: '#f9f8f6', borderRadius: 10, padding: '10px', border: '1.5px solid #ebe6dc' }}>
                <label style={{ fontFamily: "'Fira Code', monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 4 }}>Activity Index</label>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 900, color: '#3f3ad4' }}>{profile?.analysis_count || 0}</span>
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: 12, color: '#8a7c6a', fontWeight: 600 }}>Personal Analyses</span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                style={{
                  marginTop: 6, padding: '10px', borderRadius: 10, background: '#fee2e2', color: '#991b1b', border: 'none',
                  fontFamily: "'Fira Code', monospace", fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
              >
                Terminate Session [×]
              </button>
            </div>

            <style>{`
              @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
