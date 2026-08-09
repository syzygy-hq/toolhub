"use client";

import { useMemo, useState } from "react";

const FLAG_OPTIONS = [
  { flag: "g", label: "Global" },
  { flag: "i", label: "Case-insensitive" },
  { flag: "m", label: "Multiline" },
  { flag: "s", label: "Dot-all" },
] as const;

export function RegexTester() {
  const [pattern, setPattern] = useState("[a-z]+@[a-z]+\\.[a-z]+");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g", "i"]));
  const [text, setText] = useState("Contact us at hello@example.com or sales@toolbox.dev.");

  function toggleFlag(flag: string) {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  }

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: null as string | null };
    try {
      return { regex: new RegExp(pattern, Array.from(flags).join("")), error: null as string | null };
    } catch (err) {
      return { regex: null, error: err instanceof Error ? err.message : "Invalid pattern" };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !text) return [];
    if (!regex.global) {
      const m = regex.exec(text);
      return m ? [m] : [];
    }
    return Array.from(text.matchAll(regex));
  }, [regex, text]);

  const highlighted = useMemo(() => {
    if (matches.length === 0) return [{ text, isMatch: false }];
    const parts: { text: string; isMatch: boolean }[] = [];
    let cursor = 0;
    for (const match of matches) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (start > cursor) parts.push({ text: text.slice(cursor, start), isMatch: false });
      parts.push({ text: match[0] || " ", isMatch: true });
      cursor = end > cursor ? end : cursor + 1;
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor), isMatch: false });
    return parts;
  }, [matches, text]);

  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Pattern
        </label>
        <div className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 focus-within:border-amber">
          <span className="font-mono text-ink-soft">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-sm text-ink outline-none"
          />
          <span className="font-mono text-ink-soft">/{Array.from(flags).join("")}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FLAG_OPTIONS.map(({ flag, label }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
              flags.has(flag)
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {flag} — {label}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Test string
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-32 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <div>
          <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft">
            {matches.length} match{matches.length === 1 ? "" : "es"}
          </p>
          <pre className="w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink">
            {highlighted.map((part, i) =>
              part.isMatch ? (
                <mark key={i} className="rounded bg-amber-soft text-ink">
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </pre>
        </div>
      )}

      {matches.length > 0 && matches.some((m) => m.length > 1) && (
        <div className="rounded-lg border border-line bg-paper p-3">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
            Capture groups
          </p>
          <div className="grid gap-1 font-mono text-xs text-ink">
            {matches.map((m, i) =>
              m.slice(1).map((g, gi) => (
                <p key={`${i}-${gi}`}>
                  Match {i + 1}, group {gi + 1}: <span className="text-amber">{g ?? "—"}</span>
                </p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
