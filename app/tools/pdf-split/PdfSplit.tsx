"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { Download, Upload } from "lucide-react";
import { download } from "@/lib/image";
import { parsePageRange } from "./parseRange";

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(f: File | null) {
    setFile(f);
    setError(null);
    if (!f) return;
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("Couldn't read that PDF.");
    }
  }

  async function extractRange() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const indices = parsePageRange(range, pageCount);
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      download(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "extracted.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't extract those pages.");
    } finally {
      setBusy(false);
    }
  }

  async function splitAllPages() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const zip = new JSZip();
      for (let i = 0; i < src.getPageCount(); i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const bytes = await out.save();
        zip.file(`page-${i + 1}.pdf`, bytes);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      download(zipBlob, "pages.zip");
    } catch {
      setError("Couldn't split that PDF.");
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
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {file && pageCount > 0 && (
        <>
          <p className="font-mono text-xs text-ink-soft">{file.name} · {pageCount} pages</p>

          <div className="flex flex-wrap items-center gap-3">
            <input
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder={`e.g. 1-3,5 (out of ${pageCount})`}
              className="min-w-48 flex-1 rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
            />
            <button
              onClick={extractRange}
              disabled={!range.trim() || busy}
              className="inline-flex items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Extract pages
            </button>
          </div>

          <button
            onClick={splitAllPages}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Split into {pageCount} single-page PDFs (.zip)
          </button>
        </>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
