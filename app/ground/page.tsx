import Link from "next/link";
import { BackHome } from "../components/BackHome";
import { ProjectGrid } from "../components/ProjectGrid";
import { Marquee } from "../components/Marquee";
import { SystemDiagram } from "../components/SystemDiagram";
import { LogoTile } from "../components/LogoTile";
import { platformByKey } from "../components/BrandLogos";
import { productProjects } from "../data/projects";

export const metadata = {
  title: "/ground — Hemang's product work",
  description:
    "Research, systems, and shipped software. The product side of Hemang's practice.",
};

const groundPlatforms = [
  platformByKey.discord,
  platformByKey.behance,
  platformByKey.templerun,
  platformByKey.clash,
  platformByKey.survivors,
];

const stats = [
  { k: "2+ yrs", v: "shipping product" },
  { k: "6", v: "industries" },
  { k: "4,000+", v: "research calls" },
  { k: "0", v: "ego in the room" },
];

const process = [
  {
    step: "01",
    title: "Listen",
    body: "Interviews, diary studies, quiet shadowing. I start from the user, not the roadmap.",
  },
  {
    step: "02",
    title: "Brainstorm",
    body: "Paired sessions with Claude, Gemini, and Cursor. Not a replacement for taste — the collaborator that never tires of the 20th variant.",
  },
  {
    step: "03",
    title: "Draw",
    body: "Whiteboards, pens, and Figma. Many versions. Most are bad — that's the point.",
  },
  {
    step: "04",
    title: "Ship",
    body: "Design in the repo, not away from it. Specs are conversations, not handoffs.",
  },
  {
    step: "05",
    title: "Measure",
    body: "Ship small, measure, adjust. Ego goes in the drawer for at least two sprints.",
  },
];

export default function GroundPage() {
  return (
    <main className="relative flex w-full flex-col overflow-x-hidden">
      <BackHome accent="var(--brand)" />

      {/* HERO */}
      <section className="relative flex min-h-[85svh] w-full items-center px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              /ground · product work
            </p>

            <h1 className="hero-word text-[clamp(2.6rem,8.5vw,6.6rem)]">
              Design for
              <br />
              <span className="brand-gradient-text">people, not pages.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-black/60 md:text-lg">
              I lead product work end-to-end — research, information
              architecture, interaction, and systems. I care about the
              unglamorous screens that make software actually work.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.k} className="border-t border-black/20 pt-3">
                  <p className="text-2xl font-semibold leading-tight tracking-tight">
                    {s.k}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black/50">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-strong rounded-[28px] p-6">
              <SystemDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-black/10 bg-[var(--soft-blue)] py-3 text-black">
        <Marquee
          words={[
            "research",
            "information architecture",
            "interaction design",
            "design systems",
            "onboarding",
            "growth",
            "b2b",
            "mobile",
          ]}
        />
      </section>

      {/* PROCESS */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-14 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
                01 — How I work
              </p>
              <h2 className="mt-3 text-[clamp(1.8rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
                A small, stubborn process.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-black/60 md:text-right">
              The same five moves on every project — from AI security
              tools to streetwear storefronts.
            </p>
          </header>

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {process.map((p) => (
              <li
                key={p.step}
                className="glass relative flex flex-col rounded-2xl p-6"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--brand)]">
                  {p.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 flex flex-col items-start gap-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
              02 — Selected case studies
            </p>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
              Case studies, written properly.
            </h2>
            <p className="max-w-xl text-sm text-black/60">
              Each tile is a preview. Full case studies land here
              progressively through 2026.
            </p>
          </header>

          <ProjectGrid
            projects={productProjects}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </section>

      {/* OFFLINE — platforms */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="glass-strong mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[24px] p-6 sm:rounded-[28px] sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50">
              03 — When the screens go dark
            </p>
            <h3 className="mt-2 text-[clamp(1.4rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
              Communities &amp; games I'm in.
            </h3>
            <p className="mt-2 max-w-md text-sm text-black/60">
              Design communities on Discord &amp; Behance, and the
              quiet games that keep my attention span working.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {groundPlatforms.map((p) => (
              <LogoTile key={p.key} platformKey={p.key} size="md" />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="relative mx-4 mb-20 overflow-hidden rounded-[24px] bg-black px-6 py-10 text-white sm:mx-6 sm:mb-24 sm:rounded-[28px] sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[var(--brand)] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[var(--accent)] opacity-30 blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">
              let's work together
            </p>
            <h3 className="mt-3 text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-[0.95] tracking-tight">
              Got a messy problem?
              <br />
              <span className="brand-gradient-text">I like those.</span>
            </h3>
          </div>
          <a
            href="mailto:hemangwason@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Email me
            <span aria-hidden>→</span>
          </a>
        </div>
        <p className="relative z-10 mt-10 max-w-md text-sm opacity-70">
          Or see the visual side at{" "}
          <Link
            href="/play"
            className="font-semibold underline decoration-[var(--accent)] decoration-[2px] underline-offset-[5px]"
          >
            /play
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
