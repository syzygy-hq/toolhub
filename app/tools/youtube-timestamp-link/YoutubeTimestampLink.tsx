"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { extractVideoId } from "@/lib/youtube";

function parseTimeToSeconds(input: string): number | null {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  const parts = trimmed.split(":").map(Number);
  if (parts.some(Number.isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

export function YoutubeTimestampLink() {
  const [url, setUrl] = useState("");
  const [time, setTime] = useState("1:23");

  const { link, embedLink, error } = useMemo(() => {
    const videoId = extractVideoId(url);
    if (!videoId) return { link: "", embedLink: "", error: url ? "Couldn't find a video ID in that URL." : null };
    const seconds = parseTimeToSeconds(time);
    if (seconds === null) return { link: "", embedLink: "", error: "Use a format like 1:23 or 1:02:03." };
    return {
      link: `https://youtu.be/${videoId}?t=${seconds}`,
      embedLink: `https://www.youtube.com/embed/${videoId}?start=${seconds}`,
      error: null as string | null,
    };
  }, [url, time]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            YouTube URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Timestamp
          </label>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="1:23 or 1:02:03"
            className="w-32 rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {link && (
        <div className="grid gap-2">
          <Row label="Shareable link" value={link} />
          <Row label="Embed src (iframe)" value={embedLink} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper p-3">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{label}</p>
        <p className="truncate font-mono text-sm text-ink">{value}</p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}
