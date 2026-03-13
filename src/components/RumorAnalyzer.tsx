import { useState, useEffect, useRef } from 'react';
import { PRESETS, VERDICT_MAP, ALL_SOURCES } from '@/lib/dashboardData';
import { useToast } from './ToastProvider';
import { incrementAnalysisCount, getSessionProfile, type UserAccount } from '@/lib/auth';
import { getObjectionsByCategory, saveObjection, type Objection } from '@/lib/objections';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AnalysisResult {
  status:          'verified' | 'caution' | 'misinformation';
  score:           number;
  title:           string;
  message:         string;
  dataSource:      string;
  activeSources:   string[];
  socialSignals?:  { volume: number; sentiment: string; snippets: string[] };
  record311Count?: number;
  record911Count?: number;
  category?:       string;
}

// ─── Color map ────────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  verified:       '#009980',
  caution:        '#f0900a',
  misinformation: '#ff4422',
};
const STATUS_BG = {
  verified:       '#d1fae5',
  caution:        '#fef3c7',
  misinformation: '#fee2e2',
};
const STATUS_LABEL = {
  verified:       '✅ VERIFIED',
  caution:        '⚠️ CAUTION',
  misinformation: '🚫 ALERT',
};

// ─── SVG Score Ring ────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 40, circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (score / 100) * circ), 80);
    return () => clearTimeout(t);
  }, [score, circ]);
  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="7" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{score}%</span>
        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 7, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 2 }}>GUMP-SCORE</span>
      </div>
    </div>
  );
}

// ─── Animated signal bar ───────────────────────────────────────────────────────
function SigBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 120); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
      <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#8a7c6a', minWidth: 145 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${w}%`, height: '100%', borderRadius: 3, background: color, transition: 'width .8s ease' }} />
      </div>
      <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 700, color, minWidth: 30, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

// ─── Hover-reactive button ─────────────────────────────────────────────────────
function HoverBtn({ children, onClick, baseStyle, hoverStyle, disabled }: {
  children: React.ReactNode; onClick?: () => void;
  baseStyle: React.CSSProperties; hoverStyle: React.CSSProperties; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...(hov ? { ...baseStyle, ...hoverStyle } : baseStyle), transition: 'all .18s', cursor: disabled ? 'not-allowed' : 'pointer' }}
    >{children}</button>
  );
}

// ─── Source chip with hover/active animation ────────────────────────────────────
function SourceChip({ label, color, on, onClick }: { label: string; color: string; on: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const getIco = () => {
    if (label.includes('Twitter')) return <span style={{ marginRight: 4, fontWeight: 900 }}>𝕏</span>;
    if (label.includes('Reddit'))  return <span style={{ marginRight: 4, fontWeight: 700 }}>r/</span>;
    if (label.includes('Facebook')) return <svg style={{ width: 10, height: 10, marginRight: 4 }} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
    if (label.includes('Nextdoor')) return <span style={{ marginRight: 4, fontWeight: 900, fontSize: 9 }}>ND</span>;
    if (label === '311 Data') return <span style={{ marginRight: 4 }}>📞</span>;
    if (label === '911 Log') return <span style={{ marginRight: 4 }}>🚨</span>;
    return null;
  };
  return (
    <span onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 700,
        padding: '5px 11px', borderRadius: 20, cursor: 'pointer',
        border: `1.5px solid ${on ? color : '#ddd8ce'}`,
        background: on ? color : hov ? '#f5f1ea' : '#fff',
        color: on ? '#fff' : hov ? color : '#8a7c6a',
        transition: 'all .18s', userSelect: 'none',
        transform: hov ? 'translateY(-1px) scale(1.04)' : 'none',
        boxShadow: on ? `0 3px 12px ${color}44` : hov ? `0 2px 8px ${color}22` : 'none',
        display: 'inline-flex', alignItems: 'center'
      }}
    >{getIco()}{label}</span>
  );
}

// ─── Loading spinner ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.25)" strokeWidth="4"/>
      <path d="M4 12a8 8 0 0 1 8-8" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Live sensing pulse indicator ─────────────────────────────────────────────
function SensingBadge({ live }: { live: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: live ? 'rgba(63,58,212,.12)' : 'rgba(0,153,128,.1)',
      border: `1px solid ${live ? 'rgba(63,58,212,.3)' : 'rgba(0,153,128,.2)'}`,
      borderRadius: 20, padding: '4px 10px',
      fontFamily: "'Fira Code',monospace", fontSize: 9,
      color: live ? '#3f3ad4' : '#009980', fontWeight: 600,
      transition: 'all .3s',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: live ? '#3f3ad4' : '#009980',
        display: 'inline-block',
        animation: live ? 'pulseRing 1s infinite' : 'breathe 2s infinite',
      }} />
      {live ? 'ANALYZING…' : 'SENSING LIVE'}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
