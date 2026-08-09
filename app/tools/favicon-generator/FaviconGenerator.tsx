"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Download, Upload } from "lucide-react";
import { loadImage, canvasToBlob, download } from "@/lib/image";

const SIZES = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

export function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);

  function handleFile(f: File | null) {
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  }

  async function renderSize(img: HTMLImageElement, size: number): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, size, size);
    return canvasToBlob(canvas, "image/png");
  }

  async function generateAndDownload() {
    if (!file) return;
    setBusy(true);
    try {
      const img = await loadImage(file);
      const zip = new JSZip();
      for (const { size, name } of SIZES) {
        const blob = await renderSize(img, size);
        zip.file(name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      download(zipBlob, "favicons.zip");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Choose a square image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {previewUrl && (
        <div className="flex flex-wrap items-center gap-3">
          {SIZES.map(({ size }) => (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview at varying thumbnail sizes
            <img
              key={size}
              src={previewUrl}
              alt={`${size}px preview`}
              style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
              className="rounded-md border border-line object-cover"
            />
          ))}
        </div>
      )}

      <button
        onClick={generateAndDownload}
        disabled={!file || busy}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> {busy ? "Generating…" : "Download favicons.zip"}
      </button>

      <p className="font-mono text-[11px] text-ink-soft">
        Includes {SIZES.map((s) => s.size).join(", ")}px sizes covering
        browser tabs, iOS home screen, and Android.
      </p>
    </div>
  );
}
