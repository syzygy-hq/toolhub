"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Download, Upload } from "lucide-react";

interface Result {
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
}

export function ImageCompressor() {
  const [maxSizeMb, setMaxSizeMb] = useState(1);
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const next: Result[] = [];
    for (const file of Array.from(files)) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: maxSizeMb,
          maxWidthOrHeight: 4096,
          useWebWorker: true,
        });
        next.push({
          name: file.name,
          originalSize: file.size,
          compressedSize: compressed.size,
          url: URL.createObjectURL(compressed),
        });
      } catch {
        // Skip files that fail to compress (e.g. unsupported format).
      }
    }
    setResults((prev) => [...next, ...prev]);
    setBusy(false);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
          <Upload className="h-4 w-4" />
          Choose images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Target size
          </label>
          <select
            value={maxSizeMb}
            onChange={(e) => setMaxSizeMb(Number(e.target.value))}
            className="rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
          >
            <option value={0.1}>100 KB</option>
            <option value={0.5}>500 KB</option>
            <option value={1}>1 MB</option>
            <option value={2}>2 MB</option>
          </select>
        </div>
        {busy && (
          <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Compressing…
          </span>
        )}
      </div>

      <p className="font-mono text-[11px] text-ink-soft">
        Everything happens on your device — images are never uploaded.
      </p>

      {results.length > 0 && (
        <div className="grid gap-3">
          {results.map((result, i) => {
            const saved = Math.round(
              (1 - result.compressedSize / result.originalSize) * 100
            );
            return (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-paper p-3"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimizable remote asset */}
                  <img
                    src={result.url}
                    alt={result.name}
                    className="h-12 w-12 rounded-md border border-line object-cover"
                  />
                  <div>
                    <p className="text-sm text-ink">{result.name}</p>
                    <p className="font-mono text-xs text-ink-soft">
                      {formatBytes(result.originalSize)} →{" "}
                      {formatBytes(result.compressedSize)}{" "}
                      {saved > 0 && (
                        <span className="text-amber">-{saved}%</span>
                      )}
                    </p>
                  </div>
                </div>
                <a
                  href={result.url}
                  download={`compressed-${result.name}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
