"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { curlToFetch } from "./curlToFetch";

const PLACEHOLDER = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`;

export function CurlToFetch() {
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return { output: curlToFetch(input), error: null as string | null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Couldn't parse that command.",
      };
    }
  }, [input]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          curl command
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          className="h-64 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            {error ? "Error" : "fetch()"}
          </label>
          {output && <CopyButton value={output} />}
        </div>
        <pre
          className={`h-64 w-full overflow-auto whitespace-pre-wrap rounded-lg border p-3 font-mono text-sm ${
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
