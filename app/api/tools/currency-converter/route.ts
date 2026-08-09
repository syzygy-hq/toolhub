import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from")?.toUpperCase();
  const to = req.nextUrl.searchParams.get("to")?.toUpperCase();

  if (!from || !to || !/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
    return NextResponse.json({ error: "Provide valid 3-letter currency codes." }, { status: 400 });
  }

  if (from === to) {
    return NextResponse.json({ rate: 1, date: null });
  }

  try {
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Couldn't fetch exchange rates." }, { status: 502 });
    }
    const data = await res.json();
    const rate = data.rates?.[to];
    if (typeof rate !== "number") {
      return NextResponse.json({ error: "That currency pair isn't supported." }, { status: 400 });
    }
    return NextResponse.json({ rate, date: data.date });
  } catch {
    return NextResponse.json({ error: "Couldn't reach the exchange rate service." }, { status: 502 });
  }
}
