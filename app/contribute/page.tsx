import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Contribute a tool — Toolbox",
};

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-amber transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All tools
      </Link>

      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Add your tool
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
        Toolbox is open source. Build something useful, open a PR, and your
        name (and a link to your site, GitHub, or socials) goes on the tool
        card and in the README. No gatekeeping, no fees — this is the
        self-promo you were promised.
      </p>

      <div className="mt-10 grid gap-6">
        <Step n="1" title="Pick a slug and make a folder">
          <p>
            Create <Code>app/tools/&lt;your-slug&gt;/</Code> with a{" "}
            <Code>page.tsx</Code> that renders your tool inside the shared{" "}
            <Code>ToolLayout</Code> component. Look at{" "}
            <Code>app/tools/word-counter/</Code> for the smallest example.
          </p>
        </Step>

        <Step n="2" title="Choose client-only or client + API route">
          <p>
            Most tools should run entirely in the browser — no server, no
            cost, trivial to review. If your tool genuinely needs a secret
            (an API key, for example), you can add{" "}
            <Code>app/api/tools/&lt;your-slug&gt;/route.ts</Code> as a Next.js
            API route. It still deploys for free on Vercel, but PRs that add
            a server route get a closer security review before merging.
          </p>
        </Step>

        <Step n="3" title="Register your tool's metadata">
          <p>
            Add one entry to <Code>lib/tools-registry.ts</Code> — this single
            file drives the homepage grid, search, category filters, and
            credits. Put your name and a link in the <Code>author</Code>{" "}
            field:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-paper p-4 font-mono text-xs text-ink">
{`{
  slug: "your-tool-slug",
  name: "Your Tool Name",
  description: "One sentence on what it does.",
  category: "Developer", // or Text, Image, Video & Audio, Generators, Security
  tags: ["keyword", "keyword"],
  icon: "Wrench", // any lucide-react icon name
  needsBackend: false,
  author: { name: "Your Name", url: "https://your-link.com" },
}`}
          </pre>
        </Step>

        <Step n="4" title="Open a PR">
          <p>
            That&apos;s it — no build step to wire up, no separate registry to
            update. Once it&apos;s merged, your tool is live and credited.
          </p>
        </Step>
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line bg-paper-card p-5">
        <h2 className="font-display text-base font-semibold text-ink">
          Ground rules
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-ink-soft">
          <li>Prefer client-side only — it&apos;s free, fast, and private.</li>
          <li>No accounts, no tracking, no ads inside a tool.</li>
          <li>If it needs a paid API, make it bring-your-own-key like the YouTube tool.</li>
          <li>Keep the tool&apos;s own README/comments minimal — the PR description carries the context.</li>
        </ul>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-paper-card font-mono text-xs text-ink-soft">
        {n}
      </span>
      <div>
        <h2 className="font-display text-base font-semibold text-ink">
          {title}
        </h2>
        <div className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {children}
        </div>
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-paper px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
      {children}
    </code>
  );
}
