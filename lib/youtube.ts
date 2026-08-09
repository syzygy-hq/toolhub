const API_BASE = "https://www.googleapis.com/youtube/v3";

/** Caps pagination so a single request can't run away with a shared/free-tier quota. */
const MAX_PAGES = 15;

export interface PlaylistVideo {
  id: string;
  position: number;
  title: string;
  channelTitle: string;
  durationSeconds: number;
  thumbnail: string;
}

export interface PlaylistResult {
  playlistId: string;
  title: string;
  videos: PlaylistVideo[];
  unavailableCount: number;
  truncated: boolean;
}

export class YoutubeApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function extractPlaylistId(input: string): string | null {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const listParam = url.searchParams.get("list");
    if (listParam) return listParam;
    return null;
  } catch {
    // Not a URL — treat as a raw playlist ID if it looks like one.
    if (/^[\w-]{10,}$/.test(trimmed)) return trimmed;
    return null;
  }
}

export function parseIsoDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.round(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function getJson(url: string) {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    throw new YoutubeApiError(
      json?.error?.message ?? "YouTube returned an unexpected error.",
      res.status
    );
  }
  return json;
}

export async function fetchPlaylist(
  playlistId: string,
  apiKey: string
): Promise<PlaylistResult> {
  const metaJson = await getJson(
    `${API_BASE}/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
  );
  if (!metaJson.items?.length) {
    throw new YoutubeApiError(
      "Playlist not found. Make sure it's public or unlisted and the URL is correct.",
      404
    );
  }
  const playlistTitle = metaJson.items[0].snippet?.title ?? "Untitled playlist";

  interface RawItem {
    id: string;
    position: number;
    title: string;
    channelTitle: string;
    thumbnail: string;
  }
  const items: RawItem[] = [];
  let pageToken: string | undefined;
  let page = 0;
  let truncated = false;

  do {
    const json = await getJson(
      `${API_BASE}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}${
        pageToken ? `&pageToken=${pageToken}` : ""
      }&key=${apiKey}`
    );
    for (const item of json.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId;
      if (!videoId) continue;
      items.push({
        id: videoId,
        position: item.snippet.position,
        title: item.snippet.title,
        channelTitle:
          item.snippet.videoOwnerChannelTitle ?? item.snippet.channelTitle ?? "",
        thumbnail: item.snippet.thumbnails?.default?.url ?? "",
      });
    }
    pageToken = json.nextPageToken;
    page++;
    if (page >= MAX_PAGES && pageToken) {
      truncated = true;
      break;
    }
  } while (pageToken);

  const durationById = new Map<string, string>();
  for (let i = 0; i < items.length; i += 50) {
    const batch = items.slice(i, i + 50);
    const ids = batch.map((b) => b.id).join(",");
    const json = await getJson(
      `${API_BASE}/videos?part=contentDetails&id=${ids}&key=${apiKey}`
    );
    for (const v of json.items ?? []) {
      durationById.set(v.id, v.contentDetails?.duration ?? "PT0S");
    }
  }

  const videos: PlaylistVideo[] = [];
  for (const item of items) {
    const iso = durationById.get(item.id);
    if (!iso) continue; // Deleted or private video — not returned by videos.list.
    videos.push({
      id: item.id,
      position: item.position,
      title: item.title,
      channelTitle: item.channelTitle,
      durationSeconds: parseIsoDuration(iso),
      thumbnail: item.thumbnail,
    });
  }

  return {
    playlistId,
    title: playlistTitle,
    videos,
    unavailableCount: items.length - videos.length,
    truncated,
  };
}
