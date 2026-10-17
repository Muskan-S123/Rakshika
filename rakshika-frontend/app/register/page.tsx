"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage(){
    const router=useRouter();
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [phone, setPhone]=useState("");
    const [password, setPassword]=useState("");
    const [error, setError]=useState("");
    const [loading, setLoading]=useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            await api.register(name, email, phone, password);
            router.push("/login");
        } catch(err){
            setError(err instanceof Error? err.message:"Registration failed");
        } finally{
            setLoading(false);
        }
    }

    return(
         <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-6">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Name" required
          value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 rounded" type="email" placeholder="Email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Phone (optional)"
          value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="border p-2 rounded" type="password" placeholder="Password (min 8)"
          required minLength={8} maxLength={72}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-black text-white p-2 rounded disabled:opacity-50" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </main>

    );
}
