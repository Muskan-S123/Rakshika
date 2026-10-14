import { EXPORT_DETAIL } from "next/dist/shared/lib/constants";

const API = process.env.NEXT_PUBLIC_API_URL;

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  relation: string;
};

function token() {
  return typeof window === "undefined" ? null : localStorage.getItem("token");
}

async function request(path: string, options: RequestInit = {}) {
  const t = token();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => null);
  if (!res.ok){
    if(res.status==401) {  //if our token is expired instead of just giving errors it redirects us to the login page so that user can login again 
      localStorage.removeItem("token");
      if(typeof window != "undefined") window.location.href="/login";
      const detail=body?.detail;
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail ?? res.statusText));
    }

  }
  return body;
}

export const api = {
  register: (email: string, password: string) =>
    request("/users", { method: "POST", body: JSON.stringify({ email, password }) }),

  login: async (email: string, password: string) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(JSON.stringify(data?.detail ?? "Login failed"));
    localStorage.setItem("token", data.access_token);
  },

  listContacts: (): Promise<Contact[]> => request("/contacts"),
  addContact: (c: Omit<Contact, "id">) =>
    request("/contacts", { method: "POST", body: JSON.stringify(c) }),
  deleteContact: (id: number) => request(`/contacts/${id}`, { method: "DELETE" }),
};