interface Props {
  preloadedText?: string;
  onNewResult?: (txt: string, verdict: string, score: number) => void;
}

export default function RumorAnalyzer({ preloadedText = '', onNewResult }: Props) {
  const { toast }      = useToast();
  const [profile, setProfile]   = useState<UserAccount | null>(null);
  const [rumor, setRumor]       = useState(preloadedText);
  const [focused, setFocused]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [phase, setPhase]       = useState('');           // "Fetching 311…" etc
  const [result, setResult]     = useState<AnalysisResult | null>(null);
  const [chips, setChips]       = useState(() => ALL_SOURCES.map(s => ({ ...s, on: true })));
  
  // Objection State
  const [showObjectionForm, setShowObjectionForm] = useState(false);
  const [objectionComment, setObjectionComment]   = useState('');
  const [objectionImage, setObjectionImage]       = useState<string | null>(null);
  const [activeObjections, setActiveObjections]   = useState<Objection[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(getSessionProfile());
  }, []);

  // Detect active category from rumor text (for keyword hint to API)
  const detectCategory = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes('sinkhole'))                   return 'sinkhole';
    if (t.includes('water main') || t.includes('leak') || t.includes('pipe')) return 'water main';
    if (t.includes('outage') || t.includes('power')) return 'outage';
    if (t.includes('road') || t.includes('closure') || t.includes('pothole')) return 'road closure';
    return '';
  };

  // Sync external preloaded text
  useEffect(() => {
    if (preloadedText) {
      setRumor(preloadedText);
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [preloadedText]);

  const toggleChip = (i: number) => {
    setChips(prev => {
      const n = prev.map((c, idx) => idx === i ? { ...c, on: !c.on } : c);
      if (n.every(c => !c.on)) return prev;      // always keep ≥1 on
      return n;
    });
    setResult(null);
  };

  const activeKeys   = chips.filter(c => c.on).map(c => c.key);
  const canAnalyze   = rumor.trim().length > 0 && !loading && activeKeys.length > 0;

  // ── Preset chip click → pre-fill + auto-analyze ──────────────────────────
  const handlePreset = async (text: string) => {
    setRumor(text);
    setResult(null);
    textareaRef.current?.focus();
    // Slight delay so textarea re-render settles, then auto-analyze
    setTimeout(() => triggerAnalyze(text), 350);
  };

  // ── Core analyze function ────────────────────────────────────────────────
  const triggerAnalyze = async (overrideText?: string) => {
    const text = (overrideText ?? rumor).trim();
    if (!text) { toast('⚠️', 'Please enter a rumor to analyze'); return; }
    if (activeKeys.length === 0) { toast('⚠️', 'Select at least one data source'); return; }

    setLoading(true);
    setResult(null);

    // Show progressive phases in the UI
    const src311 = activeKeys.includes('311');
    const src911 = activeKeys.includes('911');
    const srcSocial = ['twitter','reddit','facebook','nextdoor'].some(s => activeKeys.includes(s));

    const phases = [
      src311 ? '📡 Fetching Montgomery 311 records…' : null,
      src911 ? '🚨 Querying 911 CAD logs…' : null,
      srcSocial ? '🌐 Scraping social signals via Bright Data…' : null,
      '🧠 Gemini 1.5 Flash reasoning over evidence…',
      '📊 Computing Gump-Score™…',
    ].filter(Boolean) as string[];

    let phaseIdx = 0;
    setPhase(phases[0]);
    const phaseTimer = setInterval(() => {
      phaseIdx++;
      if (phaseIdx < phases.length) setPhase(phases[phaseIdx]);
    }, 1100);

    try {
      const cat = detectCategory(text);
      const res = await fetch('/api/factcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rumor: text,
          activeSources: activeKeys,
          category: cat,
        }),
      });

      clearInterval(phaseTimer);

      if (!res.ok) throw new Error(`API ${res.status}`);
      const data: AnalysisResult = await res.json();
      data.category = cat; // Assign detected category
      setResult(data);

      const isVerified = data.status === 'verified';
      incrementAnalysisCount(isVerified); // Track personal contribution with accuracy

      // Fetch objections for this category
      if (cat) {
        setActiveObjections(getObjectionsByCategory(cat));
      }

      const icon = data.status === 'verified' ? '✅' : data.status === 'caution' ? '⚠️' : '🚫';
      toast(icon, `Gump-Score: ${data.score}% — ${data.title}`);
      onNewResult?.(text, data.status, data.score);

    } catch (err) {
      clearInterval(phaseTimer);
      toast('❌', 'Analysis failed — check your connection and try again');
      console.error('[RumorAnalyzer] fetch error:', err);
    } finally {
      setLoading(false);
      setPhase('');
    }
  };

  const handleAnalyze = () => triggerAnalyze();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setObjectionImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleObjectionSubmit = () => {
    if (!result?.category || !objectionComment.trim()) return;
    const newObjection: Objection = {
      username: profile?.username || 'Verified User',
      comment: objectionComment,
      image: objectionImage || undefined,
      timestamp: Date.now(),
      category: result.category
    };
    saveObjection(newObjection);
    setActiveObjections(prev => [...prev, newObjection]);
    setShowObjectionForm(false);
    setObjectionComment('');
    setObjectionImage(null);
    toast('✅', 'Objection filed successfully');
  };

  // Ctrl/Cmd+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && document.activeElement === textareaRef.current) {
        handleAnalyze();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Derived display values
  const color  = result ? STATUS_COLOR[result.status]  : '#009980';
  const bgCol  = result ? STATUS_BG[result.status]     : '#d1fae5';
  const label  = result ? STATUS_LABEL[result.status]  : '';
  const vol311 = result?.record311Count ?? 0;
  const vol911 = result?.record911Count ?? 0;
  const social = result?.socialSignals;

  // Build signal bars from result
  const sigBars = result ? [
    { lbl: 'Gump-Score™',          pct: result.score },
    { lbl: '311 Records Matched',   pct: vol311  > 0 ? Math.min(vol311 * 8, 95)  : 0 },
    { lbl: '911 Incidents Matched', pct: vol911  > 0 ? Math.min(vol911 * 10, 95) : 0 },
    { lbl: 'Social Signal Volume',  pct: social ? Math.min(social.volume, 95) : 0 },
    { lbl: 'Source Credibility',    pct: activeKeys.includes('311') || activeKeys.includes('911') ? 88 : 54 },
  ] : [];

  return (
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(28,20,9,.07)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid #f5f1ea' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          <div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700, color: '#1c1409' }}>Rumor Intelligence Analyzer</div>
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a', marginTop: 2 }}>
              Gemini 1.5 Flash · 311/911 ArcGIS · Bright Data Social
            </div>
          </div>
        </div>
        <SensingBadge live={loading} />
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Textarea */}
        <div style={{
          background: focused ? '#fff' : '#f5f1ea',
          border: `2px solid ${focused ? '#3f3ad4' : loading ? '#f0900a' : 'transparent'}`,
          borderRadius: 12, padding: '12px 14px', marginBottom: 12,
          transition: 'border .2s, background .2s',
          boxShadow: focused ? '0 0 0 4px rgba(63,58,212,.08)' : 'none',
        }}>
          <textarea
            ref={textareaRef} value={rumor}
            onChange={e => { setRumor(e.target.value); setResult(null); }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            rows={3} disabled={loading}
            style={{ width: '100%', border: 'none', background: 'none', resize: 'none', fontFamily: "'Figtree',sans-serif", fontSize: 13.5, color: '#1c1409', outline: 'none', lineHeight: 1.55, minHeight: 68 }}
            placeholder={`Paste a civic claim… e.g. "Sinkhole on Mobile Hwy — cars falling in!" or "Water main break on Perry St confirmed"`}
          />
        </div>

        {/* Source chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px', marginRight: 4 }}>Sources:</span>
          {chips.map((chip, i) => (
            <SourceChip key={chip.key} label={chip.label} color={chip.color} on={chip.on} onClick={() => toggleChip(i)} />
          ))}
        </div>

        {/* Active source hint when filtered */}
        {activeKeys.length < ALL_SOURCES.length && (
          <div style={{ marginBottom: 10, fontSize: 11, fontFamily: "'Fira Code',monospace", color: '#8a7c6a', background: '#f5f1ea', borderRadius: 8, padding: '5px 10px' }}>
            ⚡ Fetching from: <strong style={{ color: '#1c1409' }}>{chips.filter(c => c.on).map(c => c.label).join(', ')}</strong>
          </div>
        )}

        {/* Presets + Analyze */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {[
              { label: '🕳️ Sinkhole',     text: PRESETS[0] },
              { label: '🚰 Water Main',    text: PRESETS[1] },
              { label: '🔦 Outage',        text: PRESETS[2] },
              { label: '🚦 Road Closure',  text: PRESETS[3] },
            ].map(p => (
              <HoverBtn key={p.label}
                onClick={() => handlePreset(p.text)}
                disabled={loading}
                baseStyle={{ background: '#ebe6dc', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#3a2f1e', fontFamily: "'Figtree',sans-serif" }}
                hoverStyle={{ background: '#3f3ad4', color: '#fff', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(63,58,212,.25)' }}
              >{p.label}</HoverBtn>
            ))}
          </div>

          <HoverBtn onClick={handleAnalyze} disabled={!canAnalyze}
            baseStyle={{
              background: canAnalyze ? 'linear-gradient(135deg,#3f3ad4,#6b21e8)' : '#9ca3af',
              color: '#fff', border: 'none', borderRadius: 12, padding: '10px 22px',
              fontFamily: "'Figtree',sans-serif", fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: canAnalyze ? '0 4px 16px rgba(63,58,212,.3)' : 'none',
            }}
            hoverStyle={{ transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(63,58,212,.45)' }}
          >
            {loading ? <Spinner /> : '⚡'}
            {loading ? 'Analyzing…' : 'Analyze'}
          </HoverBtn>
        </div>

        {/* Phase indicator while loading */}
        {loading && phase && (
          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(63,58,212,.06)', border: '1px solid rgba(63,58,212,.12)', fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#3f3ad4', animation: 'fadeIn .3s ease' }}>
            {phase}
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div style={{ marginTop: 14, borderRadius: 12, border: '2px dashed #ebe6dc', background: '#f9f8f6', minHeight: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, opacity: .3, marginBottom: 8 }}>⊘</div>
            <p style={{ fontSize: 12, color: '#8a7c6a', fontFamily: "'Figtree',sans-serif", maxWidth: 480, lineHeight: 1.55 }}>
              Enter a civic claim and hit <strong style={{ color: '#1c1409' }}>Analyze</strong> — Gemini 1.5 Flash will cross-reference
              your selected sources (311, 911, social) to produce a <strong style={{ color: '#1c1409' }}>Gump-Score™</strong>.
            </p>
          </div>
        )}

        {/* Result card */}
        {result && (
          <div style={{ marginTop: 14, borderRadius: 12, border: `1.5px solid ${color}33`, background: bgCol, overflow: 'hidden', animation: 'slideUp .35s ease' }}>

            {/* Result header */}
            <div style={{ padding: '10px 16px', background: `${color}14`, borderBottom: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 700, color, letterSpacing: '.5px' }}>{label}</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {vol311 > 0 && <span style={{ fontSize: 9, fontFamily: "'Fira Code',monospace", background: `${color}20`, color, padding: '2px 7px', borderRadius: 8, fontWeight: 700 }}>311: {vol311} records</span>}
                {vol911 > 0 && <span style={{ fontSize: 9, fontFamily: "'Fira Code',monospace", background: `${color}20`, color, padding: '2px 7px', borderRadius: 8, fontWeight: 700 }}>911: {vol911} logs</span>}
                {social && <span style={{ fontSize: 9, fontFamily: "'Fira Code',monospace", background: `${color}20`, color, padding: '2px 7px', borderRadius: 8, fontWeight: 700 }}>Social: {social.volume} signals</span>}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: 16, display: 'flex', gap: 16 }}>
              {/* Left: score ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <ScoreRing score={result.score} color={color} />
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: `${color}20`, color }}>{label}</span>
              </div>

              {/* Right: bars + info */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                {sigBars.map(s => <SigBar key={s.lbl} label={s.lbl} pct={s.pct} color={color} />)}

                {/* Data source attribution */}
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: '#8a7c6a', margin: '8px 0 6px' }}>
                  📍 Data: {result.dataSource}
                </div>

                {/* Active source tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                  {chips.filter(c => c.on).map(c => {
                    const getIco = () => {
                      if (c.label.includes('Twitter')) return <span style={{ marginRight: 3, fontWeight: 900 }}>𝕏</span>;
                      if (c.label.includes('Reddit'))  return <span style={{ marginRight: 3, fontWeight: 700 }}>r/</span>;
                      if (c.label.includes('Facebook')) return <svg style={{ width: 9, height: 9, marginRight: 3 }} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
                      if (c.label.includes('Nextdoor')) return <span style={{ marginRight: 3, fontWeight: 900, fontSize: 8 }}>ND</span>;
                      return null;
                    };
                    return (
                      <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 3, background: c.color, color: '#fff', fontFamily: "'Fira Code',monospace", fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 10 }}>
                        {getIco()}{c.label}
                      </div>
                    );
                  })}
                </div>

                {/* Social sentiment snippet */}
                {social && social.snippets.length > 0 && (
                  <div style={{ background: 'rgba(0,0,0,.03)', borderRadius: 8, padding: '7px 10px', marginBottom: 8, borderLeft: `3px solid ${color}` }}>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>🌐 Social Signal — {social.sentiment.toUpperCase()}</div>
                    <p style={{ fontSize: 11, color: '#3a2f1e', fontFamily: "'Figtree',sans-serif", margin: 0, lineHeight: 1.5 }}>{social.snippets[0]}</p>
                  </div>
                )}

                {/* AI reasoning */}
                <div style={{ background: 'rgba(0,0,0,.04)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: '#8a7c6a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5 }}>🤖 GEMINI 1.5 FLASH · AI REASONING</div>
                  <p style={{ fontSize: 12, color: '#3a2f1e', lineHeight: 1.55, fontFamily: "'Figtree',sans-serif", margin: 0 }}>
                    <strong>{result.title}</strong> — {result.message}
                  </p>
                </div>

                {/* Raise Objection Button (Stakeholders only) */}
                {profile?.session_type === 'verified_stakeholder' && (
                  <button 
                    onClick={() => setShowObjectionForm(!showObjectionForm)}
                    style={{
                      marginTop: 12, width: '100%', padding: '10px', borderRadius: 8,
                      background: '#fff', border: '1.5px solid #ff4422', color: '#ff4422',
                      fontFamily: "'Figtree',sans-serif", fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: 'all .2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ff4422'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ff4422'; }}
                  >
                    🚩 Raise Official Objection
                  </button>
                )}
              </div>
            </div>

            {/* Objection Form */}
            {showObjectionForm && (
              <div style={{ padding: '0 16px 16px', background: 'rgba(255,68,34,.03)', borderTop: '1px solid rgba(255,68,34,.1)', animation: 'fadeIn .2s' }}>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 700, color: '#ff4422' }}>STAKEHOLDER EVIDENCE SUBMISSION</label>
                  <textarea 
                    value={objectionComment}
                    onChange={e => setObjectionComment(e.target.value)}
                    placeholder="Describe why this analysis is incorrect... (e.g., 'Road was paved this morning, I am standing right next to it')"
                    style={{
                      width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1.5px solid #ebe6dc',
                      fontFamily: "'Figtree',sans-serif", fontSize: 13, outline: 'none', resize: 'vertical'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '6px 14px', borderRadius: 6, border: '1.5px solid #ddd8ce', background: '#fff',
                        fontSize: 12, fontWeight: 600, fontFamily: "'Figtree',sans-serif", cursor: 'pointer'
                      }}
                    >
                      📷 {objectionImage ? 'Image Loaded' : 'Upload Evidence'}
                    </button>
                    {objectionImage && <span style={{ fontSize: 11, color: '#009980', fontWeight: 600 }}>Ready for submission</span>}
                    <button 
                      disabled={!objectionComment.trim()}
                      onClick={handleObjectionSubmit}
                      style={{
                        marginLeft: 'auto', padding: '7px 20px', borderRadius: 8, background: '#1c1409', color: '#fff',
                        border: 'none', fontSize: 13, fontWeight: 700, cursor: objectionComment.trim() ? 'pointer' : 'not-allowed',
                        opacity: objectionComment.trim() ? 1 : 0.5
                      }}
                    >
                      Submit Objection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Objections Display */}
            {activeObjections.length > 0 && (
              <div style={{ padding: '16px', borderTop: '1px solid #f5f1ea', background: '#fcfbf9' }}>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 700, color: '#8a7c6a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Community Objections ({activeObjections.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeObjections.map((obj, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: i < activeObjections.length - 1 ? '1px solid #f5f1ea' : 'none' }}>
                      {obj.image && (
                        <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid #ebe6dc' }}>
                          <img src={obj.image} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: "'Figtree',sans-serif", fontSize: 12, fontWeight: 700, color: '#ff4422' }}>{obj.username}</span>
                          <span style={{ fontSize: 10, color: '#8a7c6a' }}>{new Date(obj.timestamp).toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: 12.5, color: '#1c1409', lineHeight: 1.5, margin: 0, fontFamily: "'Figtree',sans-serif" }}>
                          {obj.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes breathe   { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes pulseRing { 0%{box-shadow:0 0 0 0 rgba(63,58,212,.5)} 70%{box-shadow:0 0 0 6px rgba(63,58,212,0)} 100%{box-shadow:0 0 0 0 rgba(63,58,212,0)} }
        .spin { animation: spinA .7s linear infinite; }
        @keyframes spinA { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
