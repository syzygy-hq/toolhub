import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Icon } from "./Icon";
import type { ToolMeta } from "@/lib/tools-registry";

export function ToolLayout({
  tool,
  children,
}: {
  tool: ToolMeta;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-amber transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All tools
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-line bg-paper-card text-ink">
          <Icon name={tool.icon} className="h-6 w-6" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {tool.name}
            </h1>
            {tool.needsBackend && (
              <span className="rounded-full border border-steel/40 bg-steel-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-steel">
                Needs key
              </span>
            )}
          </div>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
            {tool.description}
          </p>
          {tool.premiumAlternativeTo && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-amber">
              Free alternative to {tool.premiumAlternativeTo}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-paper-card p-5 sm:p-8">
        {children}
      </div>

      <p className="mt-6 text-center font-mono text-[11px] text-ink-soft">
        Built by{" "}
        {tool.author.url ? (
          <a
            href={tool.author.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-amber transition-colors"
          >
            {tool.author.name}
          </a>
        ) : (
          tool.author.name
        )}
        . Runs {tool.needsBackend ? "with a small server assist" : "entirely in your browser"}.
      </p>
    </div>
  );
}
