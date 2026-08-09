"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Result {
  score: number | null;
  metrics: Record<string, string | null>;
}

const METRIC_LABELS: Record<string, string> = {
  firstContentfulPaint: "First Contentful Paint",
  largestContentfulPaint: "Largest Contentful Paint",
  totalBlockingTime: "Total Blocking Time",
  cumulativeLayoutShift: "Cumulative Layout Shift",
  speedIndex: "Speed Index",
};

function scoreColor(score: number | null): string {
  if (score === null) return "text-ink-soft";
  if (score >= 90) return "text-green-600";
  if (score >= 50) return "text-amber";
  return "text-red-600";
}

export function SpeedTest() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/tools/speed-test?url=${encodeURIComponent(url.trim())}&strategy=${strategy}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResult(data);
    } catch {
      setError("Couldn't reach the speed test service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
        />
        <div className="flex gap-2">
          {(["mobile", "desktop"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStrategy(s)}
              className={`rounded-md border px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                strategy === s ? "border-amber bg-amber-soft text-ink" : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-amber bg-amber-soft px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Test
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {result && (
        <div className="grid gap-4">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-line bg-paper-card p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">Performance score</p>
            <p className={`font-display text-5xl font-bold ${scoreColor(result.score)}`}>
              {result.score ?? "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(result.metrics).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-line bg-paper p-3">
                <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  {METRIC_LABELS[key] ?? key}
                </p>
                <p className="mt-1 font-display text-sm font-bold text-ink">{value ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Runs a real Lighthouse audit via Google PageSpeed Insights. This is a
        shared free quota, so it can occasionally be slow or rate-limited —
        try again if it fails.
      </p>
    </div>
  );
}
