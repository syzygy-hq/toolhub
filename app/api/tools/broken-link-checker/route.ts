import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";

const MAX_URLS = 25;

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    if (parts[0] === 10 || parts[0] === 127 || parts[0] === 0) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    return false;
  }
  const lower = ip.toLowerCase();
  return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80");
}

async function isSafeUrl(urlStr: string): Promise<boolean> {
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.hostname === "localhost") return false;
  try {
    const { address } = await dns.lookup(url.hostname);
    return !isPrivateIp(address);
  } catch {
    return false;
  }
}

async function checkUrl(urlStr: string) {
  if (!(await isSafeUrl(urlStr))) {
    return { url: urlStr, ok: false, status: null, error: "Blocked or unresolvable URL" };
  }
  try {
    let res = await fetch(urlStr, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(8000) });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(urlStr, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(8000) });
    }
    return { url: urlStr, ok: res.ok, status: res.status, error: null };
  } catch {
    return { url: urlStr, ok: false, status: null, error: "Couldn't reach this URL" };
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const urls: unknown = body?.urls;
  if (!Array.isArray(urls) || urls.some((u) => typeof u !== "string")) {
    return NextResponse.json({ error: "Provide a list of URLs." }, { status: 400 });
  }
  const list = (urls as string[]).slice(0, MAX_URLS);
  const results = await Promise.all(list.map(checkUrl));
  return NextResponse.json({ results });
}
