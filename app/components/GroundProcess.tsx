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

// CSS-only stagger via `.rise-in` + per-card `--rise-delay`. No framer-motion,
// no IntersectionObserver, no JS scroll listeners — much smoother on scroll.
export function GroundProcess() {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              01 — How I work
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--foreground)]">
              A small, <span className="serif-italic font-light">stubborn</span>{" "}
              process.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[var(--ink-base)] md:text-right">
            The same five moves on every project — from AI security
            tools to streetwear storefronts.
          </p>
        </header>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {process.map((p, i) => (
            <li
              key={p.step}
              className="rise-in glass relative flex flex-col rounded-2xl p-6"
              style={{ ["--rise-delay" as string]: `${i * 60}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--brand)]">
                  {p.step}
                </span>
                <span
                  aria-hidden
                  className="block h-px flex-1 mx-3 bg-[var(--line)]"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-mute)]">
                  /05
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-base)]">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
