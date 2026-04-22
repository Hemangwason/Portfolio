import Link from "next/link";
import { BackHome } from "../components/BackHome";
import { ProjectGrid } from "../components/ProjectGrid";
import { Marquee } from "../components/Marquee";
import { LogoTile } from "../components/LogoTile";
import { platformByKey } from "../components/BrandLogos";
import { GradientMesh } from "../components/GradientMesh";
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
      <section className="relative flex min-h-[85svh] w-full items-center px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              /play · visual work
            </p>

            <h1 className="hero-word text-[clamp(2.6rem,9vw,6.8rem)]">
              Visual work,
              <br />
              <span className="brand-gradient-text">clearly made.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-black/60 md:text-lg">
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
            <div className="glass-strong relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-[28px]">
              <GradientMesh
                variant="ribbon"
                className="absolute inset-0 h-full w-full"
              />
              <div className="relative flex h-full flex-col justify-between p-7">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-black/60 backdrop-blur-md">
                    week 27 / 52
                  </p>
                  <p className="mt-6 text-[clamp(2rem,4vw,2.8rem)] font-semibold leading-[0.9] tracking-tight text-black">
                    Only in
                    <br />
                    <span className="brand-gradient-text">my dreams.</span>
                  </p>
                </div>
                <div className="flex items-end justify-between rounded-xl bg-white/55 p-3 font-mono text-[10px] uppercase tracking-[0.22em] text-black/55 backdrop-blur-md">
                  <span>mixtape · poster</span>
                  <span>a2 — 420×594</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-black/10 bg-[var(--soft-purple)] py-3 text-black">
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
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
              01 — Visual archive
            </p>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
              Everything visual, recent first.
            </h2>
            <p className="max-w-xl text-sm text-black/60">
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
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50">
              02 — What I'm watching / listening to
            </p>
            <h3 className="mt-2 text-[clamp(1.4rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
              The inputs behind the outputs.
            </h3>
            <p className="mt-2 max-w-md text-sm text-black/60">
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
        <p className="mx-auto max-w-md text-sm text-black/60">
          Looking for product work?{" "}
          <Link
            href="/ground"
            className="font-semibold text-black underline decoration-[var(--brand)] decoration-[2px] underline-offset-[5px]"
          >
            Visit /ground
          </Link>
          . For a print or a trade,{" "}
          <a
            href="mailto:hemang@sidetake.com"
            className="font-semibold text-black underline underline-offset-[5px]"
          >
            email me
          </a>
          .
        </p>
      </section>
    </main>
  );
}
