export function csvToJson(csv: string): unknown[] {
  const rows = parseCsv(csv);
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  return body.map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((key, i) => {
      obj[key] = row[i] ?? "";
    });
    return obj;
  });
}

export function jsonToCsv(json: unknown): string {
  const rows = Array.isArray(json) ? json : [json];
  if (rows.length === 0) return "";
  const headerSet = new Set<string>();
  for (const row of rows) {
    if (row && typeof row === "object") {
      Object.keys(row as Record<string, unknown>).forEach((k) => headerSet.add(k));
    }
  }
  const headers = Array.from(headerSet);
  const lines = [headers.map(escapeCell).join(",")];
  for (const row of rows) {
    const record = (row ?? {}) as Record<string, unknown>;
    lines.push(headers.map((h) => escapeCell(stringify(record[h]))).join(","));
  }
  return lines.join("\n");
}

function stringify(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}
