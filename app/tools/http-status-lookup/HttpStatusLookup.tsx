"use client";

import { useMemo, useState } from "react";
import { statuses } from "./statuses";

const CATEGORY_COLOR: Record<string, string> = {
  Informational: "text-steel",
  Success: "text-amber",
  Redirection: "text-steel",
  "Client Error": "text-red-600",
  "Server Error": "text-red-600",
};

export function HttpStatusLookup() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return statuses;
    return statuses.filter(
      (s) =>
        String(s.code).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="grid gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by code or name — e.g. 404, teapot, redirect…"
        className="w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
      />
      <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-line">
        {filtered.length === 0 ? (
          <p className="p-4 font-mono text-sm text-ink-soft">No matching status code.</p>
        ) : (
          filtered.map((s) => (
            <div
              key={s.code}
              className="flex gap-4 border-b border-line p-3 last:border-0"
            >
              <span
                className={`w-14 shrink-0 font-mono text-lg font-bold ${CATEGORY_COLOR[s.category]}`}
              >
                {s.code}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{s.name}</p>
                <p className="text-sm text-ink-soft">{s.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
