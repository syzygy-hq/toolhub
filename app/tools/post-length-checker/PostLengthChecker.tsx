"use client";

import { useState } from "react";
import { platforms } from "./platforms";

export function PostLengthChecker() {
  const [text, setText] = useState("");
  const length = text.length;

  return (
    <div className="grid gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your post…"
        className="h-40 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
      />
      <p className="font-mono text-xs text-ink-soft">{length.toLocaleString()} characters</p>

      <div className="grid gap-2">
        {platforms.map((p) => {
          const ratio = Math.min(1, length / p.limit);
          const over = length > p.limit;
          return (
            <div key={p.name} className="rounded-lg border border-line bg-paper p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-ink">{p.name}</span>
                <span className={`font-mono text-xs ${over ? "text-red-600" : "text-ink-soft"}`}>
                  {length.toLocaleString()} / {p.limit.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full transition-all ${over ? "bg-red-500" : "bg-amber"}`}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
