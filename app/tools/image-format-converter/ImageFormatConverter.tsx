"use client";

import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { loadImage, canvasToBlob, download } from "@/lib/image";

const FORMATS = [
  { label: "PNG", type: "image/png", ext: "png" },
  { label: "JPEG", type: "image/jpeg", ext: "jpg" },
  { label: "WebP", type: "image/webp", ext: "webp" },
];

export function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [format, setFormat] = useState(FORMATS[2]);
  const [quality, setQuality] = useState(0.92);
  const [busy, setBusy] = useState(false);

  function handleFile(f: File | null) {
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  }

  async function convert() {
    if (!file) return;
    setBusy(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, format.type, quality);
      const base = file.name.replace(/\.[^.]+$/, "");
      download(blob, `${base}.${format.ext}`);
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

      {previewUrl && (
        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
          <img src={previewUrl} alt={file?.name} className="h-24 w-24 rounded-md border border-line object-cover" />
          <p className="min-w-0 break-words text-sm text-ink-soft">{file?.name}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.ext}
              onClick={() => setFormat(f)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                format.ext === f.ext
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {format.ext !== "png" && (
          <div className="flex items-center gap-2">
            <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              Quality
            </label>
            <input
              type="range"
              min={0.4}
              max={1}
              step={0.02}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-32 accent-amber"
            />
            <span className="font-mono text-xs text-ink-soft">{Math.round(quality * 100)}%</span>
          </div>
        )}
      </div>

      <button
        onClick={convert}
        disabled={!file || busy}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> {busy ? "Converting…" : `Convert & download`}
      </button>
    </div>
  );
}
