"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Contact } from "@/lib/api";

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
      await api.sos(null, null);
      setSosMessage("SOS triggered. If you are in immediate danger, call 112 now.");
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

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", display: "grid", gap: 12 }}>
      <h1>Contacts</h1>

      <section style={{ display: "grid", gap: 8 }}>
        <button
          onClick={handleSos}
          disabled={sosSending || contacts.length === 0}
          style={{
            background: "crimson",
            color: "white",
            padding: "16px",
            fontSize: 18,
            fontWeight: "bold",
            border: "none",
            borderRadius: 8,
            opacity: sosSending || contacts.length === 0 ? 0.6 : 1,
          }}
        >
          {sosSending ? "Sending SOS..." : "SOS"}
        </button>
        {contacts.length === 0 && (
          <p>Add at least one contact before you can send an SOS.</p>
        )}
        {sosMessage && (
          <p style={{ color: sosFailed ? "red" : "green" }}>{sosMessage}</p>
        )}
        <a href="tel:112">Call 112 (emergency)</a>
      </section>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAdd} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input placeholder="Relation" value={relation} onChange={(e) => setRelation(e.target.value)} required />
        <button type="submit">Add contact</button>
      </form>

      {contacts.length === 0 && !error && <p>No contacts yet.</p>}
      <ul>
        {contacts.map((c) => (
          <li key={c.id}>
            {c.name} ({c.relation}) - {c.email}, {c.phone}{" "}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}