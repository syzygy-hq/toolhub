"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);

  const { output, count, error } = useMemo(() => {
    if (!find) return { output: text, count: 0, error: null as string | null };
    try {
      const flags = caseSensitive ? "g" : "gi";
      const pattern = useRegex ? find : escapeRegExp(find);
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      return { output: text.replace(regex, replace), count: matches?.length ?? 0, error: null as string | null };
    } catch (err) {
      return { output: text, count: 0, error: err instanceof Error ? err.message : "Invalid pattern" };
    }
  }, [text, find, replace, useRegex, caseSensitive]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Find
          </label>
          <input
            value={find}
            onChange={(e) => setFind(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Replace with
          </label>
          <input
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wide text-ink-soft">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
            className="accent-amber"
          />
          Use regex
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="accent-amber"
          />
          Case-sensitive
        </label>
        {!error && <span className="ml-auto">{count} replaced</span>}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here…"
        className="h-40 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
      />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            {error ? "Error" : "Result"}
          </label>
          {!error && <CopyButton value={output} />}
        </div>
        <pre
          className={`h-40 w-full overflow-auto whitespace-pre-wrap rounded-lg border p-3 font-mono text-sm ${
            error
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-line bg-paper text-ink"
          }`}
        >
          {error ?? output}
        </pre>
      </div>
    </div>
  );
}
