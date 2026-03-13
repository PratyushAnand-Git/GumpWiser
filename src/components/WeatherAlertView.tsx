"use client";

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 14, border: '2px solid #ebe6dc',
  padding: '14px 16px', boxShadow: '0 2px 16px rgba(28,20,9,.07)',
};
const pill = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code',monospace",
  padding: '4px 11px', borderRadius: 20, background: bg, color: fg,
});
const tile: React.CSSProperties = {
  background: '#f5f1ea', borderRadius: 10, padding: '9px 11px',
};

const HOURLY = [
  { t: 'Now',  ico: '🌤️', temp: '74°' },
  { t: '2PM',  ico: '☀️',  temp: '78°' },
  { t: '4PM',  ico: '⛅',  temp: '81°' },
  { t: '6PM',  ico: '🌥️', temp: '79°' },
  { t: '8PM',  ico: '🌧️', temp: '72°' },
  { t: '10PM', ico: '⛈️', temp: '66°', alert: true },
  { t: '12AM', ico: '🌩️', temp: '63°', alert: true },
  { t: '2AM',  ico: '🌧️', temp: '61°' },
  { t: '6AM',  ico: '🌦️', temp: '60°' },
  { t: '8AM',  ico: '⛅',  temp: '63°' },
  { t: '10AM', ico: '🌤️', temp: '68°' },
  { t: '12PM', ico: '☀️',  temp: '73°' },
];
const DAILY = [
  { d: 'Today', ico: '🌤️', desc: 'Partly Cloudy',          hi: '81°', lo: '62°' },
  { d: 'Thu',   ico: '⛈️', desc: 'Thunderstorms likely',   hi: '74°', lo: '59°' },
  { d: 'Fri',   ico: '🌧️', desc: 'Showers',                hi: '70°', lo: '56°' },
  { d: 'Sat',   ico: '⛅', desc: 'Mostly Cloudy',           hi: '72°', lo: '58°' },
  { d: 'Sun',   ico: '☀️', desc: 'Sunny',                   hi: '79°', lo: '60°' },
  { d: 'Mon',   ico: '☀️', desc: 'Sunny',                   hi: '83°', lo: '63°' },
  { d: 'Tue',   ico: '🌤️', desc: 'Partly Cloudy',          hi: '80°', lo: '62°' },
];

function SH({ title, tag, mt }: { title: string; tag: string; mt?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: `${mt ?? 18}px 0 12px` }}>
      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>{title}</span>
      <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Fira Code',monospace", color: '#8a7c6a' }}>{tag}</span>
    </div>
  );
}

export default function WeatherAlertView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, borderRadius: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>Weather Alert</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>Montgomery AL · NWS data · Hourly forecast + civic impact</div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ ...pill('#d1fae5', '#065f46') }}>No Active Alerts</span>
          <span style={{ ...pill('rgba(14,165,233,.12)', '#0099dd') }}>74°F Partly Cloudy</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Left / main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Big current card */}
          <div style={{ ...card, padding: 20, marginBottom: 0, borderRadius: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>74°F</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Partly Cloudy — Montgomery, AL</div>
                <div style={{ fontSize: 12, color: '#8a7c6a' }}>Feels like 76° · High 81° · Low 62°</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { l: 'Humidity',    v: '62%',       c: '#1c1409' },
                { l: 'Wind',        v: 'NW 8 mph',  c: '#0099dd' },
                { l: 'UV Index',    v: '6 — High',  c: '#f0900a' },
                { l: 'Visibility',  v: '10 mi',     c: '#1c1409' },
                { l: 'Pressure',    v: '30.1 inHg', c: '#1c1409' },
                { l: 'Dew Point',   v: '58°F',      c: '#1c1409' },
              ].map(({ l, v, c }) => (
                <div key={l} style={tile}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#8a7c6a', fontFamily: "'Fira Code',monospace", textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <SH title="Hourly Forecast" tag="NEXT 12 HOURS" />
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
            {HOURLY.map(h => (
              <div key={h.t} style={{
                minWidth: 58,
                borderRadius: 12, border: h.alert ? '2px solid #ff4422' : '2px solid #ebe6dc',
                background: h.alert ? 'rgba(255,68,34,.04)' : '#fff',
                padding: '9px 6px', textAlign: 'center', flexShrink: 0,
              }}>
                <div style={{ fontSize: 10, fontFamily: "'Fira Code',monospace", color: '#8a7c6a', fontWeight: 700, marginBottom: 4 }}>{h.t}</div>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{h.ico}</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>{h.temp}</div>
              </div>
            ))}
          </div>

          <SH title="7-Day Outlook" tag="NWS MONTGOMERY" mt={0} />
          <div style={{ background: '#fff', borderRadius: 18, border: '2px solid #ebe6dc', overflow: 'hidden', boxShadow: '0 2px 16px rgba(28,20,9,.07)' }}>
            {DAILY.map((d, i) => (
              <div key={d.d} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: i < DAILY.length - 1 ? '1.5px solid #f5f1ea' : 'none' }}>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, fontWeight: 700, width: 40, flexShrink: 0 }}>{d.d}</span>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{d.ico}</span>
                <span style={{ flex: 1, fontSize: 12.5, color: '#8a7c6a' }}>{d.desc}</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>
                  <span style={{ color: '#ff4422' }}>{d.hi}</span> / <span style={{ color: '#0099dd' }}>{d.lo}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Civic Weather Impact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { ico: '🌩️', title: 'Thunderstorm Tonight', desc: 'Expect 311 surge — drainage, fallen trees, power outages', type: 'warn' },
                { ico: '🚗',  title: 'Wet Roads 10PM+',      desc: 'Increased traffic incident risk on I-85 and Mobile Hwy',  type: 'info' },
                { ico: '🌳', title: 'Outdoor Events Clear',  desc: 'Daytime activities OK — Oak Park cleanup on schedule',    type: 'ok'   },
              ].map(({ ico, title, desc, type }) => {
                const bg = type === 'warn' ? 'rgba(255,68,34,.07)' : type === 'info' ? 'rgba(14,165,233,.07)' : 'rgba(0,153,128,.07)';
                const bd = type === 'warn' ? 'rgba(255,68,34,.18)' : type === 'info' ? 'rgba(14,165,233,.15)' : 'rgba(0,153,128,.15)';
                return (
                  <div key={title} style={{ display: 'flex', gap: 10, padding: '9px 11px', borderRadius: 10, background: bg, border: `1.5px solid ${bd}` }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{ico}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: 11, color: '#8a7c6a', lineHeight: 1.45 }}>{desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>🌡️ Air Quality</div>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 42, fontWeight: 900, color: '#009980' }}>42</div>
              <div style={{ fontSize: 11, fontFamily: "'Fira Code',monospace", color: '#009980', fontWeight: 700, marginBottom: 6 }}>AQI — GOOD</div>
              <div style={{ fontSize: 12, color: '#8a7c6a', lineHeight: 1.5 }}>Air quality is satisfactory. No health concerns for the general population.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
              {[{ l: 'PM2.5', v: '6 µg/m³', c: '#009980' }, { l: 'Ozone', v: '38 ppb', c: '#1c1409' }, { l: 'NO₂', v: '12 ppb', c: '#1c1409' }, { l: 'CO', v: '0.3 ppm', c: '#1c1409' }].map(({ l, v, c }) => (
                <div key={l} style={tile}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#8a7c6a', fontFamily: "'Fira Code',monospace", textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
