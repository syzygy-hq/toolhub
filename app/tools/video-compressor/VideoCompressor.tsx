"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { Download, Upload } from "lucide-react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { download } from "@/lib/image";

export function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [crf, setCrf] = useState(28);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);

  function handleFile(f: File | null) {
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
    setResultSize(null);
    setError(null);
  }

  async function compress() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    setResultSize(null);
    try {
      const ffmpeg = await loadFFmpeg(setProgress);
      const ext = file.name.split(".").pop() || "mp4";
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec([
        "-i", inputName,
        "-vcodec", "libx264",
        "-crf", String(crf),
        "-preset", "veryfast",
        "-acodec", "aac",
        "output.mp4",
      ]);
      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([new Uint8Array(data as Uint8Array<ArrayBufferLike>)], { type: "video/mp4" });
      setResultSize(blob.size);
      const base = file.name.replace(/\.[^.]+$/, "");
      download(blob, `${base}-compressed.mp4`);
    } catch {
      setError("Couldn't compress that video.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Choose a video
        <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {file && (
        <>
          <video src={previewUrl} controls className="max-h-72 w-full rounded-lg border border-line" />

          <div>
            <div className="mb-1.5 flex justify-between font-mono text-xs uppercase tracking-wide text-ink-soft">
              <span>Quality (lower = better, bigger file)</span>
              <span>CRF {crf}</span>
            </div>
            <input
              type="range"
              min={18}
              max={35}
              value={crf}
              onChange={(e) => setCrf(Number(e.target.value))}
              className="w-full accent-amber"
            />
          </div>

          {busy && (
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-amber transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          )}

          <button
            onClick={compress}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? "Compressing…" : "Compress & download"}
          </button>

          {resultSize !== null && (
            <p className="font-mono text-xs text-ink-soft">
              {(file.size / 1024 / 1024).toFixed(1)} MB → {(resultSize / 1024 / 1024).toFixed(1)} MB
              {resultSize < file.size && (
                <span className="text-amber"> (-{Math.round((1 - resultSize / file.size) * 100)}%)</span>
              )}
            </p>
          )}
        </>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Processes entirely in your browser — nothing is uploaded. Larger
        videos take a while since encoding runs on your device; the ffmpeg
        engine downloads once, the first time you use a video/audio tool.
      </p>
    </div>
  );
}
