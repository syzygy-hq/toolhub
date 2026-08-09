"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Square } from "lucide-react";

export function TextToSpeech() {
  const [supported, setSupported] = useState(true);
  const [text, setText] = useState(
    "Paste any text here and Toolbox will read it out loud, using your browser's built-in voices."
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection only resolves client-side
      setSupported(false);
      return;
    }
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  function speak() {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex];
    utterance.rate = rate;
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setPaused(false);
  }

  function togglePause() {
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }

  if (!supported) {
    return (
      <p className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        Your browser doesn&apos;t support speech synthesis. Try Chrome, Edge, or Safari.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-40 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Voice
          </label>
          <select
            value={voiceIndex}
            onChange={(e) => setVoiceIndex(Number(e.target.value))}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          >
            {voices.length === 0 && <option>Default</option>}
            {voices.map((v, i) => (
              <option key={v.name + v.lang} value={i}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between font-mono text-xs uppercase tracking-wide text-ink-soft">
            <span>Speed</span>
            <span>{rate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-amber"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {!speaking ? (
          <button
            onClick={speak}
            className="inline-flex items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink"
          >
            <Play className="h-4 w-4" /> Speak
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink transition-colors"
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={stop}
              className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink transition-colors"
            >
              <Square className="h-4 w-4" /> Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
