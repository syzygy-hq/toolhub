import { NextRequest, NextResponse } from "next/server";

interface CrtShEntry {
  id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  not_before: string;
  not_after: string;
}

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain")?.trim().toLowerCase();
  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "The certificate transparency log lookup failed. Try again shortly." },
        { status: 502 }
      );
    }
    const data: CrtShEntry[] = await res.json();

    const seen = new Set<string>();
    const certificates = data
      .sort((a, b) => new Date(b.not_before).getTime() - new Date(a.not_before).getTime())
      .filter((entry) => {
        const key = `${entry.common_name}-${entry.not_before}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 20)
      .map((entry) => ({
        id: entry.id,
        issuer: entry.issuer_name,
        commonName: entry.common_name,
        altNames: Array.from(new Set(entry.name_value.split("\n"))),
        notBefore: entry.not_before,
        notAfter: entry.not_after,
      }));

    return NextResponse.json({ domain, certificates });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the certificate transparency log. Try again shortly." },
      { status: 502 }
    );
  }
}
