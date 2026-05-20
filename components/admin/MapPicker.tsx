"use client";

import { useEffect, useRef } from "react";

// Centro de Álamos, Sonora (fallback inicial)
const ALAMOS_LAT = 27.0277;
const ALAMOS_LNG = -108.9389;

interface LatLng { lat: number; lng: number }

declare global {
  interface Window {
    google?: {
      maps?: {
        Map: new (el: HTMLElement, opts: Record<string, unknown>) => GMap;
        Marker: new (opts: Record<string, unknown>) => GMarker;
        event: { addListener: (target: object, event: string, cb: (e: { latLng?: { lat(): number; lng(): number } }) => void) => void };
      };
    };
    __initMapPicker?: () => void;
  }
}

type GMap = {
  setCenter: (pos: LatLng) => void;
  panTo: (pos: LatLng) => void;
};
type GMarker = {
  setPosition: (pos: LatLng) => void;
  getPosition: () => { lat(): number; lng(): number };
};

let scriptLoading: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.google?.maps?.Map) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Maps script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&loading=async&v=quarterly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Maps script failed"));
    document.head.appendChild(script);
  });
  return scriptLoading;
}

export default function MapPicker({
  value,
  onChange,
}: {
  value: LatLng | null;
  onChange: (v: LatLng) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GMap | null>(null);
  const markerRef = useRef<GMarker | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  useEffect(() => {
    if (!apiKey || !containerRef.current) return;

    let cancelled = false;
    loadGoogleMaps(apiKey).then(() => {
      if (cancelled || !containerRef.current || !window.google?.maps) return;
      const center = value ?? { lat: ALAMOS_LAT, lng: ALAMOS_LNG };

      const map = new window.google.maps.Map(containerRef.current, {
        center,
        zoom: value ? 17 : 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      mapRef.current = map;

      const marker = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });
      markerRef.current = marker;

      // Click en el mapa → mueve el pin
      window.google.maps.event.addListener(map, "click", (e) => {
        if (!e.latLng) return;
        const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        marker.setPosition(pos);
        onChange(pos);
      });

      // Arrastrar el pin → actualiza coords
      window.google.maps.event.addListener(marker, "dragend", () => {
        const p = marker.getPosition();
        onChange({ lat: p.lat(), lng: p.lng() });
      });
    }).catch((err) => {
      console.error("Maps load error:", err);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // Cuando cambia el valor externo (por ej. Google Places autofill) → mover pin
  useEffect(() => {
    if (!value || !mapRef.current || !markerRef.current) return;
    markerRef.current.setPosition(value);
    mapRef.current.panTo(value);
  }, [value]);

  if (!apiKey) {
    return (
      <div style={{ padding: 16, background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 8, fontSize: 13, color: "#92400e" }}>
        Para usar el selector de mapa, configura <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en tu <code>.env.local</code> y en Vercel.
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        style={{ width: "100%", height: 340, borderRadius: 10, border: "1px solid #dde1e7", background: "#f0f2f5" }}
      />
      {value && (
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--mono, monospace)" }}>
          📍 {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: 12, color: "var(--fg-3)" }}>
        Haz clic en el mapa para colocar el pin o arrástralo para ajustar.
      </div>
    </div>
  );
}
