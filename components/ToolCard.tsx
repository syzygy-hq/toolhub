import Link from "next/link";
import { Icon } from "./Icon";
import type { ToolMeta } from "@/lib/tools-registry";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-lg border border-line bg-paper-card p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-amber"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-paper text-ink transition-colors group-hover:border-amber group-hover:text-amber">
          <Icon name={tool.icon} className="h-4 w-4" />
        </span>
        <h3 className="flex-1 truncate font-display text-sm font-semibold leading-snug text-ink">
          {tool.name}
        </h3>
        <span
          aria-hidden
          title={tool.needsBackend ? "Needs a key" : "Runs in your browser"}
          className={`h-2 w-2 shrink-0 rounded-full ${
            tool.needsBackend ? "border border-steel" : "bg-amber"
          }`}
        />
      </div>
      <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">{tool.description}</p>
      {tool.premiumAlternativeTo && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-amber">Free alt</p>
      )}
    </Link>
  );
}
