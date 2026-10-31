"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/contacts", label: "Contacts" },
  { href: "/reports", label: "Reports" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  // no nav on auth pages or the public guardian tracking page
    if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/track")
  ) {
    return null;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("sos_token");
    setLoggedIn(false);
    router.push("/login");
  }

       return (
    <header className="sticky top-0 z-10 border-b border-[#aebc8a] bg-[#fbfdf7]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/contacts" className="flex items-center gap-2 text-lg font-bold text-[#1f2a24]">
          <span className="inline-block h-5 w-5 bg-[#556b2f]" />
          Rakshika
        </Link>
        <div className="flex items-center gap-1 text-sm">
          {loggedIn &&
            links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 font-medium ${
                  pathname.startsWith(l.href)
                    ? "bg-[#dfe8c4] text-[#3f4f1f]"
                    : "text-[#5c6b57] hover:bg-[#eef3dc]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          {loggedIn ? (
            <button
              onClick={logout}
              className="ml-2 px-3 py-1.5 font-medium text-[#5c6b57] hover:bg-[#eef3dc]"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}