"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { ArrowDown, ArrowUp, Download, Upload, X } from "lucide-react";
import { loadImage } from "@/lib/image";

interface Entry {
  file: File;
  img: HTMLImageElement;
  url: string;
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 10;

export function ImagesToPdf() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);

  async function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const added = await Promise.all(
      Array.from(fileList).map(async (file) => ({
        file,
        img: await loadImage(file),
        url: URL.createObjectURL(file),
      }))
    );
    setEntries((prev) => [...prev, ...added]);
  }

  function move(index: number, dir: -1 | 1) {
    setEntries((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeAt(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  async function generate() {
    if (entries.length === 0) return;
    setBusy(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      entries.forEach((entry, i) => {
        if (i > 0) doc.addPage();
        const availW = PAGE_W - MARGIN * 2;
        const availH = PAGE_H - MARGIN * 2;
        const scale = Math.min(availW / entry.img.naturalWidth, availH / entry.img.naturalHeight);
        const w = entry.img.naturalWidth * scale;
        const h = entry.img.naturalHeight * scale;
        const x = (PAGE_W - w) / 2;
        const y = (PAGE_H - h) / 2;
        doc.addImage(entry.img, x, y, w, h);
      });
      doc.save("images.pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Add images
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {entries.length > 0 && (
        <div className="grid gap-2">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-line bg-paper p-2">
              <span className="w-6 text-center font-mono text-xs text-ink-soft">{i + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob thumbnail */}
              <img src={entry.url} alt="" className="h-12 w-12 rounded-md border border-line object-cover" />
              <p className="min-w-0 flex-1 truncate text-sm text-ink">{entry.file.name}</p>
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-soft hover:text-amber disabled:opacity-30">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === entries.length - 1} className="text-ink-soft hover:text-amber disabled:opacity-30">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button onClick={() => removeAt(i)} className="text-ink-soft hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={generate}
        disabled={entries.length === 0 || busy}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> {busy ? "Building PDF…" : "Download PDF"}
      </button>
    </div>
  );
}
