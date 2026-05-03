import Link from "next/link";
import { BackHome } from "../components/BackHome";
import { ProjectGrid } from "../components/ProjectGrid";
import { Marquee } from "../components/Marquee";
import { LogoTile } from "../components/LogoTile";
import { platformByKey } from "../components/BrandLogos";
import { visualProjects } from "../data/projects";

export const metadata = {
  title: "/play — Hemang's visual work",
  description:
    "Posters, type, motion, and illustration. The visual side of Hemang's practice.",
};

const playPlatforms = [
  platformByKey.behance,
  platformByKey.vimeo,
  platformByKey.letterboxd,
  platformByKey.spotify,
];

export default function PlayPage() {
  return (
    <main className="relative flex w-full flex-col overflow-x-hidden">
      <BackHome accent="var(--accent)" />

      {/* HERO */}
      <section className="relative flex min-h-[88svh] w-full items-center px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
        <div
          className="dotted-grid pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="glass mb-6 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--ink)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="live-dot absolute inset-0 rounded-full bg-[var(--accent)]" />
              </span>
              <span>/play · visual work</span>
              <span aria-hidden className="text-[var(--ink-mute)]">
                ·
              </span>
              <span className="serif-italic text-[var(--ink-soft)]">
                dark dim.
              </span>
            </p>

            <h1 className="hero-word text-[clamp(2.6rem,9vw,6.8rem)] text-[var(--foreground)]">
              Visual work,
              <br />
              <span className="brand-gradient-text">clearly</span>{" "}
              <span className="serif-italic font-light">made.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--ink-base)] md:text-lg">
              Posters, type, motion loops, and the occasional mascot.
              Printed, shipped, and archived — not styled for an
              audience.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {playPlatforms.map((p) => (
                <LogoTile key={p.key} platformKey={p.key} size="sm" />
              ))}
            </div>
          </div>

          <div className="relative">
            <PosterCard />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section
        className="border-y border-[var(--line)] py-3 text-[var(--foreground)]"
        style={{ background: "var(--soft-purple)" }}
      >
        <Marquee
          words={[
            "posters",
            "type design",
            "motion",
            "illustration",
            "risograph",
            "editorial",
            "branding",
            "loops",
          ]}
        />
      </section>

      {/* GRID */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 flex flex-col items-start gap-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              01 — Visual archive
            </p>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--foreground)]">
              Everything visual,{" "}
              <span className="serif-italic font-light">recent first.</span>
            </h2>
            <p className="max-w-xl text-sm text-[var(--ink-base)]">
              Browse the archive. Each card will open a detailed
              case-study view — for now they're tile previews.
            </p>
          </header>

          <ProjectGrid
            projects={visualProjects}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </section>

      {/* INSPIRATION STRIP */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="glass-strong mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[24px] p-6 sm:rounded-[28px] sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">
              02 — What I'm watching / listening to
            </p>
            <h3 className="mt-2 text-[clamp(1.4rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight text-[var(--foreground)]">
              The inputs{" "}
              <span className="serif-italic font-light">behind</span> the
              outputs.
            </h3>
            <p className="mt-2 max-w-md text-sm text-[var(--ink-base)]">
              A rolling list — playlists on Spotify, films on
              Letterboxd, motion loops on Vimeo, boards on Behance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {playPlatforms.map((p) => (
              <LogoTile key={p.key} platformKey={p.key} size="md" />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="relative px-4 pb-20 text-center sm:px-6 sm:pb-24">
        <p className="mx-auto max-w-md text-sm text-[var(--ink-base)]">
          Looking for product work?{" "}
          <Link
            href="/ground"
            className="font-semibold text-[var(--foreground)] underline decoration-[var(--brand)] decoration-[2px] underline-offset-[5px]"
          >
            Visit /ground
          </Link>
          . For a print or a trade,{" "}
          <a
            href="mailto:hemangwason@gmail.com"
            className="font-semibold text-[var(--foreground)] underline underline-offset-[5px]"
          >
            email me
          </a>
          .
        </p>
      </section>
    </main>
  );
}

// Editorial poster artifact — restrained, archival, no gradient mesh.
// One muted ink color for the ground, one warm cream type ramp, one
// hairline accent. Reads like something pulled from a flat file, not
// a marketing splash.
function PosterCard() {
  return (
    <figure
      className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-[18px] border border-[var(--line-strong)]"
      style={{
        background:
          "radial-gradient(120% 90% at 80% 0%, #14182a 0%, #0a0c16 55%, #07080f 100%)",
        boxShadow:
          "0 30px 60px -32px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.02) inset",
      }}
      aria-label="Poster — Only in my dreams, mixtape no. 04"
    >
      {/* Registration crosshairs — a print-shop tell. */}
      <RegistrationMark className="absolute left-3 top-3" />
      <RegistrationMark className="absolute right-3 top-3" />
      <RegistrationMark className="absolute left-3 bottom-3" />
      <RegistrationMark className="absolute right-3 bottom-3" />

      {/* Single thin diagonal accent — barely there. */}
      <span
        aria-hidden
        className="absolute left-0 top-[28%] h-px w-full origin-left rotate-[-6deg] opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--brand) 35%, transparent 80%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-7">
        <header className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-soft)]">
            wk · 27 / 52
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-mute)]">
            ed. 03 / 50
          </span>
        </header>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[var(--ink-faint)]">
            mixtape no. 04
          </p>
          <h3 className="mt-3 text-[clamp(1.7rem,3.2vw,2.1rem)] font-semibold leading-[0.95] tracking-tight text-[var(--foreground)]">
            Only{" "}
            <span className="serif-italic font-light text-[var(--ink)]">
              in my
            </span>
            <br />
            <span className="serif-italic font-light text-[var(--ink)]">
              dreams.
            </span>
          </h3>
          <span
            aria-hidden
            className="mt-5 block h-px w-10"
            style={{ background: "var(--brand)", opacity: 0.7 }}
          />
          <p className="mt-3 max-w-[78%] text-[12px] leading-relaxed text-[var(--ink-base)]">
            A small print run threaded through one recurring colour
            and an old film score.
          </p>
        </div>

        <footer className="flex items-end justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--ink-mute)]">
          <span>poster · a2</span>
          <span>420 × 594 mm</span>
        </footer>
      </div>
    </figure>
  );
}

function RegistrationMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none ${className}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M0 5 H4 M6 5 H10 M5 0 V4 M5 6 V10"
          stroke="var(--ink-mute)"
          strokeWidth="0.8"
        />
        <circle cx="5" cy="5" r="1.4" stroke="var(--ink-mute)" strokeWidth="0.8" fill="none" />
      </svg>
    </span>
  );
}
