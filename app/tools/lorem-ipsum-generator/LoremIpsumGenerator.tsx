"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { generateLorem } from "./lorem";

export function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<"words" | "sentences" | "paragraphs">(
    "paragraphs"
  );
  const [count, setCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [seed, setSeed] = useState(0);

  const text = useMemo(
    () => generateLorem(unit, count, startClassic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unit, count, startClassic, seed]
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(["words", "sentences", "paragraphs"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                unit === u
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
          className="w-16 rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
        />
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
          <input
            type="checkbox"
            checked={startClassic}
            onChange={(e) => setStartClassic(e.target.checked)}
            className="accent-amber"
          />
          Start with &quot;Lorem ipsum…&quot;
        </label>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </button>
      </div>

      <div>
        <div className="mb-1.5 flex justify-end">
          <CopyButton value={text} />
        </div>
        <pre className="h-64 w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 text-sm text-ink">
          {text}
        </pre>
      </div>
    </div>
  );
}
