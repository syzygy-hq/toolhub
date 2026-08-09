"use client";

import { useMemo, useState } from "react";
import * as yaml from "js-yaml";
import { CopyButton } from "@/components/CopyButton";

export function YamlJsonConverter() {
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      if (mode === "yaml-to-json") {
        return { output: JSON.stringify(yaml.load(input), null, 2), error: null as string | null };
      }
      return { output: yaml.dump(JSON.parse(input)), error: null as string | null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Couldn't convert that.",
      };
    }
  }, [input, mode]);

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        {(["yaml-to-json", "json-to-yaml"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              mode === m
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {m === "yaml-to-json" ? "YAML → JSON" : "JSON → YAML"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            {mode === "yaml-to-json" ? "YAML" : "JSON"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "yaml-to-json" ? "name: Ada\nage: 32" : '{"name":"Ada","age":32}'}
            spellCheck={false}
            className="h-72 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              {error ? "Error" : mode === "yaml-to-json" ? "JSON" : "YAML"}
            </label>
            {output && <CopyButton value={output} />}
          </div>
          <pre
            className={`h-72 w-full overflow-auto rounded-lg border p-3 font-mono text-sm ${
              error
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-line bg-paper text-ink"
            }`}
          >
            {error ?? output}
          </pre>
        </div>
      </div>
    </div>
  );
}
