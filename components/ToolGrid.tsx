"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { tools, categories, categorySlug } from "@/lib/tools-registry";
import { ToolCard } from "./ToolCard";
import { CategoryRail } from "./CategoryRail";

export function ToolGrid() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [q, isSearching]);

  return (
    <div id="tools" className="mx-auto max-w-7xl px-5 pb-24">
      <div className="relative mb-8 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tools…"
          className="w-full rounded-full border border-line bg-paper-card py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft focus:border-amber"
        />
      </div>

      {isSearching ? (
        searchResults.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-paper-card px-5 py-10 text-center font-mono text-sm text-ink-soft">
            No tools match &ldquo;{query}&rdquo; yet — maybe you should build it.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchResults.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          <CategoryRail />
          <div className="min-w-0 flex-1">
            {categories.map((category) => {
              const slug = categorySlug(category);
              const categoryTools = tools.filter((t) => t.category === category);
              return (
                <section key={category} id={`cat-${slug}`} className="scroll-mt-24 mb-10">
                  <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                      {category}
                    </h2>
                    <span className="font-mono text-[10px] text-ink-soft">
                      [{String(categoryTools.length).padStart(2, "0")}]
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-line" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })}

            <Link
              href="/contribute"
              className="group flex items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-transparent px-5 py-6 text-center transition-colors hover:border-amber"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-dashed border-line text-ink-soft transition-colors group-hover:border-amber group-hover:text-amber">
                <Plus className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-display text-sm font-semibold text-ink-soft transition-colors group-hover:text-ink">
                  Add your tool
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  Open a PR, get credited
                </span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
