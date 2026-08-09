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
];

export const categories = Array.from(
  new Set(tools.map((t) => t.category))
) as ToolCategory[];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}
