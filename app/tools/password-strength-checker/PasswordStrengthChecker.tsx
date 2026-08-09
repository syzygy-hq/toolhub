"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { commonPasswords } from "./commonPasswords";

function estimateCrackTime(password: string): { entropyBits: number; label: string } {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  const entropyBits = password.length > 0 ? Math.log2(pool || 1) * password.length : 0;

  const guessesPerSecond = 10_000_000_000; // offline fast-hash attacker, ballpark
  const combinations = Math.pow(2, entropyBits);
  const seconds = combinations / guessesPerSecond;

  const label =
    seconds < 1
      ? "instantly"
      : seconds < 60
        ? "seconds"
        : seconds < 3600
          ? "minutes"
          : seconds < 86400
            ? "hours"
            : seconds < 31536000
              ? "days"
              : seconds < 31536000 * 100
                ? "years"
                : seconds < 31536000 * 1e6
                  ? "centuries"
                  : "longer than the universe has existed";

  return { entropyBits, label };
}

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const analysis = useMemo(() => {
    const issues: string[] = [];
    if (password.length < 12) issues.push("Use at least 12 characters");
    if (!/[a-z]/.test(password)) issues.push("Add a lowercase letter");
    if (!/[A-Z]/.test(password)) issues.push("Add an uppercase letter");
    if (!/[0-9]/.test(password)) issues.push("Add a number");
    if (!/[^a-zA-Z0-9]/.test(password)) issues.push("Add a symbol");
    const isCommon = commonPasswords.has(password.toLowerCase());
    if (isCommon) issues.push("This is one of the most commonly leaked passwords");

    const { entropyBits, label } = estimateCrackTime(password);
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (issues.length <= 2 && !isCommon) score++;
    if (issues.length === 0) score++;
    if (isCommon) score = 0;

    return { issues, entropyBits, label, score, isCommon };
  }, [password]);

  const scoreLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const scoreColor = ["bg-red-500", "bg-red-400", "bg-amber", "bg-amber", "bg-green-500"];

  return (
    <div className="grid gap-4">
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to check…"
          className="w-full rounded-md border border-line bg-paper px-3 py-2.5 pr-10 font-mono text-sm text-ink outline-none focus:border-amber"
        />
        <button
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {password && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex h-1.5 flex-1 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full ${
                    i < analysis.score ? scoreColor[analysis.score] : "bg-line"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              {scoreLabels[analysis.score]}
            </span>
          </div>

          <p className="font-mono text-xs text-ink-soft">
            ~{Math.round(analysis.entropyBits)} bits of entropy · would take an attacker roughly{" "}
            <span className="text-ink">{analysis.label}</span> to crack offline
          </p>

          {analysis.issues.length > 0 && (
            <ul className="grid gap-1 rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink-soft">
              {analysis.issues.map((issue) => (
                <li key={issue}>· {issue}</li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Everything happens in your browser — this password is never sent anywhere.
      </p>
    </div>
  );
}
