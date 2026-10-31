"use client";

import { useEffect, useState } from "react";
import { api, Report } from "@/lib/api";

function actionsOf(r: Report): string[] {
  if (Array.isArray(r.suggested_actions)) return r.suggested_actions;
  try {
    const parsed = JSON.parse(r.suggested_actions);
    return Array.isArray(parsed) ? parsed : [String(r.suggested_actions)];
  } catch {
    return r.suggested_actions ? [r.suggested_actions] : [];
  }
}

function sevClass(s: string) {
  const v = s.toLowerCase();
  if (v === "high" || v === "critical") return "sev-high";
  if (v === "medium") return "sev-medium";
  return "sev-low";
}

function ReportBody({ r }: { r: Report }) {
  const actions = actionsOf(r);
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge capitalize">{r.category}</span>
        <span className={`badge capitalize ${sevClass(r.severity)}`}>
          {r.severity} severity
        </span>
        {r.created_at && (
          <span className="muted text-xs">
            {new Date(r.created_at).toLocaleString()}
          </span>
        )}
      </div>
      <p>{r.explanation}</p>
      {actions.length > 0 && (
        <div>
          <p className="mb-1 text-sm font-semibold">What to do</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
      <details>
        <summary className="muted cursor-pointer text-sm">Original message</summary>
        <p className="mt-2 whitespace-pre-wrap border border-[#d5dfba] bg-white p-3 text-sm">
          {r.message_text}
        </p>
      </details>
    </div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [latest, setLatest] = useState<Report | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setReports(await api.listReports());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (analyzing) return;
    setError("");
    setLatest(null);
    setAnalyzing(true);
    try {
      const r = await api.createReport(text.trim());
      setLatest(r);
      setReports((prev) => [r, ...prev]);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-2xl gap-5 px-4 py-8">
      <div>
        <h1 className="text-xl">Report a threat</h1>
        <p className="muted mt-1 text-sm">
          Paste the message you received. The analysis is automated and can be
          wrong. If you are in danger, call 112.
        </p>
      </div>

      {/* 1. input box */}
      <section className="card">
        <form onSubmit={handleSubmit} className="grid gap-3">
          <label htmlFor="msg" className="text-sm font-semibold">
            Message to analyze
          </label>
          <textarea
            id="msg"
            rows={6}
            className="input"
            placeholder="Paste the message here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={analyzing}
          />
          <button
            type="submit"
            className="btn"
            disabled={analyzing || text.trim().length === 0}
          >
            {analyzing ? "Analyzing..." : "Analyze message"}
          </button>
        </form>
      </section>

      {/* 2. result box: always on screen, content changes */}
      <section className="card min-h-[160px]">
        <h2 className="mb-3 text-base">Analysis result</h2>
        {error ? (
          <p className="border border-[#e0a3a3] bg-[#fdf0ee] px-3 py-2 text-sm font-medium text-[#b91c1c]">
            {error}
          </p>
        ) : analyzing ? (
          <p className="muted animate-pulse text-sm">
            Analyzing your message. This can take a few seconds...
          </p>
        ) : latest ? (
          <ReportBody r={latest} />
        ) : (
          <p className="muted text-sm">
            Your result will appear here after you press Analyze.
          </p>
        )}
      </section>

      {/* 3. history */}
      <section className="card !p-0">
        <h2 className="border-b border-[#aebc8a] px-5 py-3 text-base">
          Past reports{" "}
          <span className="muted text-sm font-medium">({reports.length})</span>
        </h2>
        {reports.length === 0 && (
          <p className="muted px-5 py-4 text-sm">No reports yet.</p>
        )}
        {reports
          .filter((r) => r.id !== latest?.id)
          .map((r) => (
            <div key={r.id} className="border-b border-[#d5dfba] px-5 py-4 last:border-b-0">
              <ReportBody r={r} />
            </div>
          ))}
      </section>
    </main>
  );
}