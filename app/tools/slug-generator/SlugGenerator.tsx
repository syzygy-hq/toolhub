"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

// Combining diacritical marks left behind by NFKD normalization (e.g. the ´ in é).
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

export function SlugGenerator() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);

  const slug = useMemo(() => {
    let value = input
      .normalize("NFKD")
      .replace(COMBINING_MARKS, "")
      .replace(/[^a-zA-Z0-9\s-_]/g, "")
      .trim()
      .replace(/[\s_-]+/g, separator || "-");
    if (lowercase) value = value.toLowerCase();
    return value;
  }, [input, separator, lowercase]);

  return (
    <div className="grid gap-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="10 Best Coffee Shops in Kathmandu (2026 Guide)"
        className="h-24 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Separator
          </label>
          <div className="flex gap-1">
            {["-", "_"].map((s) => (
              <button
                key={s}
                onClick={() => setSeparator(s)}
                className={`rounded-md border px-3 py-1 font-mono text-xs transition-colors ${
                  separator === s
                    ? "border-amber bg-amber-soft text-ink"
                    : "border-line text-ink-soft hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="accent-amber"
          />
          Lowercase
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper p-3">
        <code className="break-all font-mono text-sm text-ink">{slug || "—"}</code>
        <CopyButton value={slug} />
      </div>
    </div>
  );
}
