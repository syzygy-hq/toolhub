"use client";

import { useState } from "react";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export function DiceCoinFlip() {
  const [tab, setTab] = useState<"dice" | "coin">("dice");
  const [diceCount, setDiceCount] = useState(2);
  const [diceValues, setDiceValues] = useState<number[]>([2, 5]);
  const [coin, setCoin] = useState<"heads" | "tails" | null>(null);
  const [rolling, setRolling] = useState(false);

  function rollDice() {
    setRolling(true);
    setTimeout(() => {
      setDiceValues(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6)));
      setRolling(false);
    }, 300);
  }

  function flipCoin() {
    setRolling(true);
    setTimeout(() => {
      setCoin(Math.random() < 0.5 ? "heads" : "tails");
      setRolling(false);
    }, 300);
  }

  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        {(["dice", "coin"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {t === "dice" ? "Dice" : "Coin flip"}
          </button>
        ))}
      </div>

      {tab === "dice" ? (
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              Number of dice
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={diceCount}
              onChange={(e) => setDiceCount(Math.min(6, Math.max(1, Number(e.target.value) || 1)))}
              className="w-16 rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
            />
          </div>
          <div
            className={`flex flex-wrap justify-center gap-3 rounded-xl border border-line bg-paper-card p-8 text-6xl transition-transform ${
              rolling ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            {diceValues.slice(0, diceCount).map((v, i) => (
              <span key={i}>{DICE_FACES[v]}</span>
            ))}
          </div>
          <p className="text-center font-mono text-sm text-ink-soft">
            Total: {diceValues.slice(0, diceCount).reduce((sum, v) => sum + v + 1, 0)}
          </p>
          <button
            onClick={rollDice}
            className="mx-auto rounded-md border border-amber bg-amber-soft px-6 py-2.5 font-mono text-xs uppercase tracking-wide text-ink"
          >
            Roll
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div
            className={`mx-auto grid h-40 w-40 place-items-center rounded-full border-4 border-amber bg-paper-card font-display text-2xl font-bold uppercase text-ink transition-transform ${
              rolling ? "rotate-180 opacity-50" : "rotate-0 opacity-100"
            }`}
          >
            {coin ?? "Flip"}
          </div>
          <button
            onClick={flipCoin}
            className="mx-auto rounded-md border border-amber bg-amber-soft px-6 py-2.5 font-mono text-xs uppercase tracking-wide text-ink"
          >
            Flip
          </button>
        </div>
      )}
    </div>
  );
}
