# Roadmap

Full backlog of tool ideas, organized by category (= build phase). Anyone
can pick an unchecked item and send a PR — see [CONTRIBUTING.md](CONTRIBUTING.md).

**Phase order** (why): client-only tools with no new dependencies ship
first — they're free, fast, and trivial to review. Tools needing a small,
well-known dependency (a diff lib, a markdown parser) come next. Tools that
need an external API key (bring-your-own-key pattern) or a heavy client-side
runtime (ffmpeg.wasm for video) come last, since they're the most work per
tool.

Status: ✅ live · 🚧 queued next · ⬜ backlog

## Phase 1 — Developer

- ✅ JSON Formatter & Validator
- ✅ Color Converter & Picker
- ✅ Base64 & JWT Decoder
- ✅ URL Encoder / Decoder
- ✅ UUID / ULID Generator
- ✅ Hash Generator (SHA-1/256/384/512)
- ✅ Timestamp ⇄ Epoch Converter
- ✅ Lorem Ipsum Generator
- ✅ HTTP Status Code Lookup
- ✅ CSV ⇄ JSON Converter
- ✅ Diff Checker
- 🚧 Regex Tester (match highlighting)
- 🚧 Markdown Previewer (needs sanitized HTML rendering)
- 🚧 Cron Expression Parser & Explainer
- 🚧 YAML ⇄ JSON Converter
- ⬜ CSS / JS / HTML Minifier & Beautifier
- ⬜ curl ⇄ fetch code snippet converter

## Phase 2 — Text

- ✅ Word & Character Counter
- ⬜ Case Converter (camelCase, snake_case, Title Case, …)
- ⬜ Slug Generator
- ⬜ Find & Replace (with regex, across large text)
- ⬜ Duplicate Line Remover / Sorter
- ⬜ Text-to-Speech (client-side via Web Speech API)
- ⬜ Text Summarizer **[needs API key]**
- ⬜ Grammar / Spell Checker **[needs API key]**

## Phase 3 — Image

- ✅ Image Compressor
- ⬜ Format Converter (PNG/JPG/WebP/AVIF)
- ⬜ Image Resizer
- ⬜ Favicon Generator (all sizes from one image)
- ⬜ EXIF Viewer / Remover
- ⬜ Meme Generator
- ⬜ Image ⇄ Base64 Converter
- ⬜ Collage / Grid Maker
- ⬜ Background Remover **[needs API key]**
- ⬜ Image Upscaler **[needs API key]**

## Phase 4 — Generators

- ✅ QR Code Generator
- ✅ Password Generator
- ⬜ Barcode Generator
- ⬜ Random Name / Team Generator
- ⬜ Fake Data Generator (names, emails, addresses — for testing)
- ⬜ Invoice Generator (client-side PDF)
- ⬜ Resume / CV Builder → PDF
- ⬜ Wheel-of-Names Picker
- ⬜ Dice / Coin Flip

## Phase 5 — Security

- ⬜ Password Strength Checker (standalone)
- ⬜ 2FA / TOTP Code Generator (paste a secret, client-side)
- ⬜ Password Breach Checker **[needs API key — HaveIBeenPwned k-anonymity]**
- ⬜ SSL/TLS Certificate Checker **[needs API key]**

## Phase 6 — PDF

- ⬜ Merge / Split PDF
- ⬜ PDF ⇄ Image
- ⬜ Compress PDF
- ⬜ Watermark PDF
- ⬜ Image(s) → PDF

## Phase 7 — Productivity / Calculators

- ⬜ Age Calculator
- ⬜ Unit Converter
- ⬜ Timezone / Meeting Planner
- ⬜ Percentage & Tip Calculator
- ⬜ Loan / EMI Calculator
- ⬜ Countdown Timer / Pomodoro Timer
- ⬜ Currency Converter **[needs API key]**

## Phase 8 — SEO / Web

- ⬜ Meta Tag / Open Graph Preview Generator
- ⬜ Sitemap.xml Generator
- ⬜ Robots.txt Generator
- ⬜ Broken Link Checker **[needs API key]**
- ⬜ Website Speed Test Wrapper **[needs API key — Google PageSpeed]**

## Phase 9 — Social

- ⬜ Post-Length Checker (X/Twitter, Instagram captions)
- ⬜ Hashtag Generator / Suggester
- ⬜ Username Availability Checker **[needs API key]**

## Phase 10 — Video & Audio

- ✅ YouTube Playlist Length Calculator
- ⬜ Video Trimmer / Cropper (ffmpeg.wasm)
- ⬜ GIF Maker from Video Clip (ffmpeg.wasm)
- ⬜ Audio Format Converter (ffmpeg.wasm)
- ⬜ Video Compressor (ffmpeg.wasm)
- ⬜ Audio Trimmer / Merger (ffmpeg.wasm)
- ⬜ YouTube Thumbnail Downloader
- ⬜ YouTube Timestamp Link Generator
- ⬜ Subtitle (.srt) Generator **[needs API key]**
