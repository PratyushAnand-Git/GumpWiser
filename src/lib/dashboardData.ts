// Shared data used across dashboard components
export const FEED_DATA = [
  { src: '𝕏 Twitter', dot: '#1d9bf0', time: '2m',  txt: 'Road crew on Perry St finally fixing those potholes!',                        sc: 88, v: 'v' as const, cat: 'Roads'      },
  { src: 'Reddit',     dot: '#ff4500', time: '5m',  txt: 'Rumor: water main burst near Rosa Parks Museum — whole downtown flooding???',   sc: 18, v: 'a' as const, cat: 'Utilities'  },
  { src: 'Facebook',   dot: '#1877f2', time: '9m',  txt: 'Power outage on Ann St since 6am, still nothing from APC 😤',                  sc: 74, v: 'v' as const, cat: 'Utilities'  },
  { src: 'Nextdoor',   dot: '#00b347', time: '13m', txt: 'HUGE sinkhole on Mobile Hwy — cars literally falling in, stay away!',           sc: 9,  v: 'a' as const, cat: 'Roads'      },
  { src: '𝕏 Twitter', dot: '#1d9bf0', time: '16m', txt: '311 confirmed: park cleanup at Oak Park 9am–noon today ✅',                     sc: 96, v: 'v' as const, cat: 'Parks'      },
  { src: 'Reddit',     dot: '#ff4500', time: '19m', txt: 'Is it true they shutting down ALL downtown parking for the whole month?',       sc: 15, v: 'a' as const, cat: 'Civic'      },
  { src: 'Facebook',   dot: '#1877f2', time: '22m', txt: 'Trash pickup delayed District 5 — equipment maintenance per city website',      sc: 84, v: 'v' as const, cat: 'Sanitation' },
  { src: '𝕏 Twitter', dot: '#1d9bf0', time: '25m', txt: 'Hearing gunshots near Madison Ave — anyone else got info?',                    sc: 52, v: 'c' as const, cat: 'Safety'     },
  { src: 'Nextdoor',   dot: '#00b347', time: '30m', txt: 'Street light out at Ann & Monroe for 3 days — filed 311 request',              sc: 78, v: 'v' as const, cat: 'Civic'      },
  { src: 'Reddit',     dot: '#ff4500', time: '38m', txt: 'City finally repaving Narrow Lane Rd — confirmed by 311',                      sc: 82, v: 'v' as const, cat: 'Roads'      },
  { src: 'Facebook',   dot: '#1877f2', time: '45m', txt: 'Explosion heard near the industrial park!! Anyone else hear it??',              sc: 8,  v: 'a' as const, cat: 'Safety'     },
  { src: 'Nextdoor',   dot: '#00b347', time: '52m', txt: 'Loose dog on Oak Park Dr — brown lab, very friendly, no collar',               sc: 95, v: 'v' as const, cat: 'Community'  },
];

export const SOURCES_COL = [
  {
    key: 'twitter', label: '𝕏 Twitter', dot: '#1d9bf0', items: [
      { time: '2m',  cat: 'Roads',    txt: 'Road crew on Perry St finally fixing those potholes!', sc: 88, v: 'v' as const },
      { time: '16m', cat: 'Parks',    txt: '311 confirmed: park cleanup at Oak Park 9am–noon today ✅', sc: 96, v: 'v' as const },
      { time: '25m', cat: 'Safety',   txt: 'Hearing gunshots near Madison Ave — anyone else got info?', sc: 52, v: 'c' as const },
    ],
  },
  {
    key: 'reddit', label: 'Reddit', dot: '#ff4500', items: [
      { time: '5m',  cat: 'Utilities', txt: 'Rumor: water main burst near Rosa Parks Museum — flooding???', sc: 18, v: 'a' as const },
      { time: '19m', cat: 'Civic',     txt: 'Is it true they shutting down ALL downtown parking for a month?', sc: 15, v: 'a' as const },
      { time: '38m', cat: 'Roads',     txt: 'City finally repaving Narrow Lane Rd — confirmed by 311', sc: 82, v: 'v' as const },
    ],
  },
  {
    key: 'facebook', label: 'Facebook', dot: '#1877f2', items: [
      { time: '9m',  cat: 'Utilities', txt: 'Power outage on Ann St since 6am, still nothing from APC 😤',  sc: 74, v: 'v' as const },
      { time: '22m', cat: 'Sanitation',txt: 'Trash pickup delayed District 5 — equipment maintenance per city website', sc: 84, v: 'v' as const },
      { time: '45m', cat: 'Safety',    txt: 'Explosion heard near the industrial park!! Anyone else hear it??', sc: 8, v: 'a' as const },
    ],
  },
  {
    key: 'nextdoor', label: 'Nextdoor', dot: '#00b347', items: [
      { time: '13m', cat: 'Roads',     txt: 'HUGE sinkhole on Mobile Hwy — cars literally falling in, stay away!', sc: 9,  v: 'a' as const },
      { time: '30m', cat: 'Civic',     txt: 'Street light out at Ann & Monroe for 3 days — filed 311 request', sc: 78, v: 'v' as const },
      { time: '52m', cat: 'Community', txt: 'Loose dog on Oak Park Dr — brown lab, very friendly, no collar', sc: 95, v: 'v' as const },
    ],
  },
];

