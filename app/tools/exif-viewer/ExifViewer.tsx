"use client";

import { useState } from "react";
import { parse } from "exifr";
import { Download, Upload } from "lucide-react";
import { loadImage, canvasToBlob, download } from "@/lib/image";

export function ExifViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFile(f: File | null) {
    setFile(f);
    setMetadata(null);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
    if (!f) return;
    setLoading(true);
    try {
      const data = await parse(f);
      setMetadata(data ?? {});
    } finally {
      setLoading(false);
    }
  }

  async function removeAndDownload() {
    if (!file) return;
    setBusy(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);
      const base = file.name.replace(/\.[^.]+$/, "");
      download(blob, `${base}-no-exif.jpg`);
    } finally {
      setBusy(false);
    }
  }

  const entries = metadata ? Object.entries(metadata).filter(([, v]) => v !== undefined) : [];

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Choose a photo (JPEG works best)
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {previewUrl && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
          <img src={previewUrl} alt={file?.name} className="h-24 w-24 rounded-md border border-line object-cover" />
          <button
            onClick={removeAndDownload}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? "Stripping…" : "Remove EXIF & download"}
          </button>
        </div>
      )}

      {loading && <p className="font-mono text-xs text-ink-soft">Reading metadata…</p>}

      {!loading && metadata && (
        <div className="rounded-lg border border-line">
          {entries.length === 0 ? (
            <p className="p-4 font-mono text-sm text-ink-soft">
              No EXIF metadata found in this file.
            </p>
          ) : (
            entries.map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between gap-4 border-b border-line px-3 py-2 last:border-0"
              >
                <span className="font-mono text-xs text-ink-soft">{key}</span>
                <span className="truncate font-mono text-xs text-ink">{formatValue(value)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
