"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Download, Loader2, Upload } from "lucide-react";
import { download } from "@/lib/image";
import { renderPdfPagesToPngs } from "./renderPdf";

export function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  async function handleFile(f: File | null) {
    setFile(f);
    setError(null);
    setPreviews([]);
    if (!f) return;
    setBusy(true);
    try {
      const blobs = await renderPdfPagesToPngs(f);
      setPreviews(blobs.map((b) => URL.createObjectURL(b)));
    } catch {
      setError("Couldn't render that PDF. Make sure it's a valid file.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadAll() {
    if (!file || previews.length === 0) return;
    setBusy(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < previews.length; i++) {
        const blob = await fetch(previews[i]).then((r) => r.blob());
        zip.file(`page-${i + 1}.png`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      download(zipBlob, `${file.name.replace(/\.pdf$/i, "")}-pages.zip`);
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

      {busy && previews.length === 0 && (
        <p className="inline-flex items-center gap-2 font-mono text-xs text-ink-soft">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Rendering pages…
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {previews.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previews.map((url, i) => (
              <a key={i} href={url} download={`page-${i + 1}.png`} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview per rendered page */}
                <img src={url} alt={`Page ${i + 1}`} className="w-full rounded-md border border-line" />
                <p className="mt-1 text-center font-mono text-[10px] text-ink-soft">Page {i + 1}</p>
              </a>
            ))}
          </div>
          <button
            onClick={downloadAll}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Download all as .zip
          </button>
        </>
      )}
    </div>
  );
}
