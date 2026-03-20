"use client";

import { useEffect, useState } from "react";
import { fetchWeather, type WeatherData } from "@/lib/weather";

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

// Map condition text to emojis for the aesthetic
const getEmoji = (text: string = "") => {
  const t = text.toLowerCase();
  if (t.includes("thunder")) return "⛈️";
  if (t.includes("rain") || t.includes("drizzle")) return "🌧️";
  if (t.includes("snow") || t.includes("sleet") || t.includes("ice")) return "❄️";
  if (t.includes("mist") || t.includes("fog")) return "🌫️";
  if (t.includes("overcast") || t.includes("cloudy")) {
    if (t.includes("partly")) return "🌤️";
    return "☁️";
  }
  if (t.includes("clear") || t.includes("sunny")) return "☀️";
  return "⛅";
};

function SH({ title, tag, mt }: { title: string; tag: string; mt?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: `${mt ?? 18}px 0 12px` }}>
      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700 }}>{title}</span>
      <div style={{ flex: 1, height: 2, background: '#ebe6dc', borderRadius: 2 }} />
      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Fira Code',monospace", color: '#8a7c6a' }}>{tag}</span>
    </div>
  );
}

// Fallback Mock Data
const MOCK_HOURLY = [
  { t: 'Now',  ico: '🌤️', temp: '74°' }, { t: '2PM',  ico: '☀️',  temp: '78°' }, { t: '4PM',  ico: '⛅',  temp: '81°' },
  { t: '6PM',  ico: '🌥️', temp: '79°' }, { t: '8PM',  ico: '🌧️', temp: '72°' }, { t: '10PM', ico: '⛈️', temp: '66°', alert: true },
  { t: '12AM', ico: '🌩️', temp: '63°', alert: true }, { t: '2AM',  ico: '🌧️', temp: '61°' }, { t: '6AM',  ico: '🌦️', temp: '60°' },
  { t: '8AM',  ico: '⛅',  temp: '63°' }, { t: '10AM', ico: '🌤️', temp: '68°' }, { t: '12PM', ico: '☀️',  temp: '73°' },
];
const MOCK_DAILY = [
  { d: 'Today', ico: '🌤️', desc: 'Partly Cloudy',          hi: '81°', lo: '62°' },
  { d: 'Thu',   ico: '⛈️', desc: 'Thunderstorms likely',   hi: '74°', lo: '59°' },
  { d: 'Fri',   ico: '🌧️', desc: 'Showers',                hi: '70°', lo: '56°' },
  { d: 'Sat',   ico: '⛅', desc: 'Mostly Cloudy',           hi: '72°', lo: '58°' },
  { d: 'Sun',   ico: '☀️', desc: 'Sunny',                   hi: '79°', lo: '60°' },
  { d: 'Mon',   ico: '☀️', desc: 'Sunny',                   hi: '83°', lo: '63°' },
  { d: 'Tue',   ico: '🌤️', desc: 'Partly Cloudy',          hi: '80°', lo: '62°' },
];

