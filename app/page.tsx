import { tools } from "@/lib/tools-registry";
import { ToolGrid } from "@/components/ToolGrid";

export default function Home() {
  const backendCount = tools.filter((t) => t.needsBackend).length;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">
          Free · Open source · No accounts
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          A workshop of small, useful tools.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Built one at a time, kept free on purpose. Every tool below runs
          for free, and if you build one yourself, it goes up here with your
          name on it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wide">
          <span className="rounded-full border border-line bg-paper-card px-3.5 py-1.5 text-ink-soft">
            {tools.length} tools live
          </span>
          <span className="rounded-full border border-line bg-paper-card px-3.5 py-1.5 text-ink-soft">
            {backendCount} needs a key
          </span>
          <span className="rounded-full border border-line bg-paper-card px-3.5 py-1.5 text-ink-soft">
            {tools.length - backendCount} run fully in your browser
          </span>
        </div>
      </section>
      <ToolGrid />
    </div>
  );
}
