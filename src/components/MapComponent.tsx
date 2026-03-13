"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

// ── Data ───────────────────────────────────────────────────────────────────────
type LatLng = [number, number];

const INCIDENTS = {
  emergency: [
    { lat: 32.3612, lng: -86.3095, icon: "🔥", title: "Structure Fire",    detail: "1240 Mobile Hwy · 4 units dispatched", color: "#ff4422" },
    { lat: 32.3780, lng: -86.2951, icon: "🚑", title: "Medical Emergency", detail: "Oak Park Drive · 1 unit",              color: "#ff4422" },
    { lat: 32.3550, lng: -86.2720, icon: "👮", title: "Traffic Incident",  detail: "I-85 N @ Exit 6 · 2 units",           color: "#ff4422" },
  ],
  rumors: [
    { lat: 32.3650, lng: -86.3120, icon: "⚠️", title: "Unverified: Sinkhole",         detail: "Mobile Hwy near Publix — 9% credibility",  color: "#f0900a" },
    { lat: 32.3700, lng: -86.2860, icon: "⚠️", title: "Unverified: Downtown Closure", detail: "Rumor: all parking shut down — 15%",        color: "#f0900a" },
    { lat: 32.3810, lng: -86.3050, icon: "⚠️", title: "Unverified: Flooding",         detail: "Rosa Parks Museum area — 18%",             color: "#f0900a" },
  ],
  verified: [
    { lat: 32.3738, lng: -86.2938, icon: "✅", title: "Pothole Repair Crew", detail: "Perry St · 311 Confirmed · 88%",         color: "#009980" },
    { lat: 32.3820, lng: -86.3100, icon: "✅", title: "Park Cleanup Event",  detail: "Oak Park · 9am–noon · 96%",             color: "#009980" },
    { lat: 32.3580, lng: -86.2990, icon: "✅", title: "Power Restoration",   detail: "Ann St corridor · APC confirmed · 74%", color: "#009980" },
    { lat: 32.3680, lng: -86.2780, icon: "✅", title: "Trash Pickup Delay",  detail: "District 5 · 311 confirmed · 84%",      color: "#009980" },
  ],
};

const RESTRICTED_ZONES = [
  {
    name: "Maxwell–Gunter AFB",
    coords: [[32.3820, -86.3658], [32.3820, -86.3358], [32.3620, -86.3358], [32.3620, -86.3658]] as LatLng[],
    color: "#4b5563",
    label: "🔒 Restricted Airspace — Maxwell AFB",
  },
  {
    name: "ALEA State Ops Center",
    coords: [[32.3690, -86.3020], [32.3690, -86.2960], [32.3650, -86.2960], [32.3650, -86.3020]] as LatLng[],
    color: "#7c3aed",
    label: "🔒 State Law Enforcement — Restricted",
  },
  {
    name: "Water Treatment Facility",
    coords: [[32.3550, -86.3250], [32.3550, -86.3180], [32.3510, -86.3180], [32.3510, -86.3250]] as LatLng[],
    color: "#0369a1",
    label: "🔒 Critical Infrastructure — No Entry",
  },
  {
    name: "State Capitol Security Zone",
    coords: [[32.3619, -86.2997], [32.3619, -86.2962], [32.3594, -86.2962], [32.3594, -86.2997]] as LatLng[],
    color: "#b45309",
    label: "🔒 Capitol Security Perimeter",
  },
];

const LAYER_BUTTONS = [
  { key: "emergency", label: "🔴 Emergency", color: "#ff4422" },
  { key: "rumors",    label: "🟡 Rumors",    color: "#f0900a" },
  { key: "verified",  label: "🟢 Verified",  color: "#009980" },
  { key: "restricted",label: "⬛ Restricted", color: "#4b5563" },
] as const;

type LayerKey = "emergency" | "rumors" | "verified" | "restricted";

