"use client";

import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { loadImage, canvasToBlob, download } from "@/lib/image";

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [busy, setBusy] = useState(false);

  async function handleFile(f: File | null) {
    setFile(f);
    if (!f) return;
    const img = await loadImage(f);
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
  }

  function updateWidth(w: number) {
    setWidth(w);
    if (lockAspect && natural.w) setHeight(Math.round((w / natural.w) * natural.h));
  }

  function updateHeight(h: number) {
    setHeight(h);
    if (lockAspect && natural.h) setWidth(Math.round((h / natural.h) * natural.w));
  }

  async function resizeAndDownload() {
    if (!file || !width || !height) return;
    setBusy(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const blob = await canvasToBlob(canvas, file.type || "image/png");
      const base = file.name.replace(/\.[^.]+$/, "");
      const ext = file.name.split(".").pop() || "png";
      download(blob, `${base}-${width}x${height}.${ext}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Choose image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {file && natural.w > 0 && (
        <>
          <p className="font-mono text-xs text-ink-soft">
            Original: {natural.w} × {natural.h}px
          </p>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
                Width
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => updateWidth(Number(e.target.value))}
                className="w-28 rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
                Height
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => updateHeight(Number(e.target.value))}
                className="w-28 rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
              />
            </div>
            <label className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="accent-amber"
              />
              Lock aspect ratio
            </label>
          </div>

          <button
            onClick={resizeAndDownload}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? "Resizing…" : "Resize & download"}
          </button>
        </>
      )}
    </div>
  );
}
