"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface Result {
  url: string;
  ok: boolean;
  status: number | null;
  error: string | null;
}

export function BrokenLinkChecker() {
  const [urls, setUrls] = useState("https://example.com\nhttps://example.com/this-page-does-not-exist");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    const list = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    if (list.length === 0) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/tools/broken-link-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: list }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResults(data.results);
    } catch {
      setError("Couldn't reach the checker service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <textarea
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder="One URL per line…"
        className="h-32 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
      />

      <button
        onClick={check}
        disabled={loading}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Check links
      </button>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {results && (
        <div className="grid gap-2">
          {results.map((r) => (
            <div
              key={r.url}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                r.ok ? "border-line bg-paper" : "border-red-300 bg-red-50"
              }`}
            >
              {r.ok ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-red-600" />
              )}
              <p className="flex-1 truncate font-mono text-sm text-ink">{r.url}</p>
              <span className="font-mono text-xs text-ink-soft">{r.status ?? r.error}</span>
            </div>
          ))}
        </div>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Checks up to 25 URLs at a time. Local and private network addresses
        are always blocked.
      </p>
    </div>
  );
}
