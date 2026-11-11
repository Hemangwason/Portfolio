const LINKS = [
  { label: "Email", href: "mailto:hemangwason@gmail.com", meta: "hemangwason@gmail.com" },
  { label: "Twitter / X", href: "https://x.com/Hemangsidetake", meta: "@Hemangsidetake" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hemang-wason-577205161/",
    meta: "hemang-wason",
  },
  { label: "CV", href: "/hemang-wason-cv.pdf", meta: "pdf · latest" },
];

export function ContactFooter() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[170px_1fr]">
          <p className="hud-label text-[var(--ink-faint)]">05 — contact</p>

          <div>
            <h2
              id="contact-heading"
              className="text-[clamp(2.2rem,7vw,5.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.035em]"
            >
              Got a problem
              <br />
              worth <span className="text-[var(--amber-ink)]">designing?</span>
            </h2>

            <a
              href="mailto:hemangwason@gmail.com"
              className="group mt-8 inline-flex items-center gap-3 border border-[var(--line-strong)] px-5 py-3.5 transition-colors hover:border-[var(--amber)]"
            >
              <span className="live-dot h-2 w-2 rounded-full bg-[var(--amber)]" />
              <span className="text-[15px] font-bold uppercase tracking-[-0.01em] group-hover:text-[var(--amber-ink)]">
                hemangwason@gmail.com
              </span>
              <span aria-hidden className="text-[var(--ink-soft)] group-hover:text-[var(--amber)]">
                ↗
              </span>
            </a>

            <ul className="mt-12 grid grid-cols-1 gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
              {LINKS.map((l) => (
                <li key={l.label} className="bg-[var(--background)]">
                  <a
                    href={l.href}
                    target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={l.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="group flex h-full flex-col gap-1.5 p-4 transition-colors hover:bg-[var(--surface)]"
                  >
                    <span className="hud-label flex items-center justify-between text-[var(--ink-base)]">
                      {l.label}
                      <span aria-hidden className="transition-colors group-hover:text-[var(--amber)]">↗</span>
                    </span>
                    <span className="truncate font-mono text-[12px] text-[var(--ink-faint)]">
                      {l.meta}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* colophon */}
        <div
          className="mt-16 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ paddingBottom: "calc(var(--bar-bottom) + 12px)" }}
        >
          <p className="hud-label text-[var(--ink-mute)]">
            © 2026 Hemang Wason · built with care, shipped with doubt
          </p>
          <p className="hud-label text-[var(--ink-mute)]">
            console v3.0 · vibe-coded · Claude × Vercel
          </p>
        </div>
      </div>
    </section>
  );
}
