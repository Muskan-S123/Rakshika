"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LiveMap({ lat, lng }: { lat: number; lng: number }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current).setView([lat, lng], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current);
    marker.current = L.circleMarker([lat, lng], {
      radius: 10,
      color: "#fff",
      weight: 3,
      fillColor: "#e11d48",
      fillOpacity: 1,
    }).addTo(map.current);
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    marker.current?.setLatLng([lat, lng]);
    map.current?.panTo([lat, lng]);
  }, [lat, lng]);

  return <div ref={el} style={{ height: 360, width: "100%" }} />;
}
