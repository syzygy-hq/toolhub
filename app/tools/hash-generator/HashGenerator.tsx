"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!input) return;
    let cancelled = false;
    const data = new TextEncoder().encode(input);
    Promise.all(
      ALGORITHMS.map(async (algo) => {
        const buffer = await crypto.subtle.digest(algo, data);
        return [algo, toHex(buffer)] as const;
      })
    ).then((results) => {
      if (!cancelled) setHashes(Object.fromEntries(results));
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  const displayHashes = input ? hashes : {};

  return (
    <div className="grid gap-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to hash…"
        className="h-32 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
      />
      <div className="grid gap-3">
        {ALGORITHMS.map((algo) => (
          <div key={algo} className="rounded-lg border border-line bg-paper p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                {algo}
              </span>
              {displayHashes[algo] && <CopyButton value={displayHashes[algo]} />}
            </div>
            <code className="block break-all font-mono text-xs text-ink">
              {displayHashes[algo] ?? "—"}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
