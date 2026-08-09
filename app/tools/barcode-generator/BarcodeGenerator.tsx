"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { Download } from "lucide-react";
import { canvasToBlob, download } from "@/lib/image";

const FORMATS = ["CODE128", "EAN13", "UPC", "CODE39", "ITF14"];

export function BarcodeGenerator() {
  const [value, setValue] = useState("4006381333931");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    try {
      JsBarcode(canvas, value, {
        format,
        lineColor: "#201f1c",
        background: "#ffffff",
        width: 2,
        height: 100,
        displayValue: true,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- result of JsBarcode's imperative canvas draw, not derived state
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't render that barcode.");
    }
  }, [value, format]);

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas || error) return;
    const blob = await canvasToBlob(canvas, "image/png");
    download(blob, `barcode-${value}.png`);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Value
          </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-center overflow-x-auto rounded-lg border border-line bg-white p-4">
        <canvas ref={canvasRef} className={`max-w-full ${error ? "hidden" : ""}`} />
      </div>

      <button
        onClick={handleDownload}
        disabled={!!error || !value}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" /> Download PNG
      </button>
    </div>
  );
}
