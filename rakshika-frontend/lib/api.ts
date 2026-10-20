const API = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

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

function errorMessage(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    // FastAPI 422 validation errors
    return detail
      .map((d) => {
        const field = Array.isArray(d?.loc) ? d.loc[d.loc.length - 1] : "";
        return field ? `${field}: ${d.msg}` : d?.msg ?? "";
      })
      .filter(Boolean)
      .join(", ") || fallback;
  }
  return fallback;
}

async function request(path: string, options: RequestInit = {}) {
  if (!API) throw new Error("NEXT_PUBLIC_API_URL is not set");
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

  if (!res.ok) {
    // expired/invalid token: clear it and send the user back to login
    if (res.status === 401 && t) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    throw new Error(errorMessage(body?.detail, res.statusText || "Request failed"));
  }
  return body;
}

export const api = {
  register: (name:string, email: string, phone:string | undefined, password: string) =>
    request("/users", { 
      method: "POST", 
      body: JSON.stringify({ name, email, phone:phone || null, password }),
    }),

  login: async (email: string, password: string) => {
    if (!API) throw new Error("NEXT_PUBLIC_API_URL is not set");
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(errorMessage(data?.detail, "Login failed"));
    localStorage.setItem("token", data.access_token);
  },

  listContacts: (): Promise<Contact[]> => request("/contacts"),
  addContact: (c: Omit<Contact, "id">) =>
    request("/contacts", { method: "POST", body: JSON.stringify(c) }),
  deleteContact: (id: number) => request(`/contacts/${id}`, { method: "DELETE" }),
  sos: (lat: number | null, lng: number |null ) =>
    request("/sos",{
      method:"POST",
      body:JSON.stringify({latitude:lat, longitude:lng}),
    }),
  
};