"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { currencies } from "./currencies";

export function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off the fetch triggered by from/to changing
    setLoading(true);
    setError(null);
    fetch(`/api/tools/currency-converter?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setRate(null);
        } else {
          setRate(data.rate);
          setDate(data.date);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't reach the exchange rate service.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="grid gap-4">
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="mb-2 grid h-9 w-9 place-items-center justify-self-center rounded-full border border-line text-ink-soft hover:border-amber hover:text-amber transition-colors"
          aria-label="Swap currencies"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Converted
          </label>
          <div className="rounded-md border border-line bg-paper-card px-3 py-2 font-mono text-sm text-ink">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : rate !== null ? (
              (amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })
            ) : (
              "—"
            )}
          </div>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {rate !== null && !error && (
        <p className="font-mono text-xs text-ink-soft">
          1 {from} = {rate.toFixed(4)} {to} {date && `· rates as of ${date}`}
        </p>
      )}
    </div>
  );
}
