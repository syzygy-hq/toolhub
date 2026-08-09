"use client";

import { useRef, useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { Download, Upload } from "lucide-react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { download } from "@/lib/image";

export function VideoTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("5");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleFile(f: File | null) {
    setFile(f);
    setUrl(f ? URL.createObjectURL(f) : "");
    setError(null);
  }

  async function trim() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg(setProgress);
      const ext = file.name.split(".").pop() || "mp4";
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(["-i", inputName, "-ss", start, "-to", end, "-c", "copy", `output.${ext}`]);
      const data = await ffmpeg.readFile(`output.${ext}`);
      const blob = new Blob([new Uint8Array(data as Uint8Array<ArrayBufferLike>)], { type: file.type || "video/mp4" });
      download(blob, `trimmed-${file.name}`);
    } catch {
      setError("Couldn't trim that video. Try a different start/end range.");
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
        <video ref={videoRef} src={url} controls className="max-h-80 w-full rounded-lg border border-line" />
      )}

      {file && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <TimeField label="Start (seconds)" value={start} onChange={setStart} videoRef={videoRef} />
            <TimeField label="End (seconds)" value={end} onChange={setEnd} videoRef={videoRef} />
          </div>

          {busy && (
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-amber transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          )}

          <button
            onClick={trim}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? "Trimming…" : "Trim & download"}
          </button>
        </>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Processes entirely in your browser (via ffmpeg.wasm) — the video is
        never uploaded. The ffmpeg engine (~30MB) downloads once, the first
        time you use a video/audio tool.
      </p>
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
  videoRef,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
        />
        <button
          onClick={() => videoRef.current && onChange(videoRef.current.currentTime.toFixed(1))}
          className="rounded-md border border-line px-2.5 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          Use current
        </button>
      </div>
    </div>
  );
}
