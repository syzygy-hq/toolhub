"use client";

import { useEffect, useState } from "react";
import { categories, tools, categorySlug } from "@/lib/tools-registry";

function scrollToCategory(slug: string) {
  document.getElementById(`cat-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CategoryRail() {
  const [active, setActive] = useState(categorySlug(categories[0]));

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`cat-${categorySlug(c)}`))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("cat-", ""));
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        aria-label="Category directory"
        className="sticky top-24 hidden h-fit w-52 shrink-0 lg:block"
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          Directory
        </p>
        <ul className="grid gap-0.5">
          {categories.map((c) => {
            const slug = categorySlug(c);
            const count = tools.filter((t) => t.category === c).length;
            const hasBackend = tools.some((t) => t.category === c && t.needsBackend);
            const isActive = active === slug;
            return (
              <li key={c}>
                <button
                  onClick={() => scrollToCategory(slug)}
                  className={`flex w-full items-center gap-2.5 border-l-2 py-1.5 pl-3 text-left transition-colors ${
                    isActive
                      ? "border-amber text-ink"
                      : "border-transparent text-ink-soft hover:border-line hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      hasBackend ? "border border-steel" : "bg-amber"
                    }`}
                  />
                  <span className="flex-1 truncate font-mono text-xs uppercase tracking-wide">
                    {c}
                  </span>
                  <span className="font-mono text-[10px] text-ink-soft">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        aria-label="Category directory"
        className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 lg:hidden"
      >
        {categories.map((c) => {
          const slug = categorySlug(c);
          const isActive = active === slug;
          return (
            <button
              key={c}
              onClick={() => scrollToCategory(slug)}
              className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                isActive
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper-card text-ink-soft"
              }`}
            >
              {c}
            </button>
          );
        })}
      </nav>
    </>
  );
}
