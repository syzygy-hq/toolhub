"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Upload } from "lucide-react";
import { download } from "@/lib/image";

export function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);

  async function compress() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("");
      doc.setCreator("");
      const output = await doc.save({ useObjectStreams: true });

      setResult({ before: bytes.byteLength, after: output.byteLength });
      const base = file.name.replace(/\.pdf$/i, "");
      download(new Blob([new Uint8Array(output)], { type: "application/pdf" }), `${base}-compressed.pdf`);
    } catch {
      setError("Couldn't process that PDF.");
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
          <p className="font-mono text-xs text-ink-soft">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>
          <button
            onClick={compress}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? "Optimizing…" : "Optimize & download"}
          </button>
        </>
      )}

      {result && (
        <p className="font-mono text-xs text-ink-soft">
          {(result.before / 1024).toFixed(0)} KB → {(result.after / 1024).toFixed(0)} KB
          {result.after < result.before && (
            <span className="text-amber"> (-{Math.round((1 - result.after / result.before) * 100)}%)</span>
          )}
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        This strips metadata and re-packs the PDF&apos;s internal structure. It
        won&apos;t shrink already-optimized PDFs much, and it doesn&apos;t recompress
        embedded images — real image recompression needs a native PDF
        engine that isn&apos;t available in the browser yet.
      </p>
    </div>
  );
}
