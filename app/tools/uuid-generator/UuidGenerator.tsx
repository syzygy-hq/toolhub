"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { generateUlid } from "./ulid";

export function UuidGenerator() {
  const [format, setFormat] = useState<"uuid" | "ulid">("uuid");
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>(() => generate("uuid", 5));

  function generate(fmt: "uuid" | "ulid", n: number): string[] {
    return Array.from({ length: n }, () =>
      fmt === "uuid" ? crypto.randomUUID() : generateUlid()
    );
  }

  function regenerate(fmt: "uuid" | "ulid" = format, n: number = count) {
    setIds(generate(fmt, n));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(["uuid", "ulid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFormat(f);
                regenerate(f, count);
              }}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                format === f
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {f === "uuid" ? "UUID v4" : "ULID"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Count
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => {
              const n = Math.min(100, Math.max(1, Number(e.target.value) || 1));
              setCount(n);
              regenerate(format, n);
            }}
            className="w-16 rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
          />
        </div>
        <button
          onClick={() => regenerate()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper">
        {ids.map((id, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 last:border-0"
          >
            <code className="font-mono text-sm text-ink">{id}</code>
            <CopyButton value={id} />
          </div>
        ))}
      </div>

      {ids.length > 1 && (
        <div className="flex justify-end">
          <CopyButton value={ids.join("\n")} label="Copy all" />
        </div>
      )}
    </div>
  );
}
