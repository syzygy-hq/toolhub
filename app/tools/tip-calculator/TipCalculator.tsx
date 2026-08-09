"use client";

import { useMemo, useState } from "react";

export function TipCalculator() {
  const [tab, setTab] = useState<"tip" | "percent">("tip");

  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        {(["tip", "percent"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {t === "tip" ? "Tip calculator" : "Percentage calculator"}
          </button>
        ))}
      </div>
      {tab === "tip" ? <TipPanel /> : <PercentPanel />}
    </div>
  );
}

function TipPanel() {
  const [bill, setBill] = useState(50);
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(1);

  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Bill amount">
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value) || 0)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </Field>
        <Field label="Tip %">
          <input
            type="number"
            value={tipPercent}
            onChange={(e) => setTipPercent(Number(e.target.value) || 0)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </Field>
        <Field label="Split between">
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </Field>
      </div>

      <div className="flex gap-2">
        {[10, 15, 18, 20, 25].map((p) => (
          <button
            key={p}
            onClick={() => setTipPercent(p)}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
              tipPercent === p ? "border-amber bg-amber-soft text-ink" : "border-line text-ink-soft hover:text-ink"
            }`}
          >
            {p}%
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Tip" value={tip.toFixed(2)} />
        <Stat label="Total" value={total.toFixed(2)} />
        <Stat label="Per person" value={(total / people).toFixed(2)} />
      </div>
    </div>
  );
}

function PercentPanel() {
  const [x1, setX1] = useState(20);
  const [y1, setY1] = useState(150);
  const [x2, setX2] = useState(30);
  const [y2, setY2] = useState(150);
  const [from, setFrom] = useState(80);
  const [to, setTo] = useState(100);

  const result1 = useMemo(() => (x1 / 100) * y1, [x1, y1]);
  const result2 = useMemo(() => (y2 === 0 ? 0 : (x2 / y2) * 100), [x2, y2]);
  const result3 = useMemo(() => (from === 0 ? 0 : ((to - from) / from) * 100), [from, to]);

  return (
    <div className="grid gap-4">
      <Row>
        <span>What is</span>
        <NumberInput value={x1} onChange={setX1} />
        <span>% of</span>
        <NumberInput value={y1} onChange={setY1} />
        <span>?</span>
        <strong className="ml-auto font-display text-lg text-ink">{result1.toFixed(2)}</strong>
      </Row>
      <Row>
        <NumberInput value={x2} onChange={setX2} />
        <span>is what % of</span>
        <NumberInput value={y2} onChange={setY2} />
        <span>?</span>
        <strong className="ml-auto font-display text-lg text-ink">{result2.toFixed(2)}%</strong>
      </Row>
      <Row>
        <span>% change from</span>
        <NumberInput value={from} onChange={setFrom} />
        <span>to</span>
        <NumberInput value={to} onChange={setTo} />
        <strong className={`ml-auto font-display text-lg ${result3 >= 0 ? "text-ink" : "text-red-600"}`}>
          {result3 >= 0 ? "+" : ""}
          {result3.toFixed(2)}%
        </strong>
      </Row>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-paper p-3 text-sm text-ink-soft">
      {children}
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-20 rounded-md border border-line bg-paper-card px-2 py-1 text-sm text-ink outline-none focus:border-amber"
    />
  );
}

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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
