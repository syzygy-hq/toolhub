"use client";

import { useMemo, useState } from "react";
import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Every day at midnight", expr: "0 0 * * *" },
  { label: "Every Monday at 9am", expr: "0 9 * * 1" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
];

export function CronExplainer() {
  const [expr, setExpr] = useState("*/15 * * * *");

  const { description, nextRuns, error } = useMemo(() => {
    if (!expr.trim()) {
      return { description: "", nextRuns: [] as string[], error: null as string | null };
    }
    try {
      const description = cronstrue.toString(expr, { throwExceptionOnParseError: true });
      const interval = CronExpressionParser.parse(expr, { currentDate: new Date() });
      const nextRuns = Array.from({ length: 5 }, () => interval.next().toDate().toString());
      return { description, nextRuns, error: null as string | null };
    } catch (err) {
      return {
        description: "",
        nextRuns: [] as string[],
        error: err instanceof Error ? err.message : "Couldn't parse that cron expression.",
      };
    }
  }, [expr]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.expr}
            onClick={() => setExpr(p.expr)}
            className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-soft transition-colors hover:border-amber hover:text-ink"
          >
            {p.label}
          </button>
        ))}
      </div>

      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        placeholder="*/15 * * * *"
        className="w-full rounded-md border border-line bg-paper px-3 py-2.5 font-mono text-lg text-ink outline-none focus:border-amber"
      />

      {error ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <>
          <p className="rounded-lg border border-line bg-amber-soft p-4 font-display text-lg font-semibold text-ink">
            {description}
          </p>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
              Next 5 runs
            </p>
            <div className="rounded-lg border border-line bg-paper">
              {nextRuns.map((run, i) => (
                <p
                  key={i}
                  className="border-b border-line px-3 py-2 font-mono text-sm text-ink last:border-0"
                >
                  {run}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
