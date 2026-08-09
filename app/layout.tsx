import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Toolhub — small, useful tools",
  description:
    "A free, open-source workshop of small utilities: YouTube playlist length, JSON formatting, password generation, and more. Add your own tool and get credited.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink"
            >
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-md border border-line bg-paper-card text-sm"
              >
                🧰
              </span>
              Toolhub
            </Link>
            <nav className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-ink-soft sm:gap-5">
              <Link
                href="/#tools"
                className="hidden hover:text-ink transition-colors sm:inline"
              >
                Tools
              </Link>
              <Link href="/contribute" className="hover:text-ink transition-colors">
                Contribute
              </Link>
              <a
                href="https://github.com/syzygy-hq/toolhub"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line bg-paper-card px-2.5 py-1.5 text-ink hover:border-amber hover:text-amber transition-colors sm:px-3"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 font-mono text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p>Toolhub — free & open source. No accounts, no tracking, no paywalls.</p>
            <p>
              Built one tool at a time.{" "}
              <a
                href="https://github.com/syzygy-hq/toolhub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-amber transition-colors"
              >
                Add yours →
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
