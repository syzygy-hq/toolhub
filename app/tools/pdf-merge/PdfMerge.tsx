"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ArrowDown, ArrowUp, Download, Upload, X } from "lucide-react";
import { download } from "@/lib/image";

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  }

  function move(index: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const bytes = await merged.save();
      download(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "merged.pdf");
    } catch {
      setError("Couldn't merge those files — make sure they're all valid PDFs.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Add PDFs
        <input
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <div className="grid gap-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-line bg-paper p-3">
              <span className="w-6 text-center font-mono text-xs text-ink-soft">{i + 1}</span>
              <p className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</p>
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-soft hover:text-amber disabled:opacity-30">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === files.length - 1} className="text-ink-soft hover:text-amber disabled:opacity-30">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button onClick={() => removeAt(i)} className="text-ink-soft hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        onClick={merge}
        disabled={files.length < 2 || busy}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> {busy ? "Merging…" : "Merge & download"}
      </button>
    </div>
  );
}
