"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { Download, Upload } from "lucide-react";
import { download } from "@/lib/image";

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(48);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply() {
    if (!file || !text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(45),
        });
      }

      const bytes = await doc.save();
      const base = file.name.replace(/\.pdf$/i, "");
      download(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), `${base}-watermarked.pdf`);
    } catch {
      setError("Couldn't add a watermark to that PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Choose a PDF
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {file && (
        <>
          <p className="font-mono text-xs text-ink-soft">{file.name}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Watermark text"
              className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            />
            <div className="flex items-center gap-2">
              <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Size</label>
              <input
                type="range"
                min={20}
                max={100}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-amber"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Opacity</label>
              <input
                type="range"
                min={0.05}
                max={0.6}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="flex-1 accent-amber"
              />
            </div>
          </div>

          <button
            onClick={apply}
            disabled={!text.trim() || busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? "Applying…" : "Add watermark & download"}
          </button>
        </>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
