export type ToolCategory =
  | "Video & Audio"
  | "Developer"
  | "Text"
  | "Image"
  | "Generators"
  | "Security";

export interface ToolAuthor {
  name: string;
  url?: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  icon: string;
  /** True if this tool has a server-side API route under app/api/tools/<slug> */
  needsBackend: boolean;
  /** Name of a paid/premium product this tool replaces, if any */
  premiumAlternativeTo?: string;
  author: ToolAuthor;
}

export const tools: ToolMeta[] = [
  {
    slug: "youtube-playlist-length",
    name: "YouTube Playlist Length Calculator",
    description:
      "Get the total duration of any YouTube playlist, per-video breakdown, and watch time at faster playback speeds.",
    category: "Video & Audio",
    tags: ["youtube", "playlist", "duration", "video"],
    icon: "ListVideo",
    needsBackend: true,
    premiumAlternativeTo: "playlist length calculator extensions",
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    description:
      "Format, minify, and validate JSON with clear error locations. Everything runs in your browser.",
    category: "Developer",
    tags: ["json", "formatter", "validator", "beautify"],
    icon: "Braces",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description:
      "Generate strong, random passwords and passphrases with custom length and character sets.",
    category: "Security",
    tags: ["password", "generator", "security", "random"],
    icon: "KeyRound",
    needsBackend: false,
    premiumAlternativeTo: "password manager generators",
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description:
      "Count words, characters, sentences, and paragraphs, plus estimated reading and speaking time.",
    category: "Text",
    tags: ["text", "word count", "characters", "reading time"],
    icon: "Type",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "color-converter",
    name: "Color Converter & Picker",
    description:
      "Convert colors between HEX, RGB, and HSL with a live picker and preview.",
    category: "Developer",
    tags: ["color", "hex", "rgb", "hsl", "picker"],
    icon: "Palette",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description:
      "Turn any text or URL into a downloadable QR code, generated entirely on your device.",
    category: "Generators",
    tags: ["qr", "qr code", "generator"],
    icon: "QrCode",
    needsBackend: false,
    premiumAlternativeTo: "paid QR code generators",
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description:
      "Shrink JPG, PNG, and WebP images right in your browser — nothing is uploaded anywhere.",
    category: "Image",
    tags: ["image", "compress", "resize", "optimize"],
    icon: "ImageDown",
    needsBackend: false,
    premiumAlternativeTo: "TinyPNG-style compressors",
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "base64-jwt-decoder",
    name: "Base64 & JWT Decoder",
    description:
      "Encode/decode Base64 strings and decode JWT headers & payloads to inspect their contents.",
    category: "Developer",
    tags: ["base64", "jwt", "decoder", "encode"],
    icon: "ScanText",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    description:
      "Encode or decode URLs and query string components instantly, in your browser.",
    category: "Developer",
    tags: ["url", "encode", "decode", "uri"],
    icon: "Link2",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "uuid-generator",
    name: "UUID / ULID Generator",
    description:
      "Generate v4 UUIDs or sortable ULIDs, one at a time or in bulk.",
    category: "Developer",
    tags: ["uuid", "ulid", "generator", "id"],
    icon: "Fingerprint",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description:
      "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes of any text, computed locally.",
    category: "Developer",
    tags: ["hash", "sha256", "sha1", "checksum"],
    icon: "Hash",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description:
      "Convert between Unix epoch time and human-readable dates, in any timezone.",
    category: "Developer",
    tags: ["timestamp", "epoch", "unix", "date"],
    icon: "Timer",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description:
      "Generate placeholder text by words, sentences, or paragraphs.",
    category: "Developer",
    tags: ["lorem ipsum", "placeholder", "generator", "text"],
    icon: "AlignLeft",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "http-status-lookup",
    name: "HTTP Status Code Lookup",
    description:
      "Look up what any HTTP status code means, with the full reference list searchable.",
    category: "Developer",
    tags: ["http", "status code", "reference"],
    icon: "Globe2",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "csv-json-converter",
    name: "CSV ⇄ JSON Converter",
    description:
      "Convert CSV to JSON or JSON to CSV, with automatic delimiter and type detection.",
    category: "Developer",
    tags: ["csv", "json", "converter"],
    icon: "Table2",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    description:
      "Compare two blocks of text and see exactly what changed, line by line.",
    category: "Developer",
    tags: ["diff", "compare", "text", "changes"],
    icon: "GitCompare",
    needsBackend: false,
    author: { name: "Toolbox", url: "https://github.com/masabinhok" },
  },
];

export const categories = Array.from(
  new Set(tools.map((t) => t.category))
) as ToolCategory[];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}
