"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const DEFAULT_MARKDOWN = `# Hello, Toolbox

Type some **markdown** on the left — it renders live here, sanitized before
it hits the page.

- Lists work
- \`inline code\` too

> Nothing leaves your browser.
`;

export function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [html, setHtml] = useState("");

  useEffect(() => {
    // marked + DOMPurify need a real DOM, so this only runs client-side —
    // safe from the SSR pass a "use client" component still gets.
    const raw = marked.parse(markdown, { async: false }) as string;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sanitizing requires `window`, unavailable during SSR
    setHtml(DOMPurify.sanitize(raw));
  }, [markdown]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Markdown
        </label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          spellCheck={false}
          className="h-96 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
        />
      </div>
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Preview
        </label>
        <div
          className="prose prose-sm h-96 max-w-none overflow-auto rounded-lg border border-line bg-paper-card p-4 text-ink prose-headings:font-display prose-headings:text-ink prose-a:text-amber prose-code:text-ink prose-strong:text-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
