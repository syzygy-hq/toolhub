"use client";

import { useMemo, useState } from "react";
import { Download, KeyRound, Loader2, X } from "lucide-react";
import {
  extractPlaylistId,
  fetchPlaylist,
  formatDuration,
  type PlaylistResult,
} from "@/lib/youtube";

const SPEEDS = [1, 1.25, 1.5, 1.75, 2];
const OWN_KEY_STORAGE = "toolbox:youtube-api-key";

export function YoutubePlaylistLength() {
  const [url, setUrl] = useState("");
  const [ownKey, setOwnKey] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem(OWN_KEY_STORAGE)
  );
  const [keyDraft, setKeyDraft] = useState("");
  const [showKeySetup, setShowKeySetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKeyPrompt, setNeedsKeyPrompt] = useState(false);
  const [result, setResult] = useState<PlaylistResult | null>(null);
  const [sortByDuration, setSortByDuration] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsKeyPrompt(false);
    setResult(null);

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setError("Couldn't find a playlist ID in that URL. Paste a full playlist link.");
      return;
    }

    setLoading(true);
    try {
      if (ownKey) {
        const data = await fetchPlaylist(playlistId, ownKey);
        setResult(data);
      } else {
        const res = await fetch(
          `/api/tools/youtube-playlist-length?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Something went wrong.");
          if (data.code === "NO_SERVER_KEY" || data.code === "QUOTA_EXCEEDED") {
            setNeedsKeyPrompt(true);
          }
          return;
        }
        setResult(data);
      }
    } catch {
      setError("Couldn't reach YouTube. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function saveKey() {
    if (!keyDraft.trim()) return;
    localStorage.setItem(OWN_KEY_STORAGE, keyDraft.trim());
    setOwnKey(keyDraft.trim());
    setShowKeySetup(false);
    setNeedsKeyPrompt(false);
    setKeyDraft("");
  }

  function clearKey() {
    localStorage.removeItem(OWN_KEY_STORAGE);
    setOwnKey(null);
  }

  const totals = useMemo(() => {
    if (!result) return null;
    const totalSeconds = result.videos.reduce((sum, v) => sum + v.durationSeconds, 0);
    const average = result.videos.length ? totalSeconds / result.videos.length : 0;
    return { totalSeconds, average };
  }, [result]);

  const sortedVideos = useMemo(() => {
    if (!result) return [];
    const videos = [...result.videos];
    if (sortByDuration) videos.sort((a, b) => b.durationSeconds - a.durationSeconds);
    else videos.sort((a, b) => a.position - b.position);
    return videos;
  }, [result, sortByDuration]);

  function exportCsv() {
    if (!result) return;
    const rows = [
      ["Position", "Title", "Channel", "Duration (seconds)", "Duration"],
      ...result.videos.map((v) => [
        String(v.position + 1),
        v.title,
        v.channelTitle,
        String(v.durationSeconds),
        formatDuration(v.durationSeconds),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${result.title.replace(/[^\w -]/g, "").slice(0, 60) || "playlist"}.csv`;
    link.click();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/playlist?list=…"
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-amber bg-amber-soft px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Calculate
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-soft">
        <span>
          {ownKey
            ? "Using your own YouTube API key."
            : "Using the shared server key — no setup needed."}
        </span>
        {ownKey ? (
          <button
            onClick={clearKey}
            className="inline-flex items-center gap-1 text-ink-soft hover:text-amber transition-colors"
          >
            <X className="h-3 w-3" /> Remove my key
          </button>
        ) : (
          <button
            onClick={() => setShowKeySetup((v) => !v)}
            className="inline-flex items-center gap-1 text-ink-soft hover:text-amber transition-colors"
          >
            <KeyRound className="h-3 w-3" /> Use my own API key
          </button>
        )}
      </div>

      {showKeySetup && !ownKey && (
        <KeySetupPanel
          keyDraft={keyDraft}
          setKeyDraft={setKeyDraft}
          onSave={saveKey}
          onCancel={() => setShowKeySetup(false)}
        />
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          {needsKeyPrompt && !ownKey && (
            <button
              onClick={() => setShowKeySetup(true)}
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-red-700 underline underline-offset-2"
            >
              <KeyRound className="h-3.5 w-3.5" /> Add your own free API key
            </button>
          )}
        </div>
      )}

      {result && totals && (
        <div className="grid gap-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              {result.title}
            </h2>
            <p className="font-mono text-xs text-ink-soft">
              {result.videos.length} videos
              {result.unavailableCount > 0 &&
                ` · ${result.unavailableCount} unavailable (private/deleted)`}
              {result.truncated && " · showing first videos only, playlist is very long"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Total length" value={formatDuration(totals.totalSeconds)} />
            <Stat label="Average video" value={formatDuration(totals.average)} />
            <Stat label="Videos" value={String(result.videos.length)} />
          </div>

          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
              Watch time at faster speeds
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SPEEDS.map((speed) => (
                <div
                  key={speed}
                  className="rounded-lg border border-line bg-paper p-3 text-center"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                    {speed}x
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold text-ink">
                    {formatDuration(totals.totalSeconds / speed)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <button
                onClick={() => setSortByDuration((v) => !v)}
                className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink transition-colors"
              >
                Sorted by {sortByDuration ? "duration ↓" : "playlist order"} — click to
                toggle
              </button>
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <tbody>
                  {sortedVideos.map((video) => (
                    <tr key={video.id} className="border-b border-line last:border-0">
                      <td className="w-10 px-3 py-2 font-mono text-xs text-ink-soft">
                        {video.position + 1}
                      </td>
                      <td className="px-3 py-2 text-ink">
                        <p className="line-clamp-1">{video.title}</p>
                        <p className="font-mono text-[10px] text-ink-soft">
                          {video.channelTitle}
                        </p>
                      </td>
                      <td className="w-20 px-3 py-2 text-right font-mono text-xs text-ink-soft">
                        {formatDuration(video.durationSeconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

function KeySetupPanel({
  keyDraft,
  setKeyDraft,
  onSave,
  onCancel,
}: {
  keyDraft: string;
  setKeyDraft: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-paper p-4">
      <p className="text-sm text-ink">
        Paste your own free YouTube Data API v3 key. It&apos;s saved only in your
        browser and used to call YouTube directly — never sent to our server.
      </p>
      <ol className="mt-2 list-decimal space-y-0.5 pl-4 font-mono text-[11px] text-ink-soft">
        <li>Open the Google Cloud Console and create (or pick) a project</li>
        <li>Enable the &ldquo;YouTube Data API v3&rdquo;</li>
        <li>Create an API key under Credentials and paste it below</li>
      </ol>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={keyDraft}
          onChange={(e) => setKeyDraft(e.target.value)}
          placeholder="AIza…"
          className="flex-1 rounded-md border border-line bg-paper-card px-3 py-2 font-mono text-xs text-ink outline-none focus:border-amber"
        />
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="rounded-md border border-amber bg-amber-soft px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
