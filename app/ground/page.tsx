import Link from "next/link";
import { BackHome } from "../components/BackHome";
import { ProjectGrid } from "../components/ProjectGrid";
import { Marquee } from "../components/Marquee";
import { SystemDiagram } from "../components/SystemDiagram";
import { LogoTile } from "../components/LogoTile";
import { platformByKey } from "../components/BrandLogos";
import { productProjects } from "../data/projects";
import { GroundProcess } from "../components/GroundProcess";

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

export default function GroundPage() {
  return (
    <main className="relative flex w-full flex-col overflow-x-hidden">
      <BackHome accent="var(--brand)" />

      {/* HERO */}
      <section className="relative flex min-h-[88svh] w-full items-center px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
        <div
          className="dotted-grid pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="glass mb-6 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--ink)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="live-dot absolute inset-0 rounded-full bg-[var(--brand)]" />
              </span>
              <span>/ground · product work</span>
              <span
                aria-hidden
                className="text-[var(--ink-mute)]"
              >
                ·
              </span>
              <span className="serif-italic text-[var(--ink-soft)]">
                dark dim.
              </span>
            </p>

            <h1 className="hero-word text-[clamp(2.6rem,8.5vw,6.6rem)] text-[var(--foreground)]">
              Design <span className="serif-italic font-light">for</span>
              <br />
              <span className="brand-gradient-text">people, not pages.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--ink-base)] md:text-lg">
              I lead product work end-to-end — research, information
              architecture, interaction, and systems. I care about the
              unglamorous screens that make software actually work.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.k}
                  className="border-t border-[var(--line-strong)] pt-3"
                >
                  <p className="text-2xl font-semibold leading-tight tracking-tight text-[var(--foreground)]">
                    {s.k}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Frame around the orbit diagram in dark mode */}
            <div className="glass-strong rounded-[28px] p-6">
              <SystemDiagram />
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                <span>fig. 01</span>
                <span className="serif-italic normal-case tracking-tight text-[var(--ink-soft)]">
                  user at the center
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section
        className="border-y border-[var(--line)] py-3 text-[var(--foreground)]"
        style={{ background: "var(--soft-blue)" }}
      >
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

      {/* PROCESS — animated stagger via client component */}
      <GroundProcess />

      {/* CASE STUDIES */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 flex flex-col items-start gap-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              02 — Selected case studies
            </p>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--foreground)]">
              Case studies, <span className="serif-italic font-light">written properly.</span>
            </h2>
            <p className="max-w-xl text-sm text-[var(--ink-base)]">
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
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">
              03 — When the screens go dark
            </p>
            <h3 className="mt-2 text-[clamp(1.4rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight text-[var(--foreground)]">
              Communities <span className="serif-italic font-light">&amp;</span>{" "}
              games I'm in.
            </h3>
            <p className="mt-2 max-w-md text-sm text-[var(--ink-base)]">
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

      {/* CONTACT STRIP — flat brand-tinted panel. The two giant
          blurred radial blobs were the heaviest paint on the page;
          a single linear-gradient gives the same depth for free. */}
      <section
        className="relative mx-4 mb-20 overflow-hidden rounded-[24px] border border-[var(--line-strong)] px-6 py-10 text-[var(--foreground)] sm:mx-6 sm:mb-24 sm:rounded-[28px] sm:px-10 sm:py-14"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--brand) 22%, var(--background)) 0%, var(--background) 60%, color-mix(in oklab, var(--accent) 14%, var(--background)) 100%)",
        }}
      >
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
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
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform hover:-translate-y-0.5"
          >
            Email me
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
        <p className="relative z-10 mt-10 max-w-md text-sm text-[var(--ink-base)]">
          Or see the visual side at{" "}
          <Link
            href="/play"
            className="font-semibold text-[var(--foreground)] underline decoration-[var(--accent)] decoration-[2px] underline-offset-[5px]"
          >
            /play
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
