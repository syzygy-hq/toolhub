"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { download } from "@/lib/image";

const FREQUENCIES = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

export function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/contact");
  const [frequency, setFrequency] = useState("weekly");
  const [priority, setPriority] = useState(0.8);
  const [includeLastmod, setIncludeLastmod] = useState(true);
  const [lastmod, setLastmod] = useState("");

  const xml = useMemo(() => {
    const list = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    const date = includeLastmod ? lastmod || new Date().toISOString().slice(0, 10) : null;
    const entries = list
      .map(
        (url) => `  <url>
    <loc>${escapeXml(url)}</loc>${date ? `\n    <lastmod>${date}</lastmod>` : ""}
    <changefreq>${frequency}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
      )
      .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
  }, [urls, frequency, priority, includeLastmod, lastmod]);

  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          URLs (one per line)
        </label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="h-40 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Change freq</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
          >
            {FREQUENCIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Priority</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-24 accent-amber"
          />
          <span className="font-mono text-xs text-ink-soft">{priority.toFixed(1)}</span>
        </div>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
          <input
            type="checkbox"
            checked={includeLastmod}
            onChange={(e) => setIncludeLastmod(e.target.checked)}
            className="accent-amber"
          />
          Include lastmod
        </label>
        {includeLastmod && (
          <input
            type="date"
            value={lastmod}
            onChange={(e) => setLastmod(e.target.value)}
            className="rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
          />
        )}
      </div>

      <div>
        <div className="mb-1.5 flex justify-end gap-2">
          <CopyButton value={xml} />
          <button
            onClick={() => download(new Blob([xml], { type: "application/xml" }), "sitemap.xml")}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>
        <pre className="h-64 w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink">
          {xml}
        </pre>
      </div>
    </div>
  );
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
