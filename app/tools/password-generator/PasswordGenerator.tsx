"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { words } from "./wordlist";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "Il1O0";

function randomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function pick<T>(list: T[]): T {
  return list[randomInt(list.length)];
}

function strength(password: string): { label: string; score: number } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 14) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const labels = ["Weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return { label: labels[score], score };
}

export function PasswordGenerator() {
  const [mode, setMode] = useState<"password" | "passphrase">("password");
  const [length, setLength] = useState(20);
  const [wordCount, setWordCount] = useState(4);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [seed, setSeed] = useState(0);

  const value = useMemo(() => {
    if (mode === "passphrase") {
      const parts = Array.from({ length: wordCount }, () => pick(words));
      return parts.join("-") + "-" + randomInt(90) + 10;
    }

    let pool = LOWER;
    if (useUpper) pool += UPPER;
    if (useDigits) pool += DIGITS;
    if (useSymbols) pool += SYMBOLS;
    if (excludeAmbiguous) {
      pool = pool
        .split("")
        .filter((c) => !AMBIGUOUS.includes(c))
        .join("");
    }
    return Array.from({ length }, () => pick(pool.split(""))).join("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, length, wordCount, useUpper, useDigits, useSymbols, excludeAmbiguous, seed]);

  const generate = () => setSeed((s) => s + 1);

  const { label, score } = strength(value);

  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        {(["password", "passphrase"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              mode === m
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-line bg-paper p-4">
        <code className="flex-1 break-all font-mono text-lg text-ink">
          {value}
        </code>
        <button
          onClick={generate}
          aria-label="Regenerate"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line text-ink-soft hover:border-amber hover:text-amber transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <CopyButton value={value} />
      </div>

      {mode === "password" && (
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-amber transition-all"
              style={{ width: `${(score / 5) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            {label}
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "password" ? (
          <>
            <div>
              <div className="mb-1 flex justify-between font-mono text-xs uppercase tracking-wide text-ink-soft">
                <span>Length</span>
                <span>{length}</span>
              </div>
              <input
                type="range"
                min={6}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-amber"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
              <Toggle label="A-Z" checked={useUpper} onChange={setUseUpper} />
              <Toggle label="0-9" checked={useDigits} onChange={setUseDigits} />
              <Toggle label="!@#" checked={useSymbols} onChange={setUseSymbols} />
              <Toggle
                label="No Il1O0"
                checked={excludeAmbiguous}
                onChange={setExcludeAmbiguous}
              />
            </div>
          </>
        ) : (
          <div>
            <div className="mb-1 flex justify-between font-mono text-xs uppercase tracking-wide text-ink-soft">
              <span>Words</span>
              <span>{wordCount}</span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-amber"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-line bg-paper px-2.5 py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-amber"
      />
      {label}
    </label>
  );
}