// ── Component ─────────────────────────────────────────────────────────────────
export default function MapComponent({ 
  mapHeight = 360,
  onMarkerClick,
  activeMarkerId 
}: { 
  mapHeight?: number;
  onMarkerClick?: (id: string, lat: number, lng: number) => void;
  activeMarkerId?: string | null;
}) {
  const mapElRef  = useRef<HTMLDivElement>(null);
  const mapRef    = useRef<any>(null);
  const layersRef = useRef<Record<string, any>>({});

  const [layerOn, setLayerOn] = useState<Record<LayerKey, boolean>>({
    emergency: true, rumors: true, verified: true, restricted: true,
  });

  // ── Init map once ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    import("leaflet").then((L) => {
      if (!mapElRef.current || mapRef.current) return;

      const map = L.map(mapElRef.current, {
        center: [32.3668, -86.3] as LatLng,
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });

      // OSM tiles with desaturation (matches gumpwiser.html)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
        opacity: 0.88,
      }).addTo(map);

      // Layer groups
      const layers: Record<string, any> = {};
      (["emergency", "rumors", "verified", "restricted"] as LayerKey[]).forEach((k) => {
        layers[k] = L.layerGroup().addTo(map);
      });
      layersRef.current = layers;

      // ── Helper: make a divIcon marker ──────────────────────────────
      function makeMarker(inc: { id?: string; lat: number; lng: number; icon: string; color: string; title: string; detail: string }, layerKey: string) {
        // create a unique ID if none exists (fallback)
        const markerId = inc.id || `${inc.lat}-${inc.lng}`;
        
        const icon = L.divIcon({
          html: `<div id="marker-${markerId}" style="
            width:28px;height:28px;background:${inc.color};
            border:2.5px solid #fff;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:13px;box-shadow:0 2px 10px rgba(0,0,0,.25);
            cursor:pointer;transition:transform .15s, border-color .15s, box-shadow .15s;
          " onmouseenter="this.style.transform='scale(1.18)'" onmouseleave="this.style.transform=''">${inc.icon}</div>`,
          iconSize: [28, 28], iconAnchor: [14, 14], className: "",
        });
        const marker = L.marker([inc.lat, inc.lng] as LatLng, { icon })
          .addTo(layers[layerKey])
          .bindPopup(`<div style="font-family:system-ui;font-size:12px;line-height:1.5"><b>${inc.title}</b><br><span style="color:${inc.color}">${inc.detail}</span></div>`);
          
        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(markerId, inc.lat, inc.lng);
        });
      }

      // ── Add emergency markers with pulsing ring ────────────────────
      INCIDENTS.emergency.forEach((inc) => {
        makeMarker(inc, "emergency");
        // Pulsing ring
        L.circleMarker([inc.lat, inc.lng] as LatLng, {
          radius: 18, weight: 2,
          color: inc.color, fillColor: inc.color, fillOpacity: 0.12,
        }).addTo(layers.emergency);
      });

      // ── Rumors & Verified markers ──────────────────────────────────
      INCIDENTS.rumors.forEach((inc) => makeMarker(inc, "rumors"));
      INCIDENTS.verified.forEach((inc) => makeMarker(inc, "verified"));

      // ── Restricted zones ───────────────────────────────────────────
      RESTRICTED_ZONES.forEach((zone) => {
        const poly = L.polygon(zone.coords, {
          color: zone.color, fillColor: zone.color, fillOpacity: 0.18,
          dashArray: "6, 4", weight: 2,
        }).addTo(layers.restricted);

        poly.bindPopup(`<div style="font-family:'Fira Code',monospace;font-size:11px"><b>${zone.name}</b><br>Restricted — authorized personnel only</div>`);

        // Zone label marker
        const lats = zone.coords.map((c) => c[0]);
        const lngs = zone.coords.map((c) => c[1]);
        const clat = (Math.max(...lats) + Math.min(...lats)) / 2;
        const clng = (Math.max(...lngs) + Math.min(...lngs)) / 2;

        L.marker([clat, clng] as LatLng, {
          icon: L.divIcon({
            html: `<div style="
              background:rgba(255,255,255,.92);
              border:1.5px solid ${zone.color};
              border-radius:6px;padding:3px 8px;
              font-family:'Fira Code',monospace;font-size:10px;
              font-weight:700;color:${zone.color};
              white-space:nowrap;
              box-shadow:0 2px 8px rgba(0,0,0,.12);
            ">${zone.label}</div>`,
            className: "",
            iconAnchor: [60, 10],
          }),
        }).addTo(layers.restricted);
      });

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []); // Note: leaving [] because we only re-init map once per lifetime

  // ── Handle external active marker highlighting ────────────────────────────
  useEffect(() => {
    if (!activeMarkerId || !mapRef.current) return;
    
    // Find the marker element in the DOM and apply the highlight animation
    const el = document.getElementById(`marker-${activeMarkerId}`);
    if (el) {
      // Temporarily override styles for the highlight effect
      const origBorder = el.style.border;
      const origBoxShadow = el.style.boxShadow;
      const origTransform = el.style.transform;
      const origZIndex = el.style.zIndex;
      
      el.style.border = '5px double #ff9800'; // Double orange vivid highlight border
      el.style.boxShadow = '0 0 0 6px rgba(255,152,0,.35), 0 8px 25px rgba(0,0,0,.4)';
      el.style.transform = 'scale(1.6)';
      el.style.zIndex = '1000';
      
      setTimeout(() => {
        if (el) {
          el.style.border = origBorder;
          el.style.boxShadow = origBoxShadow;
          el.style.transform = origTransform;
          el.style.zIndex = origZIndex;
        }
      }, 1000); // 1 second animation
    }
  }, [activeMarkerId]);

  // ── Layer toggle ──────────────────────────────────────────────────────────
  const toggleLayer = (key: LayerKey) => {
    const map = mapRef.current;
    const layer = layersRef.current[key];
    if (!map || !layer) return;
    setLayerOn((prev) => {
      const nowOn = !prev[key];
      if (nowOn) map.addLayer(layer); else map.removeLayer(layer);
      return { ...prev, [key]: nowOn };
    });
  };

  // ── Zoom controls ─────────────────────────────────────────────────────────
  const mapZoom = (delta: number) => mapRef.current?.setZoom(mapRef.current.getZoom() + delta);
  const mapReset = () => mapRef.current?.setView([32.3668, -86.3], 13);

  const iconBtn = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        width: 28, height: 28, borderRadius: "50%",
        border: "1.5px solid #ddd8ce", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, cursor: "pointer", color: "#3a2f1e",
        transition: "background .15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#ebe6dc"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
    >{label}</button>
  );

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1c1409" }}>Live Incident Map</h2>
        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: "#8a7c6a", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          OpenStreetMap · ArcGIS · Montgomery Metro
        </span>
      </div>

      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(28,20,9,.07)", overflow: "hidden" }}>
        {/* Map header with title + filter buttons + zoom */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: "1px solid #f5f1ea", gap: 12, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Figtree',sans-serif", fontSize: 13, fontWeight: 700, color: "#1c1409" }}>
            Montgomery Incident Overlay
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {/* Layer toggle buttons */}
            {LAYER_BUTTONS.map(({ key, label, color }) => {
              const on = layerOn[key as LayerKey];
              return (
                <button
                  key={key}
                  onClick={() => toggleLayer(key as LayerKey)}
                  style={{
                    border: `1.5px solid ${on ? color : "#ddd8ce"}`,
                    background: on ? color : "#fff",
                    color: on ? "#fff" : "#8a7c6a",
                    borderRadius: 20, padding: "4px 12px",
                    fontFamily: "'Fira Code',monospace", fontSize: 10, fontWeight: 700,
                    cursor: "pointer", transition: "all .15s",
                  }}
                >{label}</button>
              );
            })}

            {/* Separator */}
            <div style={{ width: 1, height: 22, background: "#ddd8ce", margin: "0 2px" }} />

            {/* Zoom controls */}
            {iconBtn("＋", () => mapZoom(1))}
            {iconBtn("－", () => mapZoom(-1))}
            {iconBtn("⌂", mapReset)}
          </div>
        </div>

        {/* The Leaflet map container */}
        <div ref={mapElRef} style={{ height: mapHeight, width: "100%" }} />

        {/* Legend bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 16px", borderTop: "1px solid #f5f1ea", flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            {[
              { dot: "#ff4422", label: "Emergency / 911"   },
              { dot: "#f0900a", label: "Unverified Rumor"  },
              { dot: "#009980", label: "Verified Fact"     },
              { dot: "#3f3ad4", label: "Civic / 311"       },
            ].map(({ dot, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Fira Code',monospace", fontSize: 9, color: "#8a7c6a" }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                {label}
              </div>
            ))}
            {/* Restricted zone swatch */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Fira Code',monospace", fontSize: 9, color: "#8a7c6a" }}>
              <div style={{ width: 11, height: 9, border: "2px dashed #8a7c6a", borderRadius: 2, flexShrink: 0 }} />
              Restricted Zone
            </div>
          </div>
          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: "#8a7c6a" }}>
            OpenStreetMap · ArcGIS Open Data · Last sync 2 min ago
          </span>
        </div>
      </div>

      {/* CSS for OSM tile desaturation (matches gumpwiser.html) */}
      <style>{`
        .leaflet-tile-pane { filter: saturate(0.75) brightness(1.05); }
      `}</style>
    </div>
  );
}
