"use client";
import { useEffect } from "react";

export function useLiveLocation(token: string | null, onEnded: () => void) {
  useEffect(() => {
    if (!token || !navigator.geolocation) return;

    let lastSent = 0;

    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        if (now - lastSent < 10000) return;   // 1 update per 10s max
        lastSent = now;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/sos/${token}/location`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              }),
            }
          );
          if (res.status === 404 || res.status === 410) onEnded();
        } catch (err) {
          console.warn("location update failed", err);
        }
      },
      (err) => console.warn("geolocation error", err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [token]);
}