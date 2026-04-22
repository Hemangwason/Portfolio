import Link from "next/link";
import { PlaygroundTitle } from "./components/PlaygroundTitle";
import { FloatingLogos } from "./components/FloatingLogos";
import { Marquee } from "./components/Marquee";
import { ProjectGrid } from "./components/ProjectGrid";
import { LogoTile } from "./components/LogoTile";
import { LiveSites } from "./components/LiveSites";
import { platforms } from "./components/BrandLogos";
import { projects } from "./data/projects";

export default function Home() {
  return (
    <main className="relative flex w-full flex-col">
      {/* HERO */}
      <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 py-16">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <FloatingLogos />

        <div className="relative z-20 flex max-w-6xl flex-col items-center">
          <p className="glass mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            available for work · 2026
          </p>

          <PlaygroundTitle />

          <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-black/60 md:text-lg">
            Hemang — product designer working across research, systems,
            and the boring screens no one ships. Click{" "}
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

          <div className="mt-14 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-black/40">
            <span className="inline-block h-px w-8 bg-black/20" />
            scroll
            <span className="inline-block h-px w-8 bg-black/20" />
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

      {/* LIVE SITES — shipped & in the wild */}
      <section className="relative px-6 pt-24 pb-16 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
                01 — Live in the wild
              </p>
              <h2 className="mt-3 text-[clamp(2rem,5.5vw,3.6rem)] font-semibold leading-[0.95] tracking-tight">
                Sites I designed
                <span className="brand-gradient-text"> from scratch</span>,
                <br />
                shipped &amp; live.
              </h2>
            </div>
            <p className="max-w-md text-sm text-black/60 md:text-right">
              Identity, layout, and front-of-house — built end to end and
              currently running in the open web.
            </p>
          </header>

          <LiveSites />
        </div>
      </section>

      {/* PROJECT WALL */}
      <section className="relative px-6 pt-12 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
                02 — Selected work
              </p>
              <h2 className="mt-3 text-[clamp(2rem,5.5vw,3.6rem)] font-semibold leading-[0.95] tracking-tight">
                A focused body of
                <span className="brand-gradient-text"> product and visual </span>
                work.
              </h2>
            </div>
            <p className="max-w-md text-sm text-black/60 md:text-right">
              Twelve projects from the last three years across fintech,
              healthcare, consumer, and editorial.
            </p>
          </header>

          <ProjectGrid projects={projects} />
        </div>
      </section>

      {/* ELSEWHERE — platform links */}
      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 flex flex-col items-start gap-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
              03 — Elsewhere
            </p>
            <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight">
              The corners of the internet I spend time in.
            </h2>
            <p className="max-w-xl text-sm text-black/60">
              Playlists, films I'm working through, design references I
              bookmark, and the games I play when the screens go dark.
            </p>
          </header>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {platforms.map((p) => (
              <a
                key={p.key}
                href={p.href}
                className="glass group flex items-center gap-3 rounded-2xl p-3 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl transition-transform group-hover:scale-105"
                  style={{ background: p.brand, color: p.textOnBrand ?? "#fff" }}
                >
                  <p.Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                    {p.label}
                  </span>
                  <span className="text-sm font-semibold text-black">
                    {p.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT CTA */}
      <section className="relative px-6 pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
          <Link
            href="/play"
            className="glass-strong group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] p-8 transition-transform duration-500 hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <LogoTile platformKey="spotify" size="sm" withLabel={false} />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50">
                /play · visual
              </span>
            </div>
            <div>
              <h3 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[0.95] tracking-tight">
                Posters, type &amp;
                <br />
                <span className="brand-gradient-text">motion experiments.</span>
              </h3>
              <p className="mt-4 max-w-md text-sm text-black/60">
                Visual work — weekends, prints, and the things I make
                when the spec is just "make it feel alive".
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/70">
              Open play →
            </span>
          </Link>

          <Link
            href="/ground"
            className="glass-strong group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] p-8 transition-transform duration-500 hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <LogoTile platformKey="behance" size="sm" withLabel={false} />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50">
                /ground · product
              </span>
            </div>
            <div>
              <h3 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[0.95] tracking-tight">
                Apps, flows &amp;
                <br />
                <span className="brand-gradient-text">shipped software.</span>
              </h3>
              <p className="mt-4 max-w-md text-sm text-black/60">
                Product work — research, information architecture, and
                the rigour of shipping things people use every week.
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/70">
              Open ground →
            </span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative mt-auto border-t border-black/10 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/45">
              Hemang Wason · Product Designer
            </p>
            <p className="mt-2 text-lg font-semibold text-black">
              hemang@sidetake.com
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              { label: "Twitter / X", href: "#" },
              { label: "Read.cv", href: "#" },
              { label: "LinkedIn", href: "#" },
              { label: "Email", href: "mailto:hemang@sidetake.com" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="glass rounded-full px-4 py-1.5 font-medium transition-colors hover:bg-black hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl font-mono text-[10px] uppercase tracking-[0.22em] text-black/30">
          © 2026 · built with care, shipped with doubt
        </p>
      </footer>
    </main>
  );
}
