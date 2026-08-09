"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function Base64JwtDecoder() {
  const [tab, setTab] = useState<"base64" | "jwt">("base64");

  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        {(["base64", "jwt"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {t === "base64" ? "Base64" : "JWT"}
          </button>
        ))}
      </div>
      {tab === "base64" ? <Base64Panel /> : <JwtPanel />}
    </div>
  );
}

function Base64Panel() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("decode");

  const output = useMemo(() => {
    if (!input) return { value: "", error: null as string | null };
    try {
      const value =
        mode === "encode"
          ? btoa(unescape(encodeURIComponent(input)))
          : decodeURIComponent(escape(atob(input)));
      return { value, error: null as string | null };
    } catch {
      return { value: "", error: "That doesn't look like valid Base64." };
    }
  }, [input, mode]);

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        {(["decode", "encode"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              mode === m
                ? "border-amber text-ink"
                : "border-line text-ink-soft hover:text-ink"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Text to encode…" : "Base64 to decode…"}
        className="h-32 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
      />
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Result
          </label>
          {output.value && <CopyButton value={output.value} />}
        </div>
        <pre
          className={`h-32 w-full overflow-auto rounded-lg border p-3 font-mono text-sm ${
            output.error
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-line bg-paper text-ink"
          }`}
        >
          {output.error ?? output.value}
        </pre>
      </div>
    </div>
  );
}

function JwtPanel() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "A JWT has three dot-separated parts." };
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      return { header, payload, error: null as string | null };
    } catch {
      return { error: "Couldn't decode this token — check it was pasted in full." };
    }
  }, [token]);

  return (
    <div className="grid gap-4">
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste a JWT (eyJhbGciOi...)"
        className="h-24 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink outline-none focus:border-amber"
      />
      {decoded?.error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {decoded.error}
        </p>
      )}
      {decoded && !decoded.error && (
        <div className="grid gap-4 sm:grid-cols-2">
          <JsonBlock label="Header" data={decoded.header} />
          <JsonBlock label="Payload" data={decoded.payload} />
        </div>
      )}
    </div>
  );
}

function JsonBlock({ label, data }: { label: string; data: unknown }) {
  const text = JSON.stringify(data, null, 2);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          {label}
        </label>
        <CopyButton value={text} />
      </div>
      <pre className="h-48 overflow-auto rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink">
        {text}
      </pre>
    </div>
  );
}

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return decodeURIComponent(escape(atob(padded)));
}
