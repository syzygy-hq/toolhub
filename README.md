# Toolbox

A free, open-source workshop of small, useful tools — a YouTube playlist
length calculator, JSON formatter, password generator, and more. No accounts,
no tracking, no paywalls. Built one tool at a time, and built to stay free:
almost every tool runs entirely in your browser.

It's open source so you can add your own. See [CONTRIBUTING.md](CONTRIBUTING.md)
or the [/contribute](app/contribute) page for how — your name and a link go
on the tool card and in the table below.

## Tools

<!-- TOOLS_TABLE_START -->
| Tool | Category | Needs backend | Author |
| --- | --- | --- | --- |
| [YouTube Playlist Length Calculator](app/tools/youtube-playlist-length) | Video & Audio | Yes | [Toolbox](https://github.com/masabinhok) |
| [JSON Formatter & Validator](app/tools/json-formatter) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Password Generator](app/tools/password-generator) | Security | No | [Toolbox](https://github.com/masabinhok) |
| [Word & Character Counter](app/tools/word-counter) | Text | No | [Toolbox](https://github.com/masabinhok) |
| [Color Converter & Picker](app/tools/color-converter) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [QR Code Generator](app/tools/qr-code-generator) | Generators | No | [Toolbox](https://github.com/masabinhok) |
| [Image Compressor](app/tools/image-compressor) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [Base64 & JWT Decoder](app/tools/base64-jwt-decoder) | Developer | No | [Toolbox](https://github.com/masabinhok) |
<!-- TOOLS_TABLE_END -->

Run `npm run generate:readme` after adding a tool to `lib/tools-registry.ts`
to refresh this table.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Most tools need nothing else. The YouTube Playlist Length Calculator can
optionally use a shared server key — copy `.env.example` to `.env.local` and
add a free `YOUTUBE_API_KEY` (from the Google Cloud Console, with the
"YouTube Data API v3" enabled). Without it, visitors are simply prompted to
paste their own free key instead.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel's free
tier. No database, no separate backend — server-only tools use Next.js API
routes, everything else runs client-side.

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new). No paid add-ons
are required.
