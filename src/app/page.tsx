"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { getSessionUsername } from '@/lib/auth';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const user = getSessionUsername();
    const splashSeen = sessionStorage.getItem('gump_splash_seen');

    if (!splashSeen) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        sessionStorage.setItem('gump_splash_seen', 'true');
        if (!user) {
          router.push('/login');
        } else {
          setAuthed(true);
          setLoading(false);
          setShowSplash(false);
        }
      }, 3200);
      return () => clearTimeout(timer);
    } else {
      if (!user) {
        router.push('/login');
      } else {
        setAuthed(true);
        setLoading(false);
      }
    }
  }, [router]);

  if (showSplash) return <SplashScreen />;

  if (loading || !authed) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f1ea', fontFamily: "'Fira Code',monospace", fontSize: 12, color: '#8a7c6a' }}>
        <span style={{ animation: 'pulse 1.5s infinite' }}>Verifying Local Node...</span>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </div>
    );
  }

  return (
    <main>
      <Dashboard />
    </main>
  );
}
