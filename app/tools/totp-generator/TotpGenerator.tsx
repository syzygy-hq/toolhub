"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { base32Decode, generateTotp, secondsRemaining } from "./totp";

export function TotpGenerator() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!secret.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clears a previous secret's live code when input is cleared
      setCode("");
      return;
    }
    let cancelled = false;

    async function tick() {
      try {
        const bytes = base32Decode(secret);
        if (bytes.length === 0) throw new Error("empty");
        const otp = await generateTotp(bytes);
        if (!cancelled) {
          setCode(otp);
          setRemaining(secondsRemaining());
          setError(null);
        }
      } catch {
        if (!cancelled) setError("That doesn't look like a valid base32 secret.");
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [secret]);

  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Secret key (base32)
        </label>
        <input
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="JBSWY3DPEHPK3PXP"
          spellCheck={false}
          className="w-full rounded-md border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {code && !error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-paper p-5">
          <div>
            <p className="font-mono text-3xl font-bold tracking-[0.3em] text-ink">{code}</p>
            <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-amber transition-all duration-1000 ease-linear"
                style={{ width: `${(remaining / 30) * 100}%` }}
              />
            </div>
          </div>
          <CopyButton value={code} />
        </div>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Everything is computed in your browser — the secret never leaves this
        page. Paste the same secret your authenticator app was given during
        setup (usually shown as a QR code or a short text key).
      </p>
    </div>
  );
}
