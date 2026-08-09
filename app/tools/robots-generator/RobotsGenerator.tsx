"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

interface Rule {
  userAgent: string;
  disallow: string;
  allow: string;
}

export function RobotsGenerator() {
  const [rules, setRules] = useState<Rule[]>([{ userAgent: "*", disallow: "/admin/\n/private/", allow: "" }]);
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");

  function updateRule(index: number, patch: Partial<Rule>) {
    setRules((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRule() {
    setRules((prev) => [...prev, { userAgent: "", disallow: "", allow: "" }]);
  }

  function removeRule(index: number) {
    setRules((prev) => prev.filter((_, i) => i !== index));
  }

  const text = useMemo(() => {
    const blocks = rules.map((rule) => {
      const lines = [`User-agent: ${rule.userAgent || "*"}`];
      rule.disallow
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((p) => lines.push(`Disallow: ${p}`));
      rule.allow
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((p) => lines.push(`Allow: ${p}`));
      if (rule.disallow.trim() === "" && rule.allow.trim() === "") lines.push("Disallow:");
      return lines.join("\n");
    });
    const sitemapLine = sitemap.trim() ? `\n\nSitemap: ${sitemap.trim()}` : "";
    return blocks.join("\n\n") + sitemapLine;
  }, [rules, sitemap]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {rules.map((rule, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-line bg-paper p-3">
            <div className="flex items-center gap-2">
              <input
                value={rule.userAgent}
                onChange={(e) => updateRule(i, { userAgent: e.target.value })}
                placeholder="User-agent (* for all bots)"
                className="flex-1 rounded-md border border-line bg-paper-card px-3 py-2 text-sm text-ink outline-none focus:border-amber"
              />
              {rules.length > 1 && (
                <button onClick={() => removeRule(i)} className="text-ink-soft hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <textarea
                value={rule.disallow}
                onChange={(e) => updateRule(i, { disallow: e.target.value })}
                placeholder={"Disallow paths, one per line\n/admin/"}
                className="h-20 resize-none rounded-md border border-line bg-paper-card px-3 py-2 font-mono text-xs text-ink outline-none focus:border-amber"
              />
              <textarea
                value={rule.allow}
                onChange={(e) => updateRule(i, { allow: e.target.value })}
                placeholder={"Allow paths, one per line\n/public/"}
                className="h-20 resize-none rounded-md border border-line bg-paper-card px-3 py-2 font-mono text-xs text-ink outline-none focus:border-amber"
              />
            </div>
          </div>
        ))}
        <button
          onClick={addRule}
          className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add rule for another bot
        </button>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Sitemap URL (optional)
        </label>
        <input
          value={sitemap}
          onChange={(e) => setSitemap(e.target.value)}
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      <div>
        <div className="mb-1.5 flex justify-end">
          <CopyButton value={text} />
        </div>
        <pre className="w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink">
          {text}
        </pre>
      </div>
    </div>
  );
}
