"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

async function sha1Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export function PasswordBreachChecker() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ breached: boolean; count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    if (!password) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const hash = await sha1Hex(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!res.ok) throw new Error("Couldn't reach the breach database.");
      const text = await res.text();
      const match = text
        .split("\n")
        .map((line) => line.trim().split(":"))
        .find(([s]) => s === suffix);
      setResult(match ? { breached: true, count: Number(match[1]) } : { breached: false, count: 0 });
    } catch {
      setError("Couldn't reach the breach database. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setResult(null);
          }}
          placeholder="Type a password to check…"
          className="w-full rounded-md border border-line bg-paper px-3 py-2.5 pr-10 font-mono text-sm text-ink outline-none focus:border-amber"
        />
        <button
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <button
        onClick={check}
        disabled={!password || loading}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Check for breaches
      </button>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {result && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            result.breached ? "border-red-300 bg-red-50" : "border-amber bg-amber-soft"
          }`}
        >
          {result.breached ? (
            <ShieldAlert className="h-6 w-6 shrink-0 text-red-600" />
          ) : (
            <ShieldCheck className="h-6 w-6 shrink-0 text-ink" />
          )}
          <p className={`text-sm ${result.breached ? "text-red-700" : "text-ink"}`}>
            {result.breached
              ? `This password has appeared in ${result.count.toLocaleString()} known data breaches. Don't use it.`
              : "Good news — this password wasn't found in any known breach."}
          </p>
        </div>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Uses the Have I Been Pwned k-anonymity API: your password is hashed
        (SHA-1) in your browser, and only the first 5 characters of that hash
        are ever sent — never the password itself.
      </p>
    </div>
  );
}
