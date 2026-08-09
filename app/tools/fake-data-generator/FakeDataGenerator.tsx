"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { generateFakePerson, type FakePerson } from "./fakeData";

const COLUMNS: (keyof FakePerson)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "street",
  "city",
  "state",
  "zip",
  "company",
];

export function FakeDataGenerator() {
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"table" | "json" | "csv">("table");
  const [seed, setSeed] = useState(0);

  const people = useMemo(
    () => Array.from({ length: count }, generateFakePerson),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, seed]
  );

  const text = useMemo(() => {
    if (format === "json") return JSON.stringify(people, null, 2);
    if (format === "csv") {
      const rows = [COLUMNS.join(",")];
      for (const p of people) rows.push(COLUMNS.map((c) => `"${p[c]}"`).join(","));
      return rows.join("\n");
    }
    return "";
  }, [people, format]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Rows</label>
          <input
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(Math.min(200, Math.max(1, Number(e.target.value) || 1)))}
            className="w-20 rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
          />
        </div>
        <div className="flex gap-2">
          {(["table", "json", "csv"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                format === f
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </button>
      </div>

      {format === "table" ? (
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-paper">
                {COLUMNS.map((c) => (
                  <th key={c} className="whitespace-nowrap px-3 py-2 font-mono uppercase tracking-wide text-ink-soft">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((p, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  {COLUMNS.map((c) => (
                    <td key={c} className="whitespace-nowrap px-3 py-2 text-ink">
                      {p[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div className="mb-1.5 flex justify-end">
            <CopyButton value={text} />
          </div>
          <pre className="h-80 w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink">
            {text}
          </pre>
        </div>
      )}
    </div>
  );
}
