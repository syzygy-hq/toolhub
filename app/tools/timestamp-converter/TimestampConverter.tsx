"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function TimestampConverter() {
  const [epoch, setEpoch] = useState("");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");

  const date = useMemo(() => {
    if (!epoch.trim() || Number.isNaN(Number(epoch))) return null;
    const ms = unit === "seconds" ? Number(epoch) * 1000 : Number(epoch);
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [epoch, unit]);

  function useNow() {
    const now = Date.now();
    setEpoch(unit === "seconds" ? String(Math.floor(now / 1000)) : String(now));
  }

  function applyLocalDatetime(value: string) {
    if (!value) return;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return;
    setEpoch(unit === "seconds" ? String(Math.floor(d.getTime() / 1000)) : String(d.getTime()));
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(["seconds", "milliseconds"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                unit === u
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
        <button
          onClick={useNow}
          className="ml-auto rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          Use now
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Unix timestamp ({unit})
          </label>
          <input
            value={epoch}
            onChange={(e) => setEpoch(e.target.value)}
            placeholder={unit === "seconds" ? "1715600000" : "1715600000000"}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Local date & time
          </label>
          <input
            type="datetime-local"
            step="1"
            value={date ? toLocalInputValue(date) : ""}
            onChange={(e) => applyLocalDatetime(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
      </div>

      {date ? (
        <div className="grid gap-3">
          <Row label="ISO 8601" value={date.toISOString()} />
          <Row label="UTC" value={date.toUTCString()} />
          <Row label="Local" value={date.toString()} />
          <Row label="Relative" value={formatRelative(date)} />
        </div>
      ) : (
        epoch.trim() !== "" && (
          <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            That doesn&apos;t look like a valid timestamp.
          </p>
        )
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper p-3">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
          {label}
        </p>
        <p className="font-mono text-sm text-ink">{value}</p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatRelative(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secs] of units) {
    if (abs >= secs || unit === "second") {
      return rtf.format(Math.round(diffSec / secs), unit);
    }
  }
  return "now";
}
