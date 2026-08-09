import { NextRequest, NextResponse } from "next/server";

interface LighthouseAudit {
  displayValue?: string;
  numericValue?: number;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const strategy = req.nextUrl.searchParams.get("strategy") === "desktop" ? "desktop" : "mobile";

  if (!url) {
    return NextResponse.json({ error: "Provide a URL to test." }, { status: 400 });
  }
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  endpoint.searchParams.set("category", "performance");
  if (apiKey) endpoint.searchParams.set("key", apiKey);

  try {
    const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(25_000) });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? "The speed test service is temporarily unavailable." },
        { status: 502 }
      );
    }

    const audits: Record<string, LighthouseAudit> = data.lighthouseResult?.audits ?? {};
    const score = data.lighthouseResult?.categories?.performance?.score;

    return NextResponse.json({
      score: typeof score === "number" ? Math.round(score * 100) : null,
      metrics: {
        firstContentfulPaint: audits["first-contentful-paint"]?.displayValue ?? null,
        largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue ?? null,
        totalBlockingTime: audits["total-blocking-time"]?.displayValue ?? null,
        cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue ?? null,
        speedIndex: audits["speed-index"]?.displayValue ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the speed test service. It has a low free quota — try again shortly." },
      { status: 502 }
    );
  }
}
