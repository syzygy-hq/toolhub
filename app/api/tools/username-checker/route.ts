import { NextRequest, NextResponse } from "next/server";

interface PlatformResult {
  platform: string;
  profileUrl: string;
  available: boolean | null;
}

async function checkGitHub(username: string): Promise<PlatformResult> {
  const base = { platform: "GitHub", profileUrl: `https://github.com/${username}` };
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(8000),
    });
    return { ...base, available: res.status === 404 };
  } catch {
    return { ...base, available: null };
  }
}

async function checkGitLab(username: string): Promise<PlatformResult> {
  const base = { platform: "GitLab", profileUrl: `https://gitlab.com/${username}` };
  try {
    const res = await fetch(
      `https://gitlab.com/api/v4/users?username=${encodeURIComponent(username)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return { ...base, available: null };
    const data = await res.json();
    return { ...base, available: Array.isArray(data) && data.length === 0 };
  } catch {
    return { ...base, available: null };
  }
}

async function checkDevTo(username: string): Promise<PlatformResult> {
  const base = { platform: "Dev.to", profileUrl: `https://dev.to/${username}` };
  try {
    const res = await fetch(
      `https://dev.to/api/users/by_username?url=${encodeURIComponent(username)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    return { ...base, available: res.status === 404 };
  } catch {
    return { ...base, available: null };
  }
}

async function checkHackerNews(username: string): Promise<PlatformResult> {
  const base = { platform: "Hacker News", profileUrl: `https://news.ycombinator.com/user?id=${username}` };
  try {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/user/${encodeURIComponent(username)}.json`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return { ...base, available: null };
    const data = await res.json();
    return { ...base, available: data === null };
  } catch {
    return { ...base, available: null };
  }
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim();
  if (!username || !/^[a-zA-Z0-9_-]{1,39}$/.test(username)) {
    return NextResponse.json({ error: "Enter a valid username (letters, numbers, - and _)." }, { status: 400 });
  }

  const results = await Promise.all([
    checkGitHub(username),
    checkGitLab(username),
    checkDevTo(username),
    checkHackerNews(username),
  ]);

  return NextResponse.json({ username, results });
}
