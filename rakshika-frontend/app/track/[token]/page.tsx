"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
const LiveMap = dynamic(() => import("../../../components/LiveMap"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Track = {
  name: string;
  lat: number | null;
  lng: number | null;
  updated_at: string;
  expires_at: string;
};

export default function TrackPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;

    async function load() {
      try {
        const res = await fetch(`${API}/track/${token}`, { cache: "no-store" });
        if (res.status === 404) {
          if (!stop) setError("This link is invalid or the SOS has ended.");
          stop = true;
          return;
        }
        if (res.status === 410) {
          if (!stop) setError("This link has expired.");
          stop = true;
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (!stop) {
          setData(json);
          setError(null);
        }
      } catch {
        if (!stop) setError("Can't reach the server. Retrying...");
      }
    }

    load();
    const id = setInterval(() => {
      if (!stop) load();
    }, 10000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [token]);

  if (error && !data) return <main style={{ padding: 24 }}>{error}</main>;
  if (!data) return <main style={{ padding: 24 }}>Loading...</main>;

  const hasLoc = data.lat !== null && data.lng !== null;

  return (
    <main style={{ padding: 24, maxWidth: 480 }}>
      <h1>{data.name} sent an SOS</h1>
      {hasLoc ? (
        <>
         <LiveMap lat={data.lat!} lng={data.lng!} />
          <p>
            Last location: {data.lat}, {data.lng}
          </p>
          <p>
            <a
              href={`https://maps.google.com/?q=${data.lat},${data.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </p>
        </>
      ) : (
        <p>Location not shared.</p>
      )}
      <p>Last updated: {new Date(data.updated_at).toLocaleString()}</p>
      {error && <p>{error}</p>}
    </main>
  );
}