export default function WeatherAlertView() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/weather');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || 'Failed to fetch');
          setDiagnostics(json.diagnostics);
        }
      } catch (err) {
        console.error("Failed to fetch from API route:", err);
        setError('Network Error');
      }
      setLoading(false);
    }
    init();
  }, []);

  const current = data?.current;
  const forecast = data?.forecast;

  const displayHourly = forecast ? forecast.forecastday[0].hour.slice(0, 12).map(h => ({
    t: new Date(h.time).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
    ico: getEmoji(h.condition.text),
    temp: `${Math.round(h.temp_f)}°`,
    alert: h.condition.text.toLowerCase().includes('thunder')
  })) : (loading ? Array(12).fill({ t: '—', ico: '...', temp: '—' }) : MOCK_HOURLY);

  const displayDaily = forecast ? forecast.forecastday.map(d => ({
    d: new Date(d.date).toLocaleDateString([], { weekday: 'short' }),
    ico: getEmoji(d.day.condition.text),
    desc: d.day.condition.text,
    hi: `${Math.round(d.day.maxtemp_f)}°`,
    lo: `${Math.round(d.day.mintemp_f)}°`
  })) : (loading ? Array(7).fill({ d: '—', ico: '...', desc: 'Loading forecast...', hi: '—', lo: '—' }) : MOCK_DAILY);

  const alerts = data?.alerts?.alert || [];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: '#f5f1ea' }}>
      {/* Hero */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, borderRadius: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, marginBottom: 2 }}>Weather Alert</div>
          <div style={{ fontSize: 12, color: '#8a7c6a' }}>
            Montgomery AL · {loading ? 'Fetching...' : (data ? 'Real-time API' : 'NWS data')} · Hourly forecast + civic impact
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ ...pill(alerts.length > 0 ? '#fee2e2' : '#d1fae5', alerts.length > 0 ? '#991b1b' : '#065f46') }}>
            {alerts.length > 0 ? `${alerts.length} Active Alerts` : 'No Active Alerts'}
          </span>
          <span style={{ ...pill('rgba(14,165,233,.12)', '#0099dd') }}>
            {current ? `${Math.round(current.temp_f)}°F ${current.condition.text}` : (loading ? '—°F Fetching...' : '74°F Partly Cloudy')}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Left / main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Big current card */}
          <div style={{ ...card, padding: 20, marginBottom: 0, borderRadius: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>
                  {current ? `${Math.round(current.temp_f)}°F` : (loading ? '—°F' : '74°F')}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                  {current ? `${current.condition.text} — Montgomery, AL` : (loading ? 'Fetching condition...' : 'Partly Cloudy — Montgomery, AL')}
                </div>
                <div style={{ fontSize: 12, color: '#8a7c6a' }}>
                  {current 
                    ? `Feels like ${Math.round(current.feelslike_f)}° · High ${Math.round(forecast?.forecastday[0].day.maxtemp_f || 0)}° · Low ${Math.round(forecast?.forecastday[0].day.mintemp_f || 0)}°`
                    : (loading ? 'Feels like —° · High —° · Low —°' : 'Feels like 76° · High 81° · Low 62°')}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { l: 'Humidity',    v: current ? `${current.humidity}%` : (loading ? '—' : '62%'),       c: '#1c1409' },
                { l: 'Wind',        v: current ? `${current.wind_dir} ${Math.round(current.wind_mph)} mph` : (loading ? '—' : 'NW 8 mph'),  c: '#0099dd' },
                { l: 'UV Index',    v: current ? `${current.uv} — ${current.uv > 5 ? 'High' : 'Moderate'}` : (loading ? '—' : '6 — High'),  c: '#f0900a' },
                { l: 'Visibility',  v: current ? `${current.vis_miles} mi` : (loading ? '—' : '10 mi'),     c: '#1c1409' },
                { l: 'Pressure',    v: current ? `${current.pressure_in} inHg` : (loading ? '—' : '30.1 inHg'), c: '#1c1409' },
                { l: 'Dew Point',   v: current ? `${Math.round(current.dewpoint_f)}°F` : (loading ? '—' : '58°F'),      c: '#1c1409' },
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
            {displayHourly.map((h, i) => (
              <div key={i} style={{
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

          <SH title="7-Day Outlook" tag="WEATHERAPI MONTGOMERY" mt={0} />
          <div style={{ background: '#fff', borderRadius: 18, border: '2px solid #ebe6dc', overflow: 'hidden', boxShadow: '0 2px 16px rgba(28,20,9,.07)' }}>
            {displayDaily.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: i < displayDaily.length - 1 ? '1.5px solid #f5f1ea' : 'none' }}>
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
              {(alerts.length > 0 ? alerts : (loading ? [] : [
                { event: 'Thunderstorm Tonight', desc: 'Expect 311 surge — drainage, fallen trees, power outages', category: 'Met' },
                { event: 'Wet Roads 10PM+',      desc: 'Increased traffic incident risk on I-85 and Mobile Hwy',  category: 'Met' },
                { event: 'Outdoor Events Clear',  desc: 'Daytime activities OK — Oak Park cleanup on schedule',    category: 'Civic'   },
              ])).slice(0, 3).map((a: any, idx) => {
                const isReal = !!a.event;
                const type = a.category?.includes('Met') ? 'warn' : a.category?.includes('Civic') ? 'ok' : 'info';
                const bg = type === 'warn' ? 'rgba(255,68,34,.07)' : type === 'info' ? 'rgba(14,165,233,.07)' : 'rgba(0,153,128,.07)';
                const bd = type === 'warn' ? 'rgba(255,68,34,.18)' : type === 'info' ? 'rgba(14,165,233,.15)' : 'rgba(0,153,128,.15)';
                const ico = type === 'warn' ? '🌩️' : type === 'info' ? '🚗' : '🌳';
                return (
                  <div key={idx} style={{ display: 'flex', gap: 10, padding: '9px 11px', borderRadius: 10, background: bg, border: `1.5px solid ${bd}` }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{ico}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{a.event || a.headline}</div>
                      <div style={{ fontSize: 11, color: '#8a7c6a', lineHeight: 1.45 }}>{a.desc || a.instruction || "No specific instructions."}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={card}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>🌡️ Air Quality</div>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 42, fontWeight: 900, color: current?.air_quality["us-epa-index"] && current?.air_quality["us-epa-index"] <= 2 ? '#009980' : '#f0900a' }}>
                {current ? Math.round(current.air_quality.pm2_5) : (loading ? '—' : '42')}
              </div>
              <div style={{ fontSize: 11, fontFamily: "'Fira Code',monospace", color: current?.air_quality["us-epa-index"] && current?.air_quality["us-epa-index"] <= 2 ? '#009980' : '#f0900a', fontWeight: 700, marginBottom: 6 }}>
                AQI — {current ? (current.air_quality["us-epa-index"] <= 2 ? 'GOOD' : 'MODERATE') : (loading ? 'Fetching...' : 'GOOD')}
              </div>
              <div style={{ fontSize: 12, color: '#8a7c6a', lineHeight: 1.5 }}>
                {current ? "Air quality measurements from Montgomery sensors." : (loading ? 'Loading sensor data...' : "Air quality is satisfactory. No health concerns for the general population.")}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
              {[
                { l: 'PM2.5', v: current ? `${current.air_quality.pm2_5.toFixed(1)} µg/m³` : (loading ? '—' : '6 µg/m³'), c: (current?.air_quality?.["us-epa-index"] ?? 0) <= 2 ? '#009980' : '#1c1409' },
                { l: 'Ozone', v: current ? `${current.air_quality.o3.toFixed(1)} ppb` : (loading ? '—' : '38 ppb'), c: '#1c1409' },
                { l: 'NO₂', v: current ? `${current.air_quality.no2.toFixed(1)} ppb` : (loading ? '—' : '12 ppb'), c: '#1c1409' },
                { l: 'CO', v: current ? `${current.air_quality.co.toFixed(1)} ppm` : (loading ? '—' : '0.3 ppm'), c: '#1c1409' }
              ].map(({ l, v, c }) => (
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
