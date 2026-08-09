"use client";

import { useMemo, useState } from "react";
import beautify from "js-beautify";
import { CopyButton } from "@/components/CopyButton";
import { minifyCss, minifyHtml, declutterJs } from "./minify";

const LANGUAGES = ["javascript", "css", "html"] as const;
type Language = (typeof LANGUAGES)[number];

const PLACEHOLDER: Record<Language, string> = {
  javascript: "function greet(name){return 'Hello, '+name+'!'}",
  css: ".card{padding:1rem;border-radius:.5rem}\n.card:hover{opacity:.8}",
  html: "<div><p>Hello</p><p>World</p></div>",
};

export function CodeFormatter() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [mode, setMode] = useState<"beautify" | "minify">("beautify");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      if (mode === "beautify") {
        if (language === "javascript") return beautify.js(input, { indent_size: 2 });
        if (language === "css") return beautify.css(input, { indent_size: 2 });
        return beautify.html(input, { indent_size: 2 });
      }
      if (language === "css") return minifyCss(input);
      if (language === "html") return minifyHtml(input);
      return declutterJs(input);
    } catch {
      return "Couldn't format that — check for a syntax error.";
    }
  }, [input, mode, language]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                language === lang
                  ? "border-amber bg-amber-soft text-ink"
                  : "border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["beautify", "minify"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                mode === m
                  ? "border-amber text-ink"
                  : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "minify" && language === "javascript" && (
        <p className="font-mono text-[11px] text-ink-soft">
          JS minify here only strips comments and blank lines — safe, but not
          full token-level minification.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER[language]}
            spellCheck={false}
            className="h-72 w-full resize-none rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              Output
            </label>
            {output && <CopyButton value={output} />}
          </div>
          <pre className="h-72 w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-sm text-ink">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
