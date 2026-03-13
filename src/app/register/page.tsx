"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { checkGeofence, registerUser, MONTGOMERY_COORDS } from '@/lib/auth';

type GeoStatus = 'sensing' | 'in-city' | 'out-city' | 'error';

export default function RegisterPage() {
  const router = useRouter();
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('sensing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin]           = useState('');
  const [displayPin, setDisplayPin] = useState('');
  const pinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading]   = useState(false);

  const [regMode, setRegMode] = useState<'anonymous' | 'stakeholder'>('anonymous');
  const [email, setEmail]       = useState('');
  const [actualName, setActualName] = useState('');

  // Simulated backend check for Geofence
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const isLocal = checkGeofence(pos.coords.latitude, pos.coords.longitude);
        setGeoStatus(isLocal ? 'in-city' : 'out-city');
      },
      () => setGeoStatus('error'),
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const handleDemoOverride = () => {
    setGeoStatus('in-city'); // Bypass for hackathon judges
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (regMode === 'stakeholder' && (!email || !email.includes('@'))) {
      setErrorMsg('A valid email is required for Stakeholder verification.');
      return;
    }
    if (regMode === 'stakeholder' && (!actualName || actualName.trim().length < 2)) {
      setErrorMsg('Actual Name is required for Stakeholder verification.');
      return;
    }
    if (regMode === 'anonymous' && (pin.length !== 4 || !/^\d+$/.test(pin))) {
      setErrorMsg('Security PIN must be exactly 4 digits for Anonymous Accounts.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (username.length < 3) {
      setErrorMsg('Username must be at least 3 characters.');
      return;
    }

    setLoading(true);
    try {
      if (regMode === 'anonymous' && outOfCity) {
        setErrorMsg("Your location isn't allowed for such account. Please use an authenticated account.");
        setLoading(false);
        return;
      }

      // Small simulated network delay for realism
      await new Promise(r => setTimeout(r, 800));
      // For MVP, we ignore the email after "tracing" if Anonymous
      await registerUser(username, password, pin, email, actualName, regMode === 'anonymous');
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Handle deletion
    if (val.length < pin.length) {
      const newPin = pin.slice(0, val.length);
      setPin(newPin);
      setDisplayPin('•'.repeat(newPin.length));
      if (pinTimerRef.current) clearTimeout(pinTimerRef.current);
      return;
    }

    // Handle addition
    const lastChar = val.slice(-1);
    if (!/^\d$/.test(lastChar) || pin.length >= 4) return;

    const newPin = pin + lastChar;
    setPin(newPin);
    setDisplayPin('•'.repeat(pin.length) + lastChar);

    if (pinTimerRef.current) clearTimeout(pinTimerRef.current);
    pinTimerRef.current = setTimeout(() => {
      setDisplayPin('•'.repeat(newPin.length));
    }, 1000);
  };

  // UI mapping for the top status bar
  const geoBar = {
    'sensing':  { bg: '#fef3c7', fg: '#92400e', icon: '📡', text: 'Sensing Location...' },
    'in-city':  { bg: '#d1fae5', fg: '#065f46', icon: '📍', text: 'Montgomery Geofence Confirmed' },
    'out-city': { bg: '#fee2e2', fg: '#991b1b', icon: '🚫', text: 'Out of City / Geofence Failed' },
    'error':    { bg: '#fee2e2', fg: '#991b1b', icon: '⚠️', text: 'Location Access Denied' },
  }[geoStatus];

  const outOfCity = geoStatus === 'out-city' || geoStatus === 'error';

  // Auto-switch away from anonymous if out of city
  useEffect(() => {
    if (outOfCity && regMode === 'anonymous') {
      setRegMode('stakeholder');
    }
  }, [outOfCity, regMode]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f1ea', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(28,20,9,.08)', overflow: 'hidden' }}>
        
        {/* Geo Status Bar */}
        <div style={{ background: geoBar.bg, color: geoBar.fg, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>
          <span className={geoStatus === 'sensing' ? 'pulse' : ''}>{geoBar.icon}</span>
          {geoBar.text}
        </div>

        <div style={{ padding: '32px 32px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            {/* Logo Removed as per request */}
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 900, color: '#1c1409', marginBottom: 6 }}>Join GumpWiser</h1>
            <p style={{ fontFamily: "'Figtree',sans-serif", fontSize: 13, color: '#8a7c6a' }}>
              Select your identity pathway below.
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {errorMsg && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontFamily: "'Figtree',sans-serif", fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            {/* Path Toggle */}
            <div style={{ display: 'flex', background: '#f9f8f6', borderRadius: 12, padding: 4, marginBottom: 8, border: '1.5px solid #ebe6dc', opacity: outOfCity ? 0.8 : 1 }}>
              <button 
                type="button" 
                onClick={() => !outOfCity && setRegMode('anonymous')}
                disabled={outOfCity}
                style={{ 
                  flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', 
                  background: regMode === 'anonymous' ? '#fff' : 'transparent', 
                  boxShadow: regMode === 'anonymous' ? '0 2px 8px rgba(0,0,0,.05)' : 'none', 
                  color: regMode === 'anonymous' ? '#ff4422' : '#8a7c6a', 
                  fontFamily: "'Figtree',sans-serif", fontSize: 13, fontWeight: 700, 
                  cursor: outOfCity ? 'not-allowed' : 'pointer', 
                  transition: 'all .2s' 
                }}>
                Anonymous Local
              </button>
              <button 
                type="button" 
                onClick={() => setRegMode('stakeholder')}
                style={{ 
                  flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', 
                  background: regMode === 'stakeholder' ? '#fff' : 'transparent', 
                  boxShadow: regMode === 'stakeholder' ? '0 2px 8px rgba(0,0,0,.05)' : 'none', 
                  color: regMode === 'stakeholder' ? '#ff4422' : '#8a7c6a', 
                  fontFamily: "'Figtree',sans-serif", fontSize: 13, fontWeight: 700, 
                  cursor: 'pointer', 
                  transition: 'all .2s' 
                }}>
                Verified Stakeholder
              </button>
            </div>

            {/* If out of city, show tracking warning */}
            {outOfCity && (
              <div style={{ background: '#fef3c7', padding: '14px', borderRadius: 12, borderLeft: '4px solid #f0900a' }}>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 700, color: '#92400e', marginBottom: 6 }}>LOCATION OUT OF BOUNDS</div>
                <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>
                  You are registering from outside Montgomery. <strong>Anonymous Local</strong> nodes are restricted to city residents.<br/><br/>
                  Please use a <strong>Verified Stakeholder</strong> account to proceed.
                </div>
                <button type="button" onClick={handleDemoOverride} style={{ marginTop: 12, background: 'none', border: '1px underline #92400e', color: '#92400e', cursor: 'pointer', fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 600 }}>
                  [Demo Override to Montgomery]
                </button>
              </div>
            )}

            {/* Input fields */}
            <div style={{ transition: 'opacity 0.2s' }}>
              
              {regMode === 'stakeholder' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>OFFICIAL OR PARTNER EMAIL</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontFamily: "'Figtree',sans-serif", fontSize: 15, background: '#f9f8f6', outline: 'none' }} />
                  <div style={{ fontSize: 11, color: '#1c1409', fontWeight: 600, fontFamily: "'Figtree',sans-serif", marginTop: 6 }}>
                    Note: Kept securely as your primary identity and recovery method.
                  </div>
                </div>
              )}

              {regMode === 'stakeholder' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>ACTUAL NAME (Verified Display)</label>
                  <input type="text" required value={actualName} onChange={e => setActualName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontFamily: "'Figtree',sans-serif", fontSize: 15, background: '#f9f8f6', outline: 'none' }} />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>USERNAME (Public)</label>
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontFamily: "'Figtree',sans-serif", fontSize: 15, background: '#f9f8f6', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>PASSWORD</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontFamily: "'Figtree',sans-serif", fontSize: 15, background: '#f9f8f6', outline: 'none' }} />
              </div>

              {regMode === 'anonymous' && (
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>IMMUTABLE SECURITY PIN (4-Digits)</label>
                  <input type="text" maxLength={4} required value={displayPin} onChange={handlePinChange}
                    placeholder="••••"
                    style={{ width: '100%', padding: '14px', borderRadius: 10, border: '2px solid #1c1409', fontFamily: "'Fira Code',monospace", fontSize: 22, fontWeight: 700, letterSpacing: '8px', textAlign: 'center', background: '#fff', outline: 'none', color: '#ff4422' }} />
                  
                  <div style={{ background: '#fee2e2', padding: '10px', borderRadius: 8, marginTop: 10 }}>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 700, color: '#991b1b', marginBottom: 3 }}>CRITICAL WARNING</div>
                    <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 11, color: '#991b1b', lineHeight: 1.4 }}>
                      Your Security PIN is set only once and <strong>CANNOT</strong> be changed. It is required for all future password resets. Do not lose it.
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#ff4422,#f0900a)', color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Figtree',sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 4px 16px rgba(255,68,34,.3)' }}>
                {loading ? 'Generating Hash...' : `Create ${regMode === 'anonymous' ? 'Anonymous Node' : 'Stakeholder'} Account`}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid #ebe6dc' }}>
            <span style={{ fontFamily: "'Figtree',sans-serif", fontSize: 13, color: '#8a7c6a' }}>Already have an account? </span>
            <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: '#ff4422', fontFamily: "'Figtree',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Secure Login
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .pulse { animation: p 1.5s infinite; display: inline-block; }
        @keyframes p { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}
