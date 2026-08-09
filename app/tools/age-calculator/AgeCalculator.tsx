"use client";

import { useMemo, useState } from "react";

function diffYmd(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [asOfDate, setAsOfDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const from = new Date(birthDate);
    const to = asOfDate ? new Date(asOfDate) : new Date();
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return null;

    const { years, months, days } = diffYmd(from, to);
    const totalDays = Math.floor((to.getTime() - from.getTime()) / 86_400_000);

    const nextBirthday = new Date(to.getFullYear(), from.getMonth(), from.getDate());
    if (nextBirthday < to) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - to.getTime()) / 86_400_000);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      daysToNextBirthday,
    };
  }, [birthDate, asOfDate]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Date of birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            As of (defaults to today)
          </label>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
      </div>

      {birthDate && !result && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Check the dates — birth date should be before the &quot;as of&quot; date.
        </p>
      )}

      {result && (
        <div className="grid gap-3">
          <p className="rounded-lg border border-amber bg-amber-soft p-5 text-center font-display text-xl font-bold text-ink">
            {result.years} years, {result.months} months, {result.days} days
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Total days" value={result.totalDays.toLocaleString()} />
            <Stat label="Total weeks" value={result.totalWeeks.toLocaleString()} />
            <Stat label="Next birthday" value={`${result.daysToNextBirthday} days`} />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-ink">{value}</p>
    </div>
  );
}
