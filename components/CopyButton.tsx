"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft transition-colors hover:border-amber hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-amber" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> {label}
        </>
      )}
    </button>
  );
}
