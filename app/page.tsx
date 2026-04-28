import Link from "next/link";
import { PlaygroundTitle } from "./components/PlaygroundTitle";
import { FloatingLogos } from "./components/FloatingLogos";
import { Marquee } from "./components/Marquee";
import { ProjectStory } from "./components/ProjectStory";
import { GhostPicker } from "./components/GhostPicker";
import { LogoBadge, LogoTile } from "./components/LogoTile";
import { LiveSites } from "./components/LiveSites";
import { projects } from "./data/projects";

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

      {/* GHOST PICKER — pure delight between the marquee and the work */}
      <GhostPicker />

      {/* STORY INTRO — opens the chapter book */}
      <section className="relative px-4 pt-10 pb-6 sm:px-6 sm:pt-16 sm:pb-10 md:pt-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-black/40">
            ── selected work · {projects.length} chapters ──
          </p>
          <h2 className="mt-5 text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-tight">
            A focused body of
            <span className="brand-gradient-text"> product and visual </span>
            work.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-black/60">
            Scroll to walk through one project at a time — what it
            was, why it mattered, and what it took to ship.
          </p>
        </div>
      </section>

      {/* PROJECT STORY — one chapter per viewport */}
      <ProjectStory projects={projects} />

      {/* OUT IN THE WILD — live sites grid sits after the story */}
      <section className="relative px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-24 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
                ── currently live
              </p>
              <h2 className="mt-3 text-[clamp(2rem,5.5vw,3.6rem)] font-semibold leading-[0.95] tracking-tight">
                Out in the
                <span className="brand-gradient-text"> wild.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-black/60 md:text-right">
              Sites I designed end-to-end — identity, layout, and
              front-of-house — running in the open web right now.
            </p>
          </header>

          <LiveSites />
        </div>
      </section>

      {/* SPLIT CTA */}
      <section className="relative px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <Link
            href="/play"
            className="glass-strong group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[24px] p-6 transition-transform duration-500 hover:-translate-y-1 sm:min-h-[320px] sm:rounded-[28px] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <LogoTile platformKey="figma" size="sm" withLabel={false} noLink />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50">
                /play · visual
              </span>
            </div>
            <div>
              <h3 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[0.95] tracking-tight">
                Illustrations, type &amp;
                <br />
                <span className="brand-gradient-text">motion for apps.</span>
              </h3>
              <p className="mt-4 max-w-md text-sm text-black/60">
                Visual work that lives inside the product — illustrations,
                empty states, and the small details that give a shipped
                app its feel.
              </p>
            </div>
            <span className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-black/70 sm:mt-14">
              Open play →
            </span>
          </Link>

          <Link
            href="/ground"
            className="glass-strong group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[24px] p-6 transition-transform duration-500 hover:-translate-y-1 sm:min-h-[320px] sm:rounded-[28px] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <LogoTile platformKey="claude" size="sm" withLabel={false} noLink />
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
            <span className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-black/70 sm:mt-14">
              Open ground →
            </span>
          </Link>
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