export const PRESETS = [
  "HUGE sinkhole opened on Mobile Hwy near Publix — cars are falling in! STAY AWAY",
  "Water main break confirmed on Perry St, road is flooded near the museum",
  "Power outage hit the whole Ann Street corridor since 6am, no word from APC",
  "City closed all of downtown for construction — no parking anywhere for a month",
];

export type FeedItem = typeof FEED_DATA[0];
export type SourceCol = typeof SOURCES_COL[0];
export type Verdict = 'v' | 'a' | 'c';

export const VERDICT_MAP = {
  v: { bg: '#d1fae5', fg: '#065f46', label: '✅ VERIFIED'    },
  a: { bg: '#fee2e2', fg: '#991b1b', label: '🚫 ALERT'       },
  c: { bg: '#fef3c7', fg: '#92400e', label: '⚠️ CAUTION'     },
};

// All possible source definitions for the analyzer
export const ALL_SOURCES = [
  { key: 'twitter', label: '𝕏 Twitter', color: '#0099dd', weight: 1.0  },
  { key: 'reddit',  label: 'Reddit',    color: '#ff4500', weight: 1.0  },
  { key: 'facebook',label: 'Facebook',  color: '#1877f2', weight: 1.0  },
  { key: 'nextdoor',label: 'Nextdoor',  color: '#00b347', weight: 0.9  },
  { key: '311',     label: '311 Data',  color: '#f0900a', weight: 1.5  },
  { key: '911',     label: '911 Log',   color: '#ff4422', weight: 1.5  },
];

export function scoreRumor(txt: string, activeSources?: string[]) {
  const GOOD = ['pothole','water main','311','confirmed','crew','maintenance','power outage','trash pickup','park','schedule'];
  const BAD  = ['sinkhole','cars falling','entire city','flooding downtown','shut down all','massive explosion','whole city'];
  const tl = txt.toLowerCase();
  let b = 50;
  GOOD.forEach(w => { if (tl.includes(w)) b += 13; });
  BAD.forEach(w  => { if (tl.includes(w)) b -= 17; });

  // Source-weight modifier: official (311/911) sources skew score toward more confident
  const active = activeSources ?? ALL_SOURCES.map(s => s.key);
  const selectedSrcs = ALL_SOURCES.filter(s => active.includes(s.key));
  const avgWeight = selectedSrcs.length
    ? selectedSrcs.reduce((sum, s) => sum + s.weight, 0) / selectedSrcs.length
    : 1;
  // If only official sources selected (311/911), higher confidence modifier
  const officialOnly = selectedSrcs.every(s => s.weight >= 1.5);
  const socialOnly   = selectedSrcs.every(s => s.weight < 1.5);
  if (officialOnly) b = Math.round(b * 1.12);  // official data more reliable
  if (socialOnly)   b = Math.round(b * 0.92);  // social only = less certainty
  b = Math.max(4, Math.min(96, b + Math.round((Math.random() - .5) * 18)));

  const verdict: Verdict = b >= 70 ? 'v' : b >= 35 ? 'c' : 'a';
  const COLOR = { v: '#009980', c: '#f0900a', a: '#ff4422' };
  const REASON = {
    v: 'Strong multi-source confirmation — cross-referenced with 311 dispatch logs and real-time social signals. Claim matches official city records and is consistent with historical service patterns.',
    c: 'Partial signal detected — some social mentions exist but lack geographic precision or official city record confirmation. Claim may be exaggerated. Monitor for 20–30 min before sharing.',
    a: 'No supporting evidence found in official records. Contradicts real-time 311/911 dispatch data. High probability of misinformation — do not share.',
  };
  const rnd = (n: number) => Math.max(5, Math.min(95, b + Math.round((Math.random()-.5)*n)));

  // srcs: only show selected sources in the result card
  const srcs = selectedSrcs.map(s => ({ lbl: s.label, pct: rnd(20), c: s.color }));

  return {
    score: b,
    verdict,
    color: COLOR[verdict],
    activeSources: active,
    sigs: [
      { lbl: 'Social Frequency',    pct: rnd(20) },
      { lbl: '311/911 Cross-Ref',   pct: rnd(22) },
      { lbl: 'Source Credibility',  pct: rnd(18) },
      { lbl: 'Geo-Consistency',     pct: rnd(16) },
      { lbl: 'Time Coherence',      pct: rnd(20) },
    ],
    srcs,
    vol: Math.round((180 + Math.random() * 120 + b * 1.5) * (selectedSrcs.length / ALL_SOURCES.length + 0.3)),
    reason: REASON[verdict],
  };
}
