"use client";

import { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ToastCtx {
  toast: (icon: string, msg: string) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [icon, setIcon] = useState('');
  const [msg, setMsg]  = useState('');
  const timer = useRef<NodeJS.Timeout | null>(null);

  const toast = useCallback((ico: string, message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setIcon(ico); setMsg(message); setVisible(true);
    timer.current = setTimeout(() => setVisible(false), 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast element */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 10000,
        background: '#1c1409', color: '#fff', borderRadius: 14,
        padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 40px rgba(28,20,9,.3)', fontSize: 13, fontWeight: 500,
        fontFamily: "'Figtree',sans-serif", maxWidth: 360,
        transform: visible ? 'translateY(0)' : 'translateY(100px)',
        opacity: visible ? 1 : 0,
        transition: 'transform .35s cubic-bezier(.34,1.56,.64,1), opacity .25s',
        pointerEvents: visible ? 'auto' : 'none',
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ flex: 1 }}>{msg}</span>
        <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}>✕</button>
      </div>
    </ToastContext.Provider>
  );
}
