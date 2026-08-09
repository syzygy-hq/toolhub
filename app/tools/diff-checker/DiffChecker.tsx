"use client";

import { useMemo, useState } from "react";
import { diffLines, diffWords } from "diff";

export function DiffChecker() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");
  const [mode, setMode] = useState<"lines" | "words">("lines");

  const parts = useMemo(
    () => (mode === "lines" ? diffLines(original, changed) : diffWords(original, changed)),
    [original, changed, mode]
  );

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const part of parts) {
      if (part.added) added += part.count ?? 0;
      if (part.removed) removed += part.count ?? 0;
    }
    return { added, removed };
  }, [parts]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Original
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="h-48 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Changed
          </label>
          <textarea
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            className="h-48 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["lines", "words"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                mode === m
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              By {m}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-ink-soft">
          <span className="text-amber">+{stats.added}</span>{" "}
          <span className="text-red-600">-{stats.removed}</span>
        </p>
      </div>

      <pre className="max-h-96 w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-sm">
        {parts.map((part, i) => (
          <span
            key={i}
            className={
              part.added
                ? "bg-amber-soft text-ink"
                : part.removed
                  ? "bg-red-50 text-red-700 line-through decoration-red-300"
                  : "text-ink-soft"
            }
          >
            {part.value}
          </span>
        ))}
      </pre>
    </div>
  );
}
