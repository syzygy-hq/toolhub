import { tools } from "@/lib/tools-registry";
import { ToolGrid } from "@/components/ToolGrid";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:pt-20">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">
          Free · Open source · No accounts
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {tools.length} small tools. One panel.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Built one at a time, kept free on purpose. Amber means it runs
          right in your browser; steel means it needs a free key. If you
          build one yourself, it goes up here with your name on it.
        </p>
      </section>
      <ToolGrid />
    </div>
  );
}
