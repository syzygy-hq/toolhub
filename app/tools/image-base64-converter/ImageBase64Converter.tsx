"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

export function ImageBase64Converter() {
  const [tab, setTab] = useState<"encode" | "decode">("encode");

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {t === "encode" ? "Image → Base64" : "Base64 → Image"}
          </button>
        ))}
      </div>
      {tab === "encode" ? <EncodePanel /> : <DecodePanel />}
    </div>
  );
}

function EncodePanel() {
  const [dataUrl, setDataUrl] = useState("");
  const [fileName, setFileName] = useState("");

  function handleFile(file: File | null) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink hover:border-amber transition-colors">
        <Upload className="h-4 w-4" />
        Choose image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {dataUrl && (
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- local data: URL preview */}
            <img src={dataUrl} alt={fileName} className="h-16 w-16 rounded-md border border-line object-cover" />
            <p className="text-sm text-ink-soft">
              {fileName} · {(dataUrl.length / 1024).toFixed(1)} KB as base64
            </p>
          </div>
          <div>
            <div className="mb-1.5 flex justify-end">
              <CopyButton value={dataUrl} />
            </div>
            <pre className="h-40 w-full overflow-auto whitespace-pre-wrap break-all rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink">
              {dataUrl}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function DecodePanel() {
  const [input, setInput] = useState("");

  const src = input.trim().startsWith("data:") ? input.trim() : input.trim() ? `data:image/png;base64,${input.trim()}` : "";

  return (
    <div className="grid gap-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a data: URL or raw base64 string…"
        className="h-32 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink outline-none focus:border-amber"
      />
      {src && (
        <div className="rounded-lg border border-line bg-paper-card p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- rendering arbitrary pasted data: URLs */}
          <img
            src={src}
            alt="Decoded"
            className="mx-auto max-h-80 max-w-full rounded-md"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      )}
    </div>
  );
}
