"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle, HelpCircle } from "lucide-react";

interface Result {
  platform: string;
  profileUrl: string;
  available: boolean | null;
}

export function UsernameChecker() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`/api/tools/username-checker?username=${encodeURIComponent(username.trim())}`);
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
      <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
        />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-amber bg-amber-soft px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Check
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {results && (
        <div className="grid gap-2">
          {results.map((r) => (
            <a
              key={r.platform}
              href={r.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-line bg-paper p-3 hover:border-amber transition-colors"
            >
              {r.available === true ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber" />
              ) : r.available === false ? (
                <XCircle className="h-4 w-4 shrink-0 text-red-600" />
              ) : (
                <HelpCircle className="h-4 w-4 shrink-0 text-ink-soft" />
              )}
              <p className="flex-1 text-sm text-ink">{r.platform}</p>
              <span className="font-mono text-xs text-ink-soft">
                {r.available === true ? "Available" : r.available === false ? "Taken" : "Unknown"}
              </span>
            </a>
          ))}
        </div>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Checks developer platforms with genuine public APIs (GitHub, GitLab,
        Dev.to, Hacker News). Sites like Instagram or X aren&apos;t included —
        their apps don&apos;t expose a reliable, ToS-friendly way to check this
        without an account.
      </p>
    </div>
  );
}
