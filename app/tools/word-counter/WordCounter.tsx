"use client";

import { useMemo, useState } from "react";

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences =
      trimmed.length === 0 ? 0 : (trimmed.match(/[.!?]+(\s|$)/g) ?? []).length || 1;
    const paragraphs =
      trimmed.length === 0
        ? 0
        : trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const readingMinutes = words / 200;
    const speakingMinutes = words / 130;

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: formatMinutes(readingMinutes),
      speakingTime: formatMinutes(speakingMinutes),
    };
  }, [text]);

  return (
    <div className="grid gap-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        className="h-64 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="No spaces" value={stats.charactersNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading time" value={stats.readingTime} />
        <Stat label="Speaking time" value={stats.speakingTime} />
      </div>
    </div>
  );
}

function formatMinutes(minutes: number): string {
  if (minutes < 1 / 60) return "0 sec";
  if (minutes < 1) return `${Math.round(minutes * 60)} sec`;
  return `${Math.ceil(minutes)} min`;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
