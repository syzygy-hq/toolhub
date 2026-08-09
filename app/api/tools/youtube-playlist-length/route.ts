import { NextRequest, NextResponse } from "next/server";
import { extractPlaylistId, fetchPlaylist, YoutubeApiError } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("url");
  if (!input) {
    return NextResponse.json({ error: "Missing playlist URL." }, { status: 400 });
  }

  const playlistId = extractPlaylistId(input);
  if (!playlistId) {
    return NextResponse.json(
      { error: "Couldn't find a playlist ID in that URL." },
      { status: 400 }
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "The shared server key isn't configured yet.",
        code: "NO_SERVER_KEY",
      },
      { status: 503 }
    );
  }

  try {
    const result = await fetchPlaylist(playlistId, apiKey);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof YoutubeApiError) {
      const code = err.status === 403 ? "QUOTA_EXCEEDED" : "YOUTUBE_ERROR";
      return NextResponse.json({ error: err.message, code }, { status: err.status });
    }
    return NextResponse.json(
      { error: "Something went wrong reaching YouTube." },
      { status: 500 }
    );
  }
}
