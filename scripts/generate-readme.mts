import { readFileSync, writeFileSync } from "node:fs";
import { tools } from "../lib/tools-registry";

const START = "<!-- TOOLS_TABLE_START -->";
const END = "<!-- TOOLS_TABLE_END -->";
const SITE_URL = "https://syzygy-toolhub.vercel.app";

const rows = tools
  .map((t) => {
    const author = t.author.url
      ? `[${t.author.name}](${t.author.url})`
      : t.author.name;
    const backend = t.needsBackend ? "Yes" : "No";
    return `| [${t.name}](${SITE_URL}/tools/${t.slug}) | ${t.category} | ${backend} | ${author} |`;
  })
  .join("\n");

const table = [
  "| Tool | Category | Needs backend | Author |",
  "| --- | --- | --- | --- |",
  rows,
].join("\n");

const readmePath = new URL("../README.md", import.meta.url);
const readme = readFileSync(readmePath, "utf8");
const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);

if (startIdx === -1 || endIdx === -1) {
  throw new Error(`Couldn't find ${START} / ${END} markers in README.md`);
}

const updated =
  readme.slice(0, startIdx + START.length) +
  "\n" +
  table +
  "\n" +
  readme.slice(endIdx);

writeFileSync(readmePath, updated);
console.log(`Updated README.md with ${tools.length} tools.`);
