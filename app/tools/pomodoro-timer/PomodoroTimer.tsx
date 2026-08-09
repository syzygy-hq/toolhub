"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

const DURATIONS = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
const PHASE_LABEL = { work: "Focus", short: "Short break", long: "Long break" };

export function PomodoroTimer() {
  const [tab, setTab] = useState<"pomodoro" | "countdown">("pomodoro");
  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        {(["pomodoro", "countdown"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t
                ? "border-amber bg-amber-soft text-ink"
                : "border-line bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {t === "pomodoro" ? "Pomodoro" : "Countdown"}
          </button>
        ))}
      </div>
      {tab === "pomodoro" ? <Pomodoro /> : <Countdown />}
    </div>
  );
}

function Pomodoro() {
  const [phase, setPhase] = useState<keyof typeof DURATIONS>("work");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        setPhase((currentPhase) => {
          if (currentPhase === "work") {
            const nextCycles = cycles + 1;
            setCycles(nextCycles);
            const next = nextCycles % 4 === 0 ? "long" : "short";
            setSecondsLeft(DURATIONS[next]);
            return next;
          }
          setSecondsLeft(DURATIONS.work);
          return "work";
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, cycles]);

  function reset() {
    setRunning(false);
    setPhase("work");
    setSecondsLeft(DURATIONS.work);
    setCycles(0);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / DURATIONS[phase];

  return (
    <div className="grid justify-items-center gap-5">
      <p className="font-mono text-xs uppercase tracking-wide text-amber">{PHASE_LABEL[phase]}</p>
      <div
        className="grid h-52 w-52 place-items-center rounded-full p-2 transition-[background]"
        style={{
          background: `conic-gradient(var(--amber) ${progress * 360}deg, var(--line) 0deg)`,
        }}
      >
        <div className="grid h-full w-full place-items-center rounded-full bg-paper-card">
          <span className="font-display text-4xl font-bold text-ink">
            {minutes}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
      <p className="font-mono text-xs text-ink-soft">Cycles completed: {cycles}</p>
      <div className="flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-2 rounded-md border border-amber bg-amber-soft px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}

function Countdown() {
  const [target, setTarget] = useState("");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const targetMs = target ? new Date(target).getTime() : null;
  const remainingMs = targetMs && now ? targetMs - now : null;

  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Count down to
        </label>
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber sm:w-64"
        />
      </div>

      {remainingMs !== null && (
        <div className="grid grid-cols-4 gap-2">
          {formatParts(remainingMs).map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-line bg-paper p-3 text-center">
              <p className="font-display text-2xl font-bold text-ink">{value}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{label}</p>
            </div>
          ))}
        </div>
      )}

      {remainingMs !== null && remainingMs <= 0 && (
        <p className="rounded-lg border border-amber bg-amber-soft p-4 text-center font-display text-lg font-bold text-ink">
          Time&apos;s up!
        </p>
      )}
    </div>
  );
}

function formatParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hours", value: Math.floor((total % 86400) / 3600) },
    { label: "Min", value: Math.floor((total % 3600) / 60) },
    { label: "Sec", value: total % 60 },
  ];
}
