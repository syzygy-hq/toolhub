"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Certificate {
  id: number;
  issuer: string;
  commonName: string;
  altNames: string[];
  notBefore: string;
  notAfter: string;
}

export function SslCertificateChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);
  const [now] = useState(() => Date.now());

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    setError(null);
    setCertificates(null);
    try {
      const res = await fetch(`/api/tools/ssl-certificate-checker?domain=${encodeURIComponent(domain.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setCertificates(data.certificates);
    } catch {
      setError("Couldn't reach the lookup service. Try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  function isExpired(notAfter: string): boolean {
    return new Date(notAfter).getTime() < now;
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
        />
        <button
          type="submit"
          disabled={loading || !domain.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-amber bg-amber-soft px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Check certificates
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {certificates && (
        <div className="grid gap-3">
          <p className="font-mono text-xs text-ink-soft">
            {certificates.length} certificate{certificates.length === 1 ? "" : "s"} found via
            certificate transparency logs
          </p>
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-lg border border-line bg-paper p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm text-ink">{cert.commonName}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                    isExpired(cert.notAfter)
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-amber/40 bg-amber-soft text-ink"
                  }`}
                >
                  {isExpired(cert.notAfter) ? "Expired" : "Valid"}
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-ink-soft">
                Issued by {cert.issuer.split("\n")[0]}
              </p>
              <p className="font-mono text-[11px] text-ink-soft">
                {new Date(cert.notBefore).toLocaleDateString()} –{" "}
                {new Date(cert.notAfter).toLocaleDateString()}
              </p>
              {cert.altNames.length > 1 && (
                <p className="mt-1 truncate font-mono text-[10px] text-ink-soft">
                  Also covers: {cert.altNames.filter((n) => n !== cert.commonName).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="font-mono text-[11px] text-ink-soft">
        Looks up public certificate transparency logs via crt.sh — free, no
        API key involved, and works for any public domain.
      </p>
    </div>
  );
}
