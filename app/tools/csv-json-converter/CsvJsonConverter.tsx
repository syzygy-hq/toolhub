"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { csvToJson, jsonToCsv } from "./csv";

export function CsvJsonConverter() {
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      if (mode === "csv-to-json") {
        return { output: JSON.stringify(csvToJson(input), null, 2), error: null };
      }
      return { output: jsonToCsv(JSON.parse(input)), error: null as string | null };
    } catch {
      return {
        output: "",
        error:
          mode === "csv-to-json"
            ? "Couldn't parse that as CSV."
            : "That doesn't look like valid JSON.",
      };
    }
  }, [input, mode]);

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        {(["csv-to-json", "json-to-csv"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              mode === m
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {m === "csv-to-json" ? "CSV → JSON" : "JSON → CSV"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            {mode === "csv-to-json" ? "CSV" : "JSON"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "csv-to-json"
                ? "name,age\nAda,32\nGrace,29"
                : '[{"name":"Ada","age":32}]'
            }
            spellCheck={false}
            className="h-72 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              {error ? "Error" : mode === "csv-to-json" ? "JSON" : "CSV"}
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
