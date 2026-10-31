"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Contact } from "@/lib/api";
import { useLiveLocation } from "@/lib/useLiveLocation";

const getLocation = () =>
  new Promise<{ lat: number | null; lng: number | null }>((resolve) => {
    if (!navigator.geolocation) return resolve({ lat: null, lng: null });
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve({ lat: null, lng: null }),
      { timeout: 8000, enableHighAccuracy: true }
    );
  });

export default function ContactPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [sosSending, setSosSending] = useState(false);
  const [sosMessage, setSosMessage] = useState("");
  const [sosFailed, setSosFailed] = useState(false);
  const [sosToken, setSosToken] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const data = await api.listContacts();
        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }
    load();
  }, []);

  // restore active session after refresh
  useEffect(() => {
    setSosToken(localStorage.getItem("sos_token"));
  }, []);

  // start sending GPS every ~10s while a session is active
  useLiveLocation(sosToken, () => {
    localStorage.removeItem("sos_token");
    setSosToken(null);
  });

  

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.addContact({ name, email, phone, relation });
      const data = await api.listContacts();
      setContacts(data);
      setName("");
      setEmail("");
      setPhone("");
      setRelation("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    setError("");
    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleSos() {
    if (sosSending) return;
    if (!confirm("Send an SOS alert to all your trusted contacts?")) return;

    setSosSending(true);
    setSosMessage("");
    setSosFailed(false);
    try {
      const { lat, lng } = await getLocation();
      const res = await api.sos(lat, lng);

      // start live location sharing
      if (res?.token) {
        localStorage.setItem("sos_token", res.token);
        setSosToken(res.token);
      }

      if (res && typeof res.sent === "number") {
        if (res.sent > 0) {
          setSosMessage(
            `SOS sent to ${res.sent} of ${res.total} contacts. If you are in immediate danger, call 112 now.`
          );
        } else {
          setSosFailed(true);
          setSosMessage("SOS could not be delivered to anyone. Call 112 now.");
        }
      } else {
        // old backend response, no counts yet
        setSosMessage("SOS triggered. If you are in immediate danger, call 112 now.");
      }
    } catch (err) {
      setSosFailed(true);
      setSosMessage(
        (err instanceof Error ? err.message : "SOS failed") +
          " - call 112 directly."
      );
    } finally {
      setSosSending(false);
    }
  }

  async function handleSafe() {
    if (!sosToken) return;
    try {
      await api.markSafe(sosToken);
    } catch {
      // ignore — even if the server call fails, stop locally
    }
    localStorage.removeItem("sos_token");
    setSosToken(null);
    setSosMessage("You marked yourself safe. Sharing stopped.");
    setSosFailed(false);
  }

      return (
    <main className="mx-auto grid max-w-2xl gap-5 px-4 py-8">
      {/* SOS */}
      <section className="card grid gap-4">
        <div>
          <h1 className="text-xl">Emergency</h1>
          <p className="muted mt-1 text-sm">
            Sends your location to everyone in your trusted list.
          </p>
        </div>

        <button
          onClick={handleSos}
          disabled={sosSending || contacts.length === 0}
          className="sos-btn"
        >
          {sosSending ? "SENDING..." : "SEND SOS"}
        </button>

        {contacts.length === 0 && (
          <p className="text-sm font-medium text-[#b45309]">
            Add a trusted contact below to enable SOS.
          </p>
        )}

        {sosMessage && (
          <p
            className={`border px-3 py-2 text-sm font-medium ${
              sosFailed
                ? "border-[#e0a3a3] bg-[#fdf0ee] text-[#b91c1c]"
                : "border-[#aebc8a] bg-[#eef3dc] text-[#3f4f1f]"
            }`}
          >
            {sosMessage}
          </p>
        )}

        {sosToken && (
          <div className="grid gap-3 border border-[#7cc4b6] bg-[#e3f4ef] p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-[#226b5e]">
              <span className="inline-block h-2.5 w-2.5 animate-pulse bg-[#2f8f7e]" />
              Sharing live location. Keep this tab open and the screen on.
            </p>
            <button onClick={handleSafe} className="btn btn-teal">
              I&apos;m safe, stop sharing
            </button>
          </div>
        )}

        <a href="tel:112" className="text-sm font-semibold text-[#b91c1c] underline">
          Call 112 (emergency)
        </a>
      </section>

      {error && (
        <p className="border border-[#e0a3a3] bg-[#fdf0ee] px-3 py-2 text-sm font-medium text-[#b91c1c]">
          {error}
        </p>
      )}

      {/* Add contact */}
      <section className="card">
        <h2 className="mb-4 text-base">Add trusted contact</h2>
        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)} required />
          <input className="input" placeholder="Relation (e.g. Sister)" value={relation}
            onChange={(e) => setRelation(e.target.value)} required />
          <input className="input" type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" placeholder="Phone" value={phone}
            onChange={(e) => setPhone(e.target.value)} required />
          <button type="submit" className="btn sm:col-span-2">Add contact</button>
        </form>
      </section>

      {/* Contact list */}
      <section className="card !p-0">
        <h2 className="border-b border-[#aebc8a] px-5 py-3 text-base">
          Trusted contacts{" "}
          <span className="muted text-sm font-medium">({contacts.length}/5)</span>
        </h2>
        {contacts.length === 0 && !error && (
          <p className="muted px-5 py-4 text-sm">No contacts yet.</p>
        )}
        {contacts.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 border-b border-[#d5dfba] px-5 py-4 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {c.name} <span className="badge ml-1">{c.relation}</span>
              </p>
              <p className="muted truncate text-sm">{c.email}</p>
              <p className="muted text-sm">{c.phone}</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="btn btn-danger-outline">
              Delete
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}