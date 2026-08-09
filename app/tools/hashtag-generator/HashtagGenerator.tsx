"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { stopwords } from "./stopwords";

function toHashtag(word: string, casing: "lower" | "pascal"): string {
  if (casing === "lower") return `#${word.toLowerCase()}`;
  return `#${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`;
}

export function HashtagGenerator() {
  const [input, setInput] = useState("Sunday morning coffee and slow productive coding sessions");
  const [casing, setCasing] = useState<"lower" | "pascal">("lower");
  const [custom, setCustom] = useState("");
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const words = useMemo(() => {
    const found = input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopwords.has(w));
    return Array.from(new Set(found));
  }, [input]);

  const customTags = custom
    .split(/[\s,]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean);

  const allTags = useMemo(() => {
    const generated = words.filter((w) => !removed.has(w)).map((w) => toHashtag(w, casing));
    const extra = customTags.map((t) => toHashtag(t, casing));
    return Array.from(new Set([...generated, ...extra]));
  }, [words, removed, casing, customTags]);

  return (
    <div className="grid gap-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your caption or describe the topic…"
        className="h-24 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {(["lower", "pascal"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCasing(c)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                casing === c
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {c === "lower" ? "#lowercase" : "#PascalCase"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
          Extracted from your text — click to remove
        </p>
        <div className="flex flex-wrap gap-2">
          {words.map((w) => (
            <button
              key={w}
              onClick={() =>
                setRemoved((prev) => {
                  const next = new Set(prev);
                  if (next.has(w)) next.delete(w);
                  else next.add(w);
                  return next;
                })
              }
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                removed.has(w)
                  ? "border-line text-ink-soft line-through opacity-50"
                  : "border-amber/40 bg-amber-soft text-ink"
              }`}
            >
              {toHashtag(w, casing)}
            </button>
          ))}
          {words.length === 0 && (
            <p className="font-mono text-xs text-ink-soft">No keywords found — try a longer caption.</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Add your own tags (comma or space separated)
        </label>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="indiehacker, buildinpublic"
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Final set ({allTags.length})
          </label>
          <CopyButton value={allTags.join(" ")} />
        </div>
        <p className="rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink">
          {allTags.join(" ") || "—"}
        </p>
      </div>
    </div>
  );
}
