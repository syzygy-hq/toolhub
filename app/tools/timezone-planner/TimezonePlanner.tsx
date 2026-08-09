"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

const COMMON_ZONES = [
  "UTC", "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Moscow", "Africa/Cairo",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Kathmandu", "Asia/Dhaka", "Asia/Bangkok",
  "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul", "Australia/Sydney", "Pacific/Auckland",
];

const REFERENCE_DAY = Date.UTC(2000, 0, 1); // arbitrary fixed date used only to compute day offsets

function timeInZone(hour: number, zone: string) {
  const instant = new Date(REFERENCE_DAY + hour * 3_600_000);
  const time = instant.toLocaleTimeString("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "2-digit",
  });
  const day = Number(
    instant.toLocaleDateString("en-US", { timeZone: zone, day: "numeric" })
  );
  const offset = day - 1; // REFERENCE_DAY is always the 1st in UTC
  return { time, offset };
}

export function TimezonePlanner() {
  const [hour, setHour] = useState(9);
  const [zones, setZones] = useState(["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"]);
  const [toAdd, setToAdd] = useState("");

  const rows = useMemo(() => zones.map((zone) => ({ zone, ...timeInZone(hour, zone) })), [hour, zones]);

  function addZone() {
    if (!toAdd || zones.includes(toAdd)) return;
    setZones((prev) => [...prev, toAdd]);
    setToAdd("");
  }

  function removeZone(zone: string) {
    setZones((prev) => prev.filter((z) => z !== zone));
  }

  return (
    <div className="grid gap-4">
      <div>
        <div className="mb-1.5 flex justify-between font-mono text-xs uppercase tracking-wide text-ink-soft">
          <span>Time in UTC</span>
          <span>{String(hour).padStart(2, "0")}:00</span>
        </div>
        <input
          type="range"
          min={0}
          max={23}
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="w-full accent-amber"
        />
      </div>

      <div className="grid gap-2">
        {rows.map(({ zone, time, offset }) => (
          <div key={zone} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper p-3">
            <div>
              <p className="font-mono text-sm text-ink">{zone.replace(/_/g, " ")}</p>
              {offset !== 0 && (
                <p className="font-mono text-[10px] uppercase tracking-wide text-amber">
                  {offset > 0 ? `+${offset} day` : `${offset} day`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-bold text-ink">{time}</span>
              <button onClick={() => removeZone(zone)} className="text-ink-soft hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          value={toAdd}
          onChange={(e) => setToAdd(e.target.value)}
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        >
          <option value="">Add a timezone…</option>
          {COMMON_ZONES.filter((z) => !zones.includes(z)).map((z) => (
            <option key={z} value={z}>
              {z.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <button
          onClick={addZone}
          disabled={!toAdd}
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}
