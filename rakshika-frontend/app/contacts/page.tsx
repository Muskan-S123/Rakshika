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
  async function handleDelete(id: number) { //async function name(params:type)
    if(!confirm("Are you sure you want to delete this contact?")) return;

    setError("");
    try{
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((c)=> c.id !== id));
    } catch(err){
      setError(err instanceof Error ? err.message: "Something went wrong");
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", display: "grid", gap: 12 }}>
      <h1>Contacts</h1>
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
            {c.name} ({c.relation}) - {c.email}, {c.phone} {" "}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
          
        ))}
      </ul>
    </main>
  );
}