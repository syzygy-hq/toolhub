"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, type Rgb } from "./color";

export function ColorConverter() {
  const [rgb, setRgb] = useState<Rgb>({ r: 217, g: 138, b: 18 });
  const [hexInput, setHexInput] = useState(rgbToHex({ r: 217, g: 138, b: 18 }));

  const hex = useMemo(() => rgbToHex(rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);

  function applyHex(value: string) {
    setHexInput(value);
    const parsed = hexToRgb(value);
    if (parsed) setRgb(parsed);
  }

  function updateRgb(key: keyof Rgb, value: number) {
    const next = { ...rgb, [key]: clamp(value, 0, 255) };
    setRgb(next);
    setHexInput(rgbToHex(next));
  }

  function updateHsl(key: "h" | "s" | "l", value: number) {
    const max = key === "h" ? 360 : 100;
    const nextHsl = { ...hsl, [key]: clamp(value, 0, max) };
    const next = hslToRgb(nextHsl);
    setRgb(next);
    setHexInput(rgbToHex(next));
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-32 w-32 rounded-xl border border-line shadow-inner"
          style={{ backgroundColor: hex }}
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => applyHex(e.target.value)}
          className="h-9 w-32 cursor-pointer rounded-md border border-line bg-paper"
        />
      </div>

      <div className="grid gap-5">
        <Field label="HEX" value={hexInput}>
          <input
            value={hexInput}
            onChange={(e) => applyHex(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </Field>

        <Field label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}>
          <div className="grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((k) => (
              <input
                key={k}
                type="number"
                min={0}
                max={255}
                value={rgb[k]}
                onChange={(e) => updateRgb(k, Number(e.target.value))}
                className="w-full rounded-md border border-line bg-paper px-2 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
              />
            ))}
          </div>
        </Field>

        <Field label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}>
          <div className="grid grid-cols-3 gap-2">
            {(["h", "s", "l"] as const).map((k) => (
              <input
                key={k}
                type="number"
                min={0}
                max={k === "h" ? 360 : 100}
                value={hsl[k]}
                onChange={(e) => updateHsl(k, Number(e.target.value))}
                className="w-full rounded-md border border-line bg-paper px-2 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
              />
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          {label}
        </label>
        <CopyButton value={value} />
      </div>
      {children}
    </div>
  );
}
