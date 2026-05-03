import { PlaygroundTitle } from "./components/PlaygroundTitle";
import { FloatingLogos } from "./components/FloatingLogos";
import { Marquee } from "./components/Marquee";
import { PinnedShowcase } from "./components/PinnedShowcase";
import { GhostPicker } from "./components/GhostPicker";
import { LogoBadge } from "./components/LogoTile";
import { LiveSites } from "./components/LiveSites";
import { DimensionDoors } from "./components/DimensionDoors";
import { featuredProjects } from "./data/projects";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex w-full flex-col">
      {/* HERO */}
      <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <FloatingLogos />

        <div className="relative z-20 flex w-full max-w-6xl flex-col items-center">
          <p className="glass mb-6 flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-black/70 sm:mb-8 sm:px-4 sm:py-1.5 sm:text-[11px]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            available for work · 2026
          </p>

          <PlaygroundTitle />

          <p className="mx-auto mt-8 max-w-2xl text-balance px-2 text-center text-[15px] leading-relaxed text-black/60 sm:mt-10 sm:px-0 sm:text-base md:text-lg">
            Currently at{" "}
            <span className="font-semibold text-[#E23744]">Zomato</span>{" "}
            as a product &amp; visual designer. Working across research,
            systems, and the boring screens no one ships. Click{" "}
            <Link
              href="/play"
              className="font-semibold text-black underline decoration-[var(--accent)] decoration-[2px] underline-offset-[5px]"
            >
              play
            </Link>{" "}
            for visual work, or{" "}
            <Link
              href="/ground"
              className="font-semibold text-black underline decoration-[var(--brand)] decoration-[2px] underline-offset-[5px]"
            >
              ground
            </Link>{" "}
            for products.
          </p>

          <div className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-black/40 sm:mt-14 sm:text-[11px]">
            <span className="inline-block h-px w-6 bg-black/20 sm:w-8" />
            scroll
            <span className="inline-block h-px w-6 bg-black/20 sm:w-8" />
          </div>
          <div className="mt-3 h-8 w-[1.5px] overflow-hidden rounded-full bg-black/10">
            <span className="block h-full w-full bg-black" style={{ animation: "bob 2.4s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-black/10 bg-black py-3 text-white">
        <Marquee
          words={[
            "product design",
            "visual design",
            "research",
            "design systems",
            "motion",
            "onboarding",
            "branding",
            "type",
          ]}
        />
      </section>

      {/* GHOST PICKER — last text moment before the wall of work */}
      <GhostPicker />

      {/* PINNED HORIZONTAL SHOWCASE — six hand-picked projects that
          alternate ground / play. The full archive lives on the
          dedicated dimension routes via the doors below. */}
      <PinnedShowcase projects={featuredProjects} />

      {/* DIMENSION DOORS — last move before the page lets the visitor
          choose their own depth: full product archive on /ground or
          full visual archive on /play. */}
      <DimensionDoors />

      {/* LIVE SITES — second wall of visual work, no header text */}
      <section className="relative px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <LiveSites />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative mt-auto border-t border-black/10 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/45">
              Hemang Wason · Product Builder
            </p>
            <p className="mt-2 text-lg font-semibold text-black">
              hemangwason@gmail.com
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              {
                label: "Twitter / X",
                href: "https://x.com/Hemangsidetake",
                external: true,
              },
              {
                label: "CV",
                href: "/hemang-wason-cv.pdf",
                external: true,
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/hemang-wason-577205161/",
                external: true,
              },
              {
                label: "Email",
                href: "mailto:hemangwason@gmail.com",
                external: false,
              },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="glass rounded-full px-4 py-1.5 font-medium transition-colors hover:bg-black hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 sm:mt-10 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/30">
            © 2026 · built with care, shipped with doubt
          </p>
          <div className="glass flex flex-wrap items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-black/65 sm:gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
              vibe-coded in &lt;10 hrs
            </span>
            <span className="h-3 w-px bg-black/15" />
            <span className="flex items-center gap-1.5">
              <LogoBadge platformKey="claude" size="sm" />
              <span>Claude Pro</span>
            </span>
            <span className="flex items-center gap-1.5">
              <LogoBadge platformKey="codex" size="sm" />
              <span>Codex</span>
            </span>
            <span className="flex items-center gap-1.5">
              <LogoBadge platformKey="cursor" size="sm" />
              <span>Cursor</span>
            </span>
            <span className="flex items-center gap-1.5">
              <LogoBadge platformKey="vercel" size="sm" />
              <span>Vercel</span>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
