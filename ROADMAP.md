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

## Phase 1 — Developer ✅ complete

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
- ✅ Regex Tester (match highlighting)
- ✅ Markdown Previewer (sanitized HTML rendering via DOMPurify)
- ✅ Cron Expression Parser & Explainer
- ✅ YAML ⇄ JSON Converter
- ✅ Code Formatter (beautify JS/CSS/HTML, safe minify for CSS/HTML)
- ✅ curl → fetch code snippet converter

## Phase 2 — Text

- ✅ Word & Character Counter
- ✅ Case Converter (camelCase, snake_case, Title Case, …)
- ✅ Slug Generator
- ✅ Find & Replace (with regex, across large text)
- ✅ Duplicate Line Remover / Sorter
- ✅ Text-to-Speech (client-side via Web Speech API)
- ⬜ Text Summarizer **[needs API key]**
- ⬜ Grammar / Spell Checker **[needs API key]**

## Phase 3 — Image

- ✅ Image Compressor
- ✅ Format Converter (PNG/JPEG/WebP)
- ✅ Image Resizer
- ✅ Favicon Generator (all sizes from one image, zipped)
- ✅ EXIF Viewer / Remover
- ✅ Meme Generator
- ✅ Image ⇄ Base64 Converter
- ✅ Collage / Grid Maker
- ⬜ Background Remover **[needs API key]**
- ⬜ Image Upscaler **[needs API key]**

## Phase 4 — Generators ✅ complete

- ✅ QR Code Generator
- ✅ Password Generator
- ✅ Barcode Generator
- ✅ Random Name Picker / Team Splitter
- ✅ Fake Data Generator (names, emails, addresses — for testing)
- ✅ Invoice Generator (client-side PDF via jsPDF)
- ✅ Resume / CV Builder → PDF
- ✅ Wheel-of-Names Picker
- ✅ Dice / Coin Flip

## Phase 5 — Security ✅ complete

- ✅ Password Strength Checker (standalone)
- ✅ 2FA / TOTP Code Generator (paste a secret, client-side)
- ✅ Password Breach Checker (HaveIBeenPwned k-anonymity — free, no key needed)
- ✅ SSL/TLS Certificate Checker (backend proxy to crt.sh — free, no key needed)

## Phase 6 — PDF ✅ complete

- ✅ Merge PDF
- ✅ Split PDF (page range or split into individual pages)
- ✅ PDF → Images (pdfjs-dist render)
- ✅ Images → PDF
- ✅ Compress PDF (metadata strip + repack — honest about limits, no image recompression)
- ✅ Watermark PDF

## Phase 7 — Productivity / Calculators ✅ complete

- ✅ Age Calculator
- ✅ Unit Converter (length, weight, temperature, volume, speed, data)
- ✅ Timezone / Meeting Planner
- ✅ Percentage & Tip Calculator
- ✅ Loan / EMI Calculator
- ✅ Pomodoro Timer & Countdown Timer
- ✅ Currency Converter (backend proxy to Frankfurter — free, no key needed)

## Phase 8 — SEO / Web ✅ complete

- ✅ Meta Tag / Open Graph Preview Generator
- ✅ Sitemap.xml Generator
- ✅ Robots.txt Generator
- ✅ Broken Link Checker (backend proxy, SSRF-guarded, no key needed)
- ✅ Website Speed Test (backend proxy to Google PageSpeed Insights, no key required)

## Phase 9 — Social ✅ complete

- ✅ Post-Length Checker (X/Twitter, Instagram, LinkedIn, TikTok, YouTube, …)
- ✅ Hashtag Generator (keyword extraction from your caption, not AI-guessed)
- ✅ Username Availability Checker (GitHub, GitLab, Dev.to, Hacker News — real keyless APIs, no key needed)

## Phase 10 — Video & Audio

- ✅ YouTube Playlist Length Calculator
- ✅ Video Trimmer (ffmpeg.wasm, lazy-loaded from a public CDN)
- ✅ GIF Maker from Video Clip (ffmpeg.wasm)
- ✅ Audio Format Converter (ffmpeg.wasm)
- ✅ Video Compressor (ffmpeg.wasm)
- ✅ Audio Trimmer & Merger (ffmpeg.wasm)
- ✅ YouTube Thumbnail Downloader
- ✅ YouTube Timestamp Link Generator
- ⬜ Subtitle (.srt) Generator — needs real speech-to-text (a cloud API with a
  key, or an in-browser Whisper model via transformers.js/whisper-web, which
  is a much bigger dependency than anything else here). Left for a dedicated
  future pass.

## Remaining backlog (all require a real API key or a heavy ML model)

- ⬜ Text Summarizer (Phase 2)
- ⬜ Grammar / Spell Checker (Phase 2)
- ⬜ Background Remover (Phase 3)
- ⬜ Image Upscaler (Phase 3)
- ⬜ Subtitle (.srt) Generator (Phase 10)

Everything else in every category above is live. These five are the only
ones that couldn't be built "free and keyless" the way the rest of the site
was — they need either a paid AI API (with a bring-your-own-key prompt like
the YouTube tool) or a large in-browser ML model. Worth a deliberate,
separate decision rather than folding into the sprint.
