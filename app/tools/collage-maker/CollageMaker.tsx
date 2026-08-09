"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Upload, X } from "lucide-react";
import { loadImage, canvasToBlob, download } from "@/lib/image";

const CELL_SIZE = 320;

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number) {
  const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
  const sw = size / scale;
  const sh = size / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, size, size);
}

export function CollageMaker() {
  const [images, setImages] = useState<{ file: File; img: HTMLImageElement; url: string }[]>([]);
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState(8);
  const [background, setBackground] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const added = await Promise.all(
      Array.from(fileList).map(async (file) => ({
        file,
        img: await loadImage(file),
        url: URL.createObjectURL(file),
      }))
    );
    setImages((prev) => [...prev, ...added]);
  }

  function removeAt(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || images.length === 0) {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      return;
    }

    const rows = Math.ceil(images.length / columns);
    canvas.width = columns * CELL_SIZE + (columns + 1) * gap;
    canvas.height = rows * CELL_SIZE + (rows + 1) * gap;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    images.forEach(({ img }, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = gap + col * (CELL_SIZE + gap);
      const y = gap + row * (CELL_SIZE + gap);
      drawCover(ctx, img, x, y, CELL_SIZE);
    });
  }, [images, columns, gap, background]);

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await canvasToBlob(canvas, "image/png");
    download(blob, "collage.png");
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

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((entry, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob thumbnail */}
              <img src={entry.url} alt="" className="h-16 w-16 rounded-md border border-line object-cover" />
              <button
                onClick={() => removeAt(i)}
                className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-line bg-paper-card text-ink-soft hover:text-amber"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Columns</label>
          <div className="flex gap-1">
            {[2, 3, 4].map((c) => (
              <button
                key={c}
                onClick={() => setColumns(c)}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                  columns === c
                    ? "border-amber bg-amber-soft text-ink"
                    : "border-line text-ink-soft hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Gap</label>
          <input
            type="range"
            min={0}
            max={32}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-24 accent-amber"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Background</label>
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded-md border border-line bg-paper"
          />
        </div>
      </div>

      {images.length > 0 ? (
        <div className="overflow-auto rounded-lg border border-line bg-paper-card p-2">
          <canvas ref={canvasRef} className="mx-auto max-w-full" />
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-line bg-paper p-8 text-center font-mono text-sm text-ink-soft">
          Add a few images to build a collage
        </p>
      )}

      <button
        onClick={handleDownload}
        disabled={images.length === 0}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> Download collage
      </button>
    </div>
  );
}
