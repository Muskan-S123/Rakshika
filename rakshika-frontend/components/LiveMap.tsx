"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";  // a js library for mapping
import "leaflet/dist/leaflet.css";

export default function LiveMap({ lat, lng }: { lat: number; lng: number }) {  //useref is a react hook which is used when something else changes and it prevents re rendering
  const el = useRef<HTMLDivElement>(null);  //hold <div> page
  const map = useRef<L.Map | null>(null);   ///hold leaflet map
  const marker = useRef<L.CircleMarker | null>(null);  //hold red dot marker
  //three of them set to null as we are defining right now

  useEffect(() => {
    if (!el.current || map.current) return; 
    map.current = L.map(el.current).setView([lat, lng], 16);  //create map inside map and set coordinates as 16
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
      map.current?.remove(); //when component disappears destroy the map and reset to null
      map.current = null;
    };
  }, []);  //effect runs only once

  useEffect(() => {   //move the dot
    marker.current?.setLatLng([lat, lng]);
    map.current?.panTo([lat, lng]);
  }, [lat, lng]);  //effect runs everytime when each lat lng updates

  return <div ref={el} style={{ height: 360, width: "100%" }} />;
}
