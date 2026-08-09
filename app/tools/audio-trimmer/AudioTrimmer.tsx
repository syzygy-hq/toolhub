"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { Download, Upload, X } from "lucide-react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { download } from "@/lib/image";

export function AudioTrimmer() {
  const [tab, setTab] = useState<"trim" | "merge">("trim");
  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        {(["trim", "merge"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {t === "trim" ? "Trim" : "Merge"}
          </button>
        ))}
      </div>
      {tab === "trim" ? <TrimPanel /> : <MergePanel />}
    </div>
  );
}

function TrimPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("10");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function trim() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg(setProgress);
      const ext = file.name.split(".").pop() || "mp3";
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(["-i", inputName, "-ss", start, "-to", end, "-c", "copy", `output.${ext}`]);
      const data = await ffmpeg.readFile(`output.${ext}`);
      const blob = new Blob([new Uint8Array(data as Uint8Array<ArrayBufferLike>)], { type: file.type || "audio/mpeg" });
      download(blob, `trimmed-${file.name}`);
    } catch {
      setError("Couldn't trim that file. Try a different start/end range.");
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
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Start (s)">
              <input value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
            </Field>
            <Field label="End (s)">
              <input value={end} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
            </Field>
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
    </div>
  );
}

function MergePanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg(setProgress);
      const inputArgs: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const ext = files[i].name.split(".").pop() || "mp3";
        const name = `in${i}.${ext}`;
        await ffmpeg.writeFile(name, await fetchFile(files[i]));
        inputArgs.push("-i", name);
      }
      const filterInputs = files.map((_, i) => `[${i}:a]`).join("");
      const filter = `${filterInputs}concat=n=${files.length}:v=0:a=1[out]`;
      await ffmpeg.exec([...inputArgs, "-filter_complex", filter, "-map", "[out]", "output.mp3"]);
      const data = await ffmpeg.readFile("output.mp3");
      const blob = new Blob([new Uint8Array(data as Uint8Array<ArrayBufferLike>)], { type: "audio/mpeg" });
      download(blob, "merged.mp3");
    } catch {
      setError("Couldn't merge those files.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Add audio files
        <input
          type="file"
          accept="audio/*"
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
              <p className="flex-1 truncate text-sm text-ink">{file.name}</p>
              <button onClick={() => removeAt(i)} className="text-ink-soft hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {busy && (
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-amber transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      <button
        onClick={merge}
        disabled={files.length < 2 || busy}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> {busy ? "Merging…" : "Merge & download"}
      </button>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-24 rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber";

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
