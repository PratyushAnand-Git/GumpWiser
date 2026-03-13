"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, resetPassword, requestOTP, verifyOTP } from '@/lib/auth';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading]   = useState(false);

  // Recovery Modal State
  const [showForgot, setShowForgot] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Select Type, 2: Verification, 3: New Password
  const [accountType, setAccountType]   = useState<'anonymous' | 'authenticated' | ''>('');
  
  // Recovery Fields
  const [fUser, setFUser]       = useState('');
  const [fPin, setFPin]         = useState('');
  const [fEmail, setFEmail]     = useState('');
  const [fOtp, setFOtp]         = useState('');
  const [otpSent, setOtpSent]   = useState(false);
  const [fNewPass, setFNewPass] = useState('');
  const [fConfirmPass, setFConfirmPass] = useState('');
  
  const [fError, setFError]     = useState('');
  const [fLoading, setFLoading] = useState(false);
  const [fSuccess, setFSuccess] = useState(false);

  useEffect(() => {
    // Session is already checked by page.tsx
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 800)); // Demo delay
      await loginUser(username, password);
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!fEmail.includes('@')) { setFError('Valid email is required.'); return; }
    setFLoading(true);
    try {
      await requestOTP(fEmail);
      setOtpSent(true);
      setFError('');
    } catch (err: any) {
      setFError(err.message || 'Failed to send OTP.');
    } finally {
      setFLoading(false);
    }
  };

  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setFError('');
    setFLoading(true);
    try {
      if (accountType === 'anonymous') {
        if (fPin.length !== 4) throw new Error('4-Digit PIN is required.');
        // Verify PIN by attempting a pseudo-reset or just check if user exists
        // For demo, we just proceed to step 3 if local check passes
        setRecoveryStep(3);
      } else {
        await verifyOTP(fEmail, fOtp);
        setRecoveryStep(3);
      }
    } catch (err: any) {
      setFError(err.message || 'Verification failed.');
    } finally {
      setFLoading(false);
    }
  };

  const handleFinalReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fNewPass !== fConfirmPass) {
      setFError('Passwords do not match.');
      return;
    }
    if (fNewPass.length < 6) {
      setFError('Password must be at least 6 characters.');
      return;
    }

    setFLoading(true);
    try {
      const secret = accountType === 'anonymous' ? fPin : fEmail;
      await resetPassword(fUser, fNewPass, secret);
      setFSuccess(true);
      setTimeout(() => {
        setShowForgot(false);
        // Reset recovery state
        setRecoveryStep(1);
        setAccountType('');
        setFSuccess(false);
      }, 2000);
    } catch (err: any) {
      setFError(err.message || 'Reset failed.');
    } finally {
      setFLoading(false);
    }
  };


  return (
    <div style={{ minHeight: '100vh', background: '#f5f1ea', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      
      {/* Main Login Card */}
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(28,20,9,.08)', padding: '48px 32px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Logo size={64} />
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 900, color: '#1c1409', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Anonymous Local Node
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {errorMsg && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontFamily: "'Figtree',sans-serif", fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 8 }}>USERNAME</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid #ebe6dc', fontFamily: "'Figtree',sans-serif", fontSize: 15, background: '#f9f8f6', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 8 }}>PASSWORD</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid #ebe6dc', fontFamily: "'Figtree',sans-serif", fontSize: 15, background: '#f9f8f6', outline: 'none', marginBottom: 8 }} />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setShowForgot(true); setFUser(username); setRecoveryStep(1); }}
                style={{ background: 'none', border: 'none', color: '#ff4422', fontFamily: "'Figtree',sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Forgot Password?
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '16px', marginTop: 8, background: 'linear-gradient(135deg,#ff4422,#f0900a)', color: '#fff', border: 'none', borderRadius: 14, fontFamily: "'Figtree',sans-serif", fontSize: 16, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', boxShadow: '0 4px 16px rgba(255,68,34,.3)', transition: 'transform .1s' }}>
            {loading ? 'Decrypting...' : 'Secure Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button 
            type="button" 
            onClick={async () => {
              setLoading(true);
              try {
                const { registerUser } = await import('@/lib/auth');
                const testUser = `DemoUser_${Math.floor(Math.random() * 1000)}`;
                await registerUser(testUser, 'password123', '', 'judge@hackathon.com', 'Hackathon Judge', false);
                router.push('/');
              } catch (err: any) {
                setErrorMsg(err.message || 'Fast login failed');
                setLoading(false);
              }
            }}
            disabled={loading}
            style={{ padding: '8px 16px', background: '#f5f1ea', color: '#1c1409', border: '1px solid #ebe6dc', borderRadius: 8, fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
            ⚡ 1-Click Fast Login (Demo)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 28, borderTop: '1px solid #ebe6dc' }}>
          <span style={{ fontFamily: "'Figtree',sans-serif", fontSize: 14, color: '#8a7c6a' }}>New to GumpWiser? </span>
          <button onClick={() => router.push('/register')} style={{ background: 'none', border: 'none', color: '#ff4422', fontFamily: "'Figtree',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Create an Account
          </button>
        </div>
      </div>

      {/* ── Bifurcated Recovery Modal ── */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,20,9,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 100 }}>
          <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 24, padding: '36px', boxShadow: '0 12px 48px rgba(0,0,0,.15)', position: 'relative' }}>
            
            <button onClick={() => setShowForgot(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#f5f1ea', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18, color: '#8a7c6a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>

            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 900, color: '#1c1409', marginBottom: 8 }}>Account Recovery</h2>
            <p style={{ fontFamily: "'Figtree',sans-serif", fontSize: 13, color: '#8a7c6a', marginBottom: 24 }}>
              Follow the steps to reset your password based on your account type.
            </p>

            {fSuccess ? (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '24px', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Password Reset Successfully</div>
                <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 13 }}>You can now login with your new credentials.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {fError && (
                  <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: 10, fontSize: 12, fontFamily: "'Fira Code',monospace", fontWeight: 700 }}>
                    {fError}
                  </div>
                )}

                {/* STEP 1: Select Type */}
                {recoveryStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600 }}>SELECT ACCOUNT TYPE</label>
                    <select 
                      value={accountType} 
                      onChange={(e) => setAccountType(e.target.value as any)}
                      style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #ebe6dc', background: '#fff', fontSize: 14 }}
                    >
                      <option value="">-- Choose Type --</option>
                      <option value="anonymous">Anonymous Account (PIN)</option>
                      <option value="authenticated">Authenticated Account (Email/OTP)</option>
                    </select>
                    {accountType && (
                      <button 
                        onClick={() => setRecoveryStep(2)}
                        style={{ width: '100%', padding: '14px', marginTop: 8, background: '#1c1409', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Continue
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 2: Identity Verification */}
                {recoveryStep === 2 && (
                  <form onSubmit={handleVerifyIdentity} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>USERNAME</label>
                      <input type="text" required value={fUser} onChange={e => setFUser(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontSize: 14, outline: 'none' }} />
                    </div>

                    {accountType === 'anonymous' ? (
                      <div>
                        <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>4-DIGIT PIN</label>
                        <input type="text" maxLength={4} required value={fPin} onChange={e => setFPin(e.target.value)}
                          placeholder="••••"
                          style={{ width: '100%', padding: '12px', borderRadius: 10, border: '2px solid #1c1409', fontFamily: "'Fira Code',monospace", fontSize: 18, fontWeight: 700, textAlign: 'center', outline: 'none', color: '#ff4422' }} />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>RECOVERY EMAIL</label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input type="email" required value={fEmail} onChange={e => setFEmail(e.target.value)}
                              style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontSize: 14, outline: 'none' }} />
                            <button type="button" onClick={handleSendOTP} disabled={fLoading}
                              style={{ padding: '0 16px', background: '#f0900a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                              {otpSent ? 'Resend' : 'Send OTP'}
                            </button>
                          </div>
                        </div>
                        {otpSent && (
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>ENTER 6-DIGIT OTP</label>
                            <input type="text" maxLength={6} required value={fOtp} onChange={e => setFOtp(e.target.value)}
                              placeholder="000000"
                              style={{ width: '100%', padding: '12px', borderRadius: 10, border: '2px solid #1c1409', fontFamily: "'Fira Code',monospace", fontSize: 18, fontWeight: 700, textAlign: 'center', outline: 'none' }} />
                          </div>
                        )}
                      </div>
                    )}

                    <button type="submit" disabled={fLoading}
                      style={{ width: '100%', padding: '14px', marginTop: 8, background: '#1c1409', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700 }}>
                      {fLoading ? 'Checking...' : 'Verify Identity'}
                    </button>
                    <button type="button" onClick={() => setRecoveryStep(1)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#8a7c6a', fontWeight: 600 }}>Back</button>
                  </form>
                )}

                {/* STEP 3: Password Update */}
                {recoveryStep === 3 && (
                  <form onSubmit={handleFinalReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>NEW PASSWORD</label>
                      <input type="password" required value={fNewPass} onChange={e => setFNewPass(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', fontWeight: 600, paddingBottom: 6 }}>CONFIRM PASSWORD</label>
                      <input type="password" required value={fConfirmPass} onChange={e => setFConfirmPass(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #ebe6dc', fontSize: 14, outline: 'none' }} />
                    </div>
                    <button type="submit" disabled={fLoading}
                      style={{ width: '100%', padding: '14px', marginTop: 8, background: 'linear-gradient(135deg,#ff4422,#f0900a)', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700 }}>
                      {fLoading ? 'Updating Vault...' : 'Reset Password'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
