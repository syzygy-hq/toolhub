"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { converters } from "./cases";

export function CaseConverter() {
  const [input, setInput] = useState("Hello world example");

  const results = useMemo(() => {
    return Object.entries(converters).map(([label, fn]) => [label, fn(input)] as const);
  }, [input]);

  return (
    <div className="grid gap-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text…"
        className="h-24 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
      />
      <div className="grid gap-2">
        {results.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper p-3"
          >
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                {label}
              </p>
              <p className="truncate font-mono text-sm text-ink">{value || "—"}</p>
            </div>
            <CopyButton value={value} />
          </div>
        ))}
      </div>
    </div>
  );
}
