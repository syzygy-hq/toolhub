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
| [URL Encoder / Decoder](app/tools/url-encoder-decoder) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [UUID / ULID Generator](app/tools/uuid-generator) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Hash Generator](app/tools/hash-generator) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Timestamp Converter](app/tools/timestamp-converter) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Lorem Ipsum Generator](app/tools/lorem-ipsum-generator) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [HTTP Status Code Lookup](app/tools/http-status-lookup) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [CSV ⇄ JSON Converter](app/tools/csv-json-converter) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Diff Checker](app/tools/diff-checker) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Regex Tester](app/tools/regex-tester) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Markdown Previewer](app/tools/markdown-previewer) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Cron Expression Explainer](app/tools/cron-parser) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [YAML ⇄ JSON Converter](app/tools/yaml-json-converter) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Code Formatter](app/tools/code-formatter) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [curl → fetch Converter](app/tools/curl-to-fetch) | Developer | No | [Toolbox](https://github.com/masabinhok) |
| [Case Converter](app/tools/case-converter) | Text | No | [Toolbox](https://github.com/masabinhok) |
| [Slug Generator](app/tools/slug-generator) | Text | No | [Toolbox](https://github.com/masabinhok) |
| [Find & Replace](app/tools/find-replace) | Text | No | [Toolbox](https://github.com/masabinhok) |
| [Duplicate Line Remover & Sorter](app/tools/line-tools) | Text | No | [Toolbox](https://github.com/masabinhok) |
| [Text to Speech](app/tools/text-to-speech) | Text | No | [Toolbox](https://github.com/masabinhok) |
| [Image Format Converter](app/tools/image-format-converter) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [Image Resizer](app/tools/image-resizer) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [Favicon Generator](app/tools/favicon-generator) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [EXIF Viewer & Remover](app/tools/exif-viewer) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [Meme Generator](app/tools/meme-generator) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [Image ⇄ Base64 Converter](app/tools/image-base64-converter) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [Collage / Grid Maker](app/tools/collage-maker) | Image | No | [Toolbox](https://github.com/masabinhok) |
| [Barcode Generator](app/tools/barcode-generator) | Generators | No | [Toolbox](https://github.com/masabinhok) |
| [Random Name Picker & Team Splitter](app/tools/random-picker) | Generators | No | [Toolbox](https://github.com/masabinhok) |
| [Fake Data Generator](app/tools/fake-data-generator) | Generators | No | [Toolbox](https://github.com/masabinhok) |
| [Invoice Generator](app/tools/invoice-generator) | Generators | No | [Toolbox](https://github.com/masabinhok) |
| [Resume / CV Builder](app/tools/resume-builder) | Generators | No | [Toolbox](https://github.com/masabinhok) |
| [Wheel of Names](app/tools/wheel-of-names) | Generators | No | [Toolbox](https://github.com/masabinhok) |
| [Dice Roller & Coin Flip](app/tools/dice-coin-flip) | Generators | No | [Toolbox](https://github.com/masabinhok) |
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
