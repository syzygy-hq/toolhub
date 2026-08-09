"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function LineTools() {
  const [text, setText] = useState("");
  const [dedupe, setDedupe] = useState(true);
  const [sort, setSort] = useState<"none" | "asc" | "desc">("none");
  const [trimLines, setTrimLines] = useState(true);
  const [removeBlank, setRemoveBlank] = useState(true);

  const output = useMemo(() => {
    let lines = text.split("\n");
    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeBlank) lines = lines.filter((l) => l !== "");
    if (dedupe) lines = Array.from(new Set(lines));
    if (sort === "asc") lines = [...lines].sort((a, b) => a.localeCompare(b));
    if (sort === "desc") lines = [...lines].sort((a, b) => b.localeCompare(a));
    return lines.join("\n");
  }, [text, dedupe, sort, trimLines, removeBlank]);

  const inputLineCount = text ? text.split("\n").length : 0;
  const outputLineCount = output ? output.split("\n").length : 0;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wide text-ink-soft">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
            className="accent-amber"
          />
          Remove duplicates
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={removeBlank}
            onChange={(e) => setRemoveBlank(e.target.checked)}
            className="accent-amber"
          />
          Remove blank lines
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="accent-amber"
          />
          Trim whitespace
        </label>
        <div className="ml-auto flex gap-1">
          {(["none", "asc", "desc"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-md border px-2.5 py-1 normal-case transition-colors ${
                sort === s
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {s === "none" ? "Original order" : s === "asc" ? "Sort A→Z" : "Sort Z→A"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Input ({inputLineCount} lines)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"banana\napple\nbanana\ncherry"}
            className="h-64 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              Output ({outputLineCount} lines)
            </label>
            {output && <CopyButton value={output} />}
          </div>
          <pre className="h-64 w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
