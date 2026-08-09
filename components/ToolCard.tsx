import Link from "next/link";
import { Icon } from "./Icon";
import type { ToolMeta } from "@/lib/tools-registry";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col rounded-xl border border-line bg-paper-card p-5 pt-6 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all duration-150 hover:-translate-y-0.5 hover:rotate-[-0.3deg] hover:border-amber"
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-paper"
      />
      <div className="mb-4 flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-paper text-ink transition-colors group-hover:border-amber group-hover:text-amber">
          <Icon name={tool.icon} className="h-5 w-5" />
        </span>
        {tool.needsBackend && (
          <span className="rounded-full border border-steel/40 bg-steel-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-steel">
            Needs key
          </span>
        )}
      </div>
      <h3 className="font-display text-base font-semibold leading-snug text-ink">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {tool.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-dashed border-line pt-3">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
          {tool.category}
        </span>
        {tool.premiumAlternativeTo && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-amber">
            Free alt
          </span>
        )}
      </div>
    </Link>
  );
}
