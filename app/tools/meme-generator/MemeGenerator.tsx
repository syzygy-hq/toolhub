"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { loadImage, canvasToBlob, download } from "@/lib/image";

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = attempt;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawStrokedLine(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, lineWidth: number) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function MemeGenerator() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState("ONE DOES NOT SIMPLY");
  const [bottomText, setBottomText] = useState("BUILD FIFTY TOOLS IN A DAY");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setImg(await loadImage(file));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const fontSize = Math.max(24, Math.round(canvas.width / 12));
    ctx.font = `bold ${fontSize}px Impact, "Arial Narrow", sans-serif`;
    const lineWidth = fontSize / 12;
    const maxWidth = canvas.width * 0.9;

    if (topText.trim()) {
      const lines = wrapLines(ctx, topText, maxWidth);
      lines.forEach((line, i) =>
        drawStrokedLine(ctx, line, canvas.width / 2, fontSize * (i + 1), lineWidth)
      );
    }

    if (bottomText.trim()) {
      const lines = wrapLines(ctx, bottomText, maxWidth);
      lines.forEach((line, i) =>
        drawStrokedLine(
          ctx,
          line,
          canvas.width / 2,
          canvas.height - fontSize * (lines.length - 1 - i) - fontSize * 0.4,
          lineWidth
        )
      );
    }
  }, [img, topText, bottomText]);

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await canvasToBlob(canvas, "image/png");
    download(blob, "meme.png");
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

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          placeholder="Top text"
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
        <input
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          placeholder="Bottom text"
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      {img ? (
        <div className="overflow-auto rounded-lg border border-line bg-paper-card p-2">
          <canvas ref={canvasRef} className="mx-auto max-w-full" />
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-line bg-paper p-8 text-center font-mono text-sm text-ink-soft">
          Choose an image to start
        </p>
      )}

      <button
        onClick={handleDownload}
        disabled={!img}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> Download meme
      </button>
    </div>
  );
}
