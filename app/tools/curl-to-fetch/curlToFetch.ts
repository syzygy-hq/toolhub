function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    if (quote) {
      if (char === quote) {
        quote = null;
      } else if (char === "\\" && quote === '"' && command[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else if (char === "\\" && command[i + 1] === "\n") {
      i++; // line continuation
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function curlToFetch(command: string): string {
  const tokens = tokenize(command.trim().replace(/^curl\s+/, ""));

  let url = "";
  let method: string | null = null;
  const headers: [string, string][] = [];
  let body: string | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "-X" || token === "--request") {
      method = tokens[++i];
    } else if (token === "-H" || token === "--header") {
      const header = tokens[++i] ?? "";
      const idx = header.indexOf(":");
      if (idx !== -1) {
        headers.push([header.slice(0, idx).trim(), header.slice(idx + 1).trim()]);
      }
    } else if (
      token === "-d" ||
      token === "--data" ||
      token === "--data-raw" ||
      token === "--data-binary"
    ) {
      body = tokens[++i] ?? "";
    } else if (token === "-u" || token === "--user") {
      const creds = tokens[++i] ?? "";
      headers.push(["Authorization", `Basic ${btoa(creds)}`]);
    } else if (token === "--url") {
      url = tokens[++i] ?? "";
    } else if (token.startsWith("-")) {
      // Unrecognized flag — skip it (and its value, if it clearly takes one).
    } else if (!url) {
      url = token;
    }
  }

  if (!url) throw new Error("Couldn't find a URL in that curl command.");

  const finalMethod = method ?? (body ? "POST" : "GET");
  const options: string[] = [`method: "${finalMethod}"`];

  if (headers.length > 0) {
    const headerLines = headers.map(([k, v]) => `    "${k}": ${JSON.stringify(v)}`).join(",\n");
    options.push(`headers: {\n${headerLines}\n  }`);
  }

  if (body) {
    options.push(`body: ${JSON.stringify(body)}`);
  }

  return `fetch(${JSON.stringify(url)}, {\n  ${options.join(",\n  ")}\n})\n  .then((res) => res.json())\n  .then((data) => console.log(data));`;
}
