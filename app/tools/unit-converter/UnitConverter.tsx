"use client";

import { useMemo, useState } from "react";
import { categories } from "./units";

export function UnitConverter() {
  const [categoryName, setCategoryName] = useState(categories[0].name);
  const category = categories.find((c) => c.name === categoryName)!;
  const [fromId, setFromId] = useState(category.units[0].id);
  const [toId, setToId] = useState(category.units[1].id);
  const [value, setValue] = useState("1");

  function selectCategory(name: string) {
    const next = categories.find((c) => c.name === name)!;
    setCategoryName(name);
    setFromId(next.units[0].id);
    setToId(next.units[1].id);
  }

  const result = useMemo(() => {
    const from = category.units.find((u) => u.id === fromId);
    const to = category.units.find((u) => u.id === toId);
    const num = Number(value);
    if (!from || !to || Number.isNaN(num)) return null;
    return to.fromBase(from.toBase(num));
  }, [category, fromId, toId, value]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => selectCategory(c.name)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              categoryName === c.name
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            From
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-24 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            />
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            To
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={result === null ? "" : Number(result.toFixed(6)).toString()}
              className="w-24 rounded-md border border-line bg-paper-card px-3 py-2 text-sm text-ink"
            />
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
