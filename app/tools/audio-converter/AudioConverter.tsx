"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { Download, Upload } from "lucide-react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { download } from "@/lib/image";

const FORMATS = [
  { ext: "mp3", mime: "audio/mpeg" },
  { ext: "wav", mime: "audio/wav" },
  { ext: "ogg", mime: "audio/ogg" },
];

export function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState(FORMATS[0]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg(setProgress);
      const inExt = file.name.split(".").pop() || "audio";
      const inputName = `input.${inExt}`;
      const outputName = `output.${format.ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(["-i", inputName, outputName]);
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(data as Uint8Array<ArrayBufferLike>)], { type: format.mime });
      const base = file.name.replace(/\.[^.]+$/, "");
      download(blob, `${base}.${format.ext}`);
    } catch {
      setError("Couldn't convert that file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Choose an audio file
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {file && (
        <>
          <audio src={URL.createObjectURL(file)} controls className="w-full" />

          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.ext}
                onClick={() => setFormat(f)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  format.ext === f.ext
                    ? "border-amber bg-amber-soft text-ink"
                    : "border-line bg-paper text-ink-soft hover:text-ink"
                }`}
              >
                {f.ext}
              </button>
            ))}
          </div>

          {busy && (
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-amber transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          )}

          <button
            onClick={convert}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? "Converting…" : "Convert & download"}
          </button>
        </>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Processes entirely in your browser — nothing is uploaded. The ffmpeg
        engine downloads once, the first time you use a video/audio tool.
      </p>
    </div>
  );
}
