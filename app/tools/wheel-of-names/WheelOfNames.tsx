"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 320;

function getThemeColor(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
}

export function WheelOfNames() {
  const [input, setInput] = useState("Pizza\nSushi\nTacos\nBurgers\nSalad\nRamen");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [pendingWinner, setPendingWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entries = input.split("\n").map((s) => s.trim()).filter(Boolean);
  const sliceAngle = entries.length > 0 ? 360 / entries.length : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || entries.length === 0) return;

    const colorA = getThemeColor("--amber-soft", "#f8e6c4");
    const colorB = getThemeColor("--paper-card", "#ffffff");
    const line = getThemeColor("--line", "#d6d8cf");
    const ink = getThemeColor("--ink", "#201f1c");

    const radius = SIZE / 2;
    ctx.clearRect(0, 0, SIZE, SIZE);

    entries.forEach((entry, i) => {
      const start = ((i * sliceAngle - 90) * Math.PI) / 180;
      const end = (((i + 1) * sliceAngle - 90) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 2, start, end);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
      ctx.fill();
      ctx.strokeStyle = line;
      ctx.stroke();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate((start + end) / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = ink;
      ctx.font = "600 14px var(--font-sans), sans-serif";
      ctx.fillText(entry.slice(0, 18), radius - 12, 4);
      ctx.restore();
    });
  }, [entries, sliceAngle]);

  function spin() {
    if (entries.length < 2 || spinning) return;
    setWinner(null);
    const winnerIndex = Math.floor(Math.random() * entries.length);
    const winnerCenter = winnerIndex * sliceAngle + sliceAngle / 2;
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.6;
    const finalAngle = (360 - (winnerCenter + jitter)) % 360;

    const base = Math.floor(rotation / 360) * 360;
    let target = base + 360 * 6 + finalAngle;
    while (target <= rotation) target += 360;

    setSpinning(true);
    setRotation(target);
    setPendingWinner(entries[winnerIndex]);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="One option per line…"
          className="h-40 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber sm:h-80"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="relative aspect-square w-full max-w-[320px]">
            <div
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-amber"
              aria-hidden
            />
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              className="h-full w-full rounded-full border-2 border-line transition-transform duration-[4000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
              onTransitionEnd={() => {
                setSpinning(false);
                setWinner(pendingWinner);
              }}
            />
          </div>
          <button
            onClick={spin}
            disabled={spinning || entries.length < 2}
            className="rounded-md border border-amber bg-amber-soft px-6 py-2.5 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {spinning ? "Spinning…" : "Spin"}
          </button>
        </div>
      </div>

      {winner && (
        <p className="rounded-lg border border-amber bg-amber-soft p-6 text-center font-display text-2xl font-bold text-ink">
          {winner}
        </p>
      )}
    </div>
  );
}
