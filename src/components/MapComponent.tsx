"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Station locations in Montgomery
const MOCK_STATIONS = [
    { id: 1, name: "Police Substation Central", lat: 32.3792, lng: -86.3077, type: "police" },
    { id: 2, name: "Fire Station 9", lat: 32.3650, lng: -86.2900, type: "fire" }
];

export default function MapComponent() {
    // Montgomery Coordinates
    const position: [number, number] = [32.3792, -86.3077];

    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* 311 Reports */}
            <Marker position={[32.3800, -86.3100]} icon={customIcon}>
                <Popup>
                    <div className="text-slate-900">
                        <strong>Case #10234</strong><br />Pothole repair on Dexter Ave. Status: Action Taken.
                    </div>
                </Popup>
            </Marker>

            {/* Safety Radius Overlay */}
            <Circle
                center={[32.3650, -86.2900]}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }}
                radius={1500}
            />

        </MapContainer>
    );
}
