# Contributing a tool

Toolbox is a Next.js app where every tool is a self-contained folder plus one
entry in a metadata registry. Add your name, get credited, no gatekeeping.

## 1. Pick a slug and make a folder

Create `app/tools/<your-slug>/page.tsx` that renders your tool inside the
shared `ToolLayout` component (see `components/ToolLayout.tsx`). Look at
`app/tools/word-counter/` for the smallest end-to-end example.

## 2. Client-only, or client + API route?

- **Client-only (preferred):** the tool runs entirely in the browser. No
  server, no hosting cost, safest to review. Most tools should be this.
- **Needs a backend:** only if the tool genuinely requires a secret (an API
  key, etc). Add `app/api/tools/<your-slug>/route.ts` as a Next.js API
  route — it still deploys free on Vercel's serverless tier. If the API you
  depend on has a free per-user quota, also support a bring-your-own-key
  fallback (see `lib/youtube.ts` + `app/tools/youtube-playlist-length/` for
  the pattern). PRs that add a server route get a closer security review.

## 3. Register your tool

Add one entry to `lib/tools-registry.ts`. This single file drives the
homepage grid, search, category filters, and credits — nothing else needs
wiring up.

```ts
{
  slug: "your-tool-slug",
  name: "Your Tool Name",
  description: "One sentence on what it does.",
  category: "Developer", // Text | Image | "Video & Audio" | Generators | Security | Developer
  tags: ["keyword", "keyword"],
  icon: "Wrench", // any icon name from lucide-react
  needsBackend: false,
  author: { name: "Your Name", url: "https://your-link.com" },
}
```

## 4. Open a PR

That's it. Once merged, your tool is live on the homepage with your name and
link attached to it.

## Ground rules

- Prefer client-side only — it's free, fast, and private for visitors.
- No accounts, no tracking, no ads inside a tool.
- If a tool needs a paid API, make it bring-your-own-key.
- Keep in-code comments minimal; put context in the PR description instead.
