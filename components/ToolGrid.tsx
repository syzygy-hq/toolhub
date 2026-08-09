"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { tools, categories, type ToolCategory } from "@/lib/tools-registry";
import { ToolCard } from "./ToolCard";

export function ToolGrid() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ToolCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = active === "All" || tool.category === active;
      const matchesQuery =
        q.length === 0 ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, active]);

  return (
    <div id="tools" className="mx-auto max-w-6xl px-5 pb-24">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["All", ...categories] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                active === category
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper-card text-ink-soft hover:border-amber hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools…"
          className="w-full rounded-full border border-line bg-paper-card px-4 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-amber sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-paper-card px-5 py-10 text-center font-mono text-sm text-ink-soft">
          No tools match “{query}” yet — maybe you should build it.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
          <Link
            href="/contribute"
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-transparent p-5 pt-6 text-center transition-colors hover:border-amber"
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-dashed border-line text-ink-soft transition-colors group-hover:border-amber group-hover:text-amber">
              <Plus className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-semibold text-ink-soft transition-colors group-hover:text-ink">
              Add your tool
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              Open a PR, get credited
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
