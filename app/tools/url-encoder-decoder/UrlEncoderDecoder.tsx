"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [component, setComponent] = useState(true);

  const { value, error } = useMemo(() => {
    if (!input) return { value: "", error: null as string | null };
    try {
      const value =
        mode === "encode"
          ? component
            ? encodeURIComponent(input)
            : encodeURI(input)
          : component
            ? decodeURIComponent(input)
            : decodeURI(input);
      return { value, error: null as string | null };
    } catch {
      return { value: "", error: "That doesn't look like a valid encoded URL." };
    }
  }, [input, mode, component]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              mode === m
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {m}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
          <input
            type="checkbox"
            checked={component}
            onChange={(e) => setComponent(e.target.checked)}
            className="accent-amber"
          />
          Component (encode spaces, &amp;, ?, …)
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "https://example.com/?q=hello world" : "https%3A%2F%2F..."}
        className="h-32 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
      />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Result
          </label>
          {value && <CopyButton value={value} />}
        </div>
        <pre
          className={`h-32 w-full overflow-auto rounded-lg border p-3 font-mono text-sm ${
            error
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-line bg-paper text-ink"
          }`}
        >
          {error ?? value}
        </pre>
      </div>
    </div>
  );
}
