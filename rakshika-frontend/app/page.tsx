"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DM_Serif_Display, Poppins } from "next/font/google";

const display = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const sans = Poppins({ subsets: ["latin"], weight: ["600", "700"] });

const features = [
    {
        title: "SOS with live location",
        body: "One press emails your trusted contacts a link that tracks your position until you mark yourself safe.",
    },
    {
        title: "Trusted contacts",
        body: "Keep up to five people who get alerted. Add or remove them any time.",
    },
    {
        title: "Threat report analysis",
        body: "Paste a suspicious or threatening message. Get a category, a severity rating and practical next steps.",
    },
];

const steps = [
    {
        title: "Create an account",
        body: "Sign up with your email. No app to install, it runs in your browser.",
    },
    {
        title: "Add your trusted contacts",
        body: "Pick up to five people who should be alerted if you need help.",
    },
    {
        title: "Press SOS when you need to",
        body: "Your contacts get an email with a live location link. Mark yourself safe to stop sharing.",
    },
];

// same look as the Report page: pale turquoise -> pale olive + visible grid
const pageBackground = {
    backgroundImage: [
        "linear-gradient(rgba(85,107,47,0.12) 1px, transparent 1px)",
        "linear-gradient(90deg, rgba(85,107,47,0.12) 1px, transparent 1px)",
        "linear-gradient(135deg, #d3f0ea 0%, #e0ecd2 60%, #e3ebc8 100%)",
    ].join(", "),
    backgroundSize: "24px 24px, 24px 24px, auto",
};

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("token")) router.replace("/contacts");
    }, [router]);

    return (
        <div
            className="min-h-screen px-3 py-4 text-[#2f3b17] sm:px-6 sm:py-8"
            style={pageBackground}
        >
            {/* HERO PANEL */}
            <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-[#aebc8a] bg-[#fbfdf7] shadow-lg md:grid-cols-2">
                {/* left: logo + text */}
                <div className="flex flex-col px-6 py-5 sm:px-10">
                    <header className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-5 w-5 bg-[#556b2f]" />
                            <span className={`${display.className} text-xl`}>Rakshika</span>
                        </div>
                        {/* mobile only: nav stays here because the photo drops below */}
                        <nav className="flex items-center gap-4 text-sm font-semibold md:hidden">
                            <a href="#how-it-works" className="hover:underline">
                                How it works
                            </a>
                            <Link href="/login" className="hover:underline">
                                Log in
                            </Link>
                        </nav>
                    </header>

                    <div className="grid gap-5 py-12 md:my-auto">
                        <h1 className={`${display.className} text-5xl leading-[1.05] sm:text-6xl`}>
                            Your Everyday
                            <br />
                            Safety Buddy.
                        </h1>
                        <p
                            className={`${sans.className} text-xl font-bold text-[#556b2f] sm:text-2xl`}
                        >
                            Go wherever you want. We&apos;ve got your back.
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4">
                            <Link
                                href="/register"
                                className="btn !min-w-[240px] !rounded-full !px-12 !py-3.5 text-center"
                            >
                                Get started
                            </Link>
                            <Link href="/login" className="text-sm font-semibold underline">
                                I already have an account
                            </Link>
                        </div>
                        <p className="muted text-xs">Free. Takes about a minute to set up.</p>
                    </div>
                </div>

                {/* right: nav above photo, then photo */}
                <div className="flex flex-col px-4 pb-4 md:pt-5">
                    <nav className="hidden items-center justify-end gap-5 px-2 pb-4 text-sm font-semibold md:flex">
                        <a href="#how-it-works" className="hover:underline">
                            How it works
                        </a>
                        <Link href="/login" className="hover:underline">
                            Log in
                        </Link>
                    </nav>
                    <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl">
                        <Image
                            src="/womenpic.webp"
                            alt="Illustration of women with flowing hair gathered in a circle"
                            fill
                            priority
                            unoptimized
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
            {/* REST OF PAGE */}
            <main className="mx-auto mt-12 grid max-w-3xl gap-12 px-1 pb-10 sm:px-4">
                <section className="grid gap-4">
                    <h2 className={`${display.className} text-3xl`}>What you get</h2>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {features.map((f) => (
                            <div key={f.title} className="card">
                                <h3 className="mb-2 text-base">{f.title}</h3>
                                <p className="muted text-sm">{f.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="how-it-works" className="grid scroll-mt-6 gap-4">
                    <h2 className={`${display.className} text-3xl`}>How it works</h2>
                    <ol className="grid gap-3">
                        {steps.map((s, i) => (
                            <li key={s.title} className="card flex gap-4">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#556b2f] text-sm font-bold text-white">
                                    {i + 1}
                                </span>
                                <div>
                                    <h3 className="mb-1 text-base">{s.title}</h3>
                                    <p className="muted text-sm">{s.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="border border-[#aebc8a] bg-[#fbfdf7]/70 p-4 text-sm">
                    <p className="mb-1 font-semibold">Good to know</p>
                    <p className="muted">
                        This is a web app, so your screen must stay on while sharing
                        location. It is not connected to 112 or any police service. In
                        immediate danger, call 112 directly. Alert emails can land in spam,
                        so tell your contacts to check there. The first load can take up to
                        a minute while the server wakes up.
                    </p>
                </section>

                <section className="card grid gap-4 !p-8 text-center">
                    <h2 className={`${display.className} text-3xl`}>
                        Set it up before you need it
                    </h2>
                    <p className="muted mx-auto max-w-md text-sm">
                        Adding your contacts takes a minute. Do it now, not when you are
                        already somewhere unfamiliar.
                    </p>
                    <div>
                        <Link
                            href="/register"
                            className="btn !min-w-[240px] !rounded-full !px-12 !py-3.5 text-center"
                        >
                            Create your account
                        </Link>
                    </div>
                </section>

                <footer className="muted text-center text-xs">
                    Built by Muskan.
                </footer>
            </main>
        </div>
    );
}