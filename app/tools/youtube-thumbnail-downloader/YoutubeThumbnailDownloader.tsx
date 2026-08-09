"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { extractVideoId } from "@/lib/youtube";
import { download } from "@/lib/image";

const SIZES = [
  { key: "maxresdefault", label: "Max res (1280×720)" },
  { key: "sddefault", label: "SD (640×480)" },
  { key: "hqdefault", label: "HQ (480×360)" },
  { key: "mqdefault", label: "MQ (320×180)" },
  { key: "default", label: "Default (120×90)" },
];

export function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = extractVideoId(url);
    if (!id) {
      setError("Couldn't find a video ID in that URL.");
      setVideoId(null);
      return;
    }
    setError(null);
    setVideoId(id);
  }

  async function downloadThumbnail(size: string) {
    if (!videoId) return;
    const src = `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
    const blob = await fetch(src).then((r) => r.blob());
    download(blob, `${videoId}-${size}.jpg`);
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-amber bg-amber-soft px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink"
        >
          Fetch thumbnails
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {videoId && (
        <div className="grid gap-3 sm:grid-cols-2">
          {SIZES.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3 rounded-lg border border-line bg-paper p-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube-hosted thumbnail preview */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/${key}.jpg`}
                alt={label}
                className="h-16 w-28 rounded-md border border-line object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-ink">{label}</p>
              </div>
              <button
                onClick={() => downloadThumbnail(key)}
                className="text-ink-soft hover:text-amber"
                aria-label={`Download ${label}`}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
