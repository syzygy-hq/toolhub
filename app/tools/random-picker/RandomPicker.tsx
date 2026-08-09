"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function RandomPicker() {
  const [input, setInput] = useState("Ada\nGrace\nAlan\nMargaret\nLinus\nBarbara");
  const [teamCount, setTeamCount] = useState(2);
  const [winner, setWinner] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[][] | null>(null);

  const names = input.split("\n").map((n) => n.trim()).filter(Boolean);

  function pickWinner() {
    setTeams(null);
    if (names.length === 0) return;
    setWinner(names[Math.floor(Math.random() * names.length)]);
  }

  function makeTeams() {
    setWinner(null);
    if (names.length === 0) return;
    const shuffled = shuffle(names);
    const groups: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => groups[i % teamCount].push(name));
    setTeams(groups);
  }

  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Names (one per line) — {names.length} entered
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-40 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={pickWinner}
          className="inline-flex items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink"
        >
          <Shuffle className="h-4 w-4" /> Pick one at random
        </button>
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">Teams</label>
          <input
            type="number"
            min={2}
            max={Math.max(2, names.length)}
            value={teamCount}
            onChange={(e) => setTeamCount(Math.max(2, Number(e.target.value) || 2))}
            className="w-16 rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
          />
          <button
            onClick={makeTeams}
            className="rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
          >
            Split into teams
          </button>
        </div>
      </div>

      {winner && (
        <p className="rounded-lg border border-amber bg-amber-soft p-6 text-center font-display text-2xl font-bold text-ink">
          {winner}
        </p>
      )}

      {teams && (
        <div className="grid gap-3 sm:grid-cols-2">
          {teams.map((team, i) => (
            <div key={i} className="rounded-lg border border-line bg-paper p-3">
              <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft">
                Team {i + 1}
              </p>
              <ul className="text-sm text-ink">
                {team.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
