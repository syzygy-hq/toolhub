"use client";

import { useRef, useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { Download, Upload } from "lucide-react";
import { loadFFmpeg } from "@/lib/ffmpeg";

export function GifMaker() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("3");
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleFile(f: File | null) {
    setFile(f);
    setUrl(f ? URL.createObjectURL(f) : "");
    setPreviewUrl("");
    setError(null);
  }

  async function makeGif() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    setPreviewUrl("");
    try {
      const ffmpeg = await loadFFmpeg(setProgress);
      const ext = file.name.split(".").pop() || "mp4";
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec([
        "-i", inputName,
        "-ss", start,
        "-to", end,
        "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos`,
        "-loop", "0",
        "output.gif",
      ]);
      const data = await ffmpeg.readFile("output.gif");
      const blob = new Blob([new Uint8Array(data as Uint8Array<ArrayBufferLike>)], { type: "image/gif" });
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't create a GIF from that clip. Try a shorter range.");
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

      {url && (
        <video ref={videoRef} src={url} controls className="max-h-72 w-full rounded-lg border border-line" />
      )}

      {file && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Start (s)">
              <input value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
            </Field>
            <Field label="End (s)">
              <input value={end} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
            </Field>
            <Field label="FPS">
              <input
                type="number"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value) || 10)}
                className={inputClass}
              />
            </Field>
            <Field label="Width (px)">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 480)}
                className={inputClass}
              />
            </Field>
          </div>

          {busy && (
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-amber transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          )}

          <button
            onClick={makeGif}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Rendering…" : "Make GIF"}
          </button>
        </>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {previewUrl && (
        <div className="grid gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob GIF preview */}
          <img src={previewUrl} alt="Generated GIF" className="max-w-full rounded-lg border border-line" />
          <a
            href={previewUrl}
            download="animation.gif"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
          >
            <Download className="h-4 w-4" /> Download GIF
          </a>
        </div>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Processes entirely in your browser — nothing is uploaded. The ffmpeg
        engine downloads once, the first time you use a video/audio tool.
      </p>
    </div>
  );
}

const inputClass =
  "w-20 rounded-md border border-line bg-paper px-2 py-2 font-mono text-sm text-ink outline-none focus:border-amber";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
    </div>
  );
}
