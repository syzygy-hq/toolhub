"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [color, setColor] = useState("#201f1c");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text.trim()) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }
    QRCode.toCanvas(canvasRef.current, text, {
      width: 288,
      margin: 2,
      color: { dark: color, light: "#00000000" },
    })
      .then(() => setError(null))
      .catch((err) => setError(err.message));
  }, [text, color]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Text or URL
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex items-center gap-3">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            Color
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-16 cursor-pointer rounded-md border border-line bg-paper"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="grid aspect-square w-full max-w-[288px] place-items-center rounded-xl border border-line bg-paper-card p-2">
          <canvas ref={canvasRef} width={288} height={288} className="h-full w-full" />
        </div>
        <button
          onClick={download}
          disabled={!text.trim() || !!error}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft transition-colors hover:border-amber hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> Download PNG
        </button>
      </div>
    </div>
  );
}
