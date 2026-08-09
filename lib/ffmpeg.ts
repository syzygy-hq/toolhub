import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const CORE_VERSION = "0.12.10";
const BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let instance: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

/**
 * Lazily loads the single-threaded ffmpeg.wasm core from a public CDN, so it's
 * only downloaded when a tool actually needs it and never bloats our own bundle.
 * Single-threaded avoids requiring COOP/COEP headers on the whole site.
 */
export async function loadFFmpeg(onProgress?: (ratio: number) => void): Promise<FFmpeg> {
  if (instance) return instance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const ffmpeg = new FFmpeg();
    if (onProgress) {
      ffmpeg.on("progress", ({ progress }) => onProgress(progress));
    }
    await ffmpeg.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    instance = ffmpeg;
    return ffmpeg;
  })();

  return loadingPromise;
}
