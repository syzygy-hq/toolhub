export function parsePageRange(input: string, pageCount: number): number[] {
  const indices = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      for (let n = start; n <= end; n++) {
        if (n >= 1 && n <= pageCount) indices.add(n - 1);
      }
    } else if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n >= 1 && n <= pageCount) indices.add(n - 1);
    } else {
      throw new Error(`Couldn't understand "${part}" — use page numbers like 1-3,5`);
    }
  }

  if (indices.size === 0) throw new Error("No valid pages in that range.");
  return Array.from(indices).sort((a, b) => a - b);
}
