"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);

  const { formatted, minified, error } = useMemo(() => {
    if (!input.trim()) {
      return { formatted: "", minified: "", error: null as string | null };
    }
    try {
      const parsed = JSON.parse(input);
      return {
        formatted: JSON.stringify(parsed, null, indent),
        minified: JSON.stringify(parsed),
        error: null as string | null,
      };
    } catch (err) {
      return { formatted: "", minified: "", error: describeJsonError(err, input) };
    }
  }, [input, indent]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Paste JSON
          </label>
          <div className="flex items-center gap-2">
            <label className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              Indent
            </label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded-md border border-line bg-paper px-2 py-1 font-mono text-xs text-ink"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={0}>Tab</option>
            </select>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"hello": "world"}'
          spellCheck={false}
          className="h-80 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            {error ? "Error" : "Formatted"}
          </label>
          {!error && formatted && (
            <div className="flex gap-2">
              <CopyButton value={formatted} label="Copy pretty" />
              <CopyButton value={minified} label="Copy minified" />
            </div>
          )}
        </div>
        <pre
          className={`h-80 w-full overflow-auto rounded-lg border p-3 font-mono text-sm ${
            error
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-line bg-paper text-ink"
          }`}
        >
          {error ?? formatted ?? "Formatted JSON will appear here."}
        </pre>
      </div>
    </div>
  );
}

function describeJsonError(err: unknown, input: string): string {
  const message = err instanceof Error ? err.message : "Invalid JSON";
  const positionMatch = message.match(/position (\d+)/);
  if (!positionMatch) return message;

  const position = Number(positionMatch[1]);
  const before = input.slice(0, position);
  const line = before.split("\n").length;
  const column = position - before.lastIndexOf("\n");
  return `${message} (line ${line}, column ${column})`;
}
