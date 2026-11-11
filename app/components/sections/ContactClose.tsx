import { TickerPill } from "../globe/TickerPill";

const CONTACT = [
  { label: "hemangwason@gmail.com", href: "mailto:hemangwason@gmail.com" },
  { label: "X", href: "https://x.com/Hemangsidetake" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hemang-wason-577205161/" },
  { label: "CV", href: "/hemang-wason-cv.pdf" },
];

const LIVE = [
  { label: "jexlindesigns.com", href: "https://jexlindesigns.com/" },
  { label: "sidetake.com", href: "https://www.sidetake.com/" },
  { label: "thelabmagofficial.com", href: "https://www.thelabmagofficial.com/" },
  { label: "mckinleyrice.com", href: "https://mckinleyrice.com/" },
];

const STACK = ["For", "ideas", "worth playing", "with"];

function LinkList({ title, links }: { title: string; links: typeof CONTACT }) {
  return (
    <div>
      <p className="mono-label text-[rgba(244,239,226,0.45)]">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => {
          const external = !l.href.startsWith("mailto:");
          return (
            <li key={l.href}>
              <a
                href={l.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="mono-label underline-offset-4 hover:text-[var(--signal)] hover:underline"
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ContactClose() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-[var(--night)] text-[var(--night-ink)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
        <div className="border-b border-[var(--night-rule)] px-4 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:py-24">
          <h2 id="contact-heading" className="text-[clamp(3rem,7.5vw,6.6rem)] leading-[0.92] tracking-[-0.02em]">
            Big idea? You know <em>where to find me.</em>
          </h2>
          <p className="mt-8 max-w-md text-[22px] leading-[1.2] text-[rgba(244,239,226,0.7)]">
            Drop a line about the next product, campaign or game — I&rsquo;m
            open for new work.
          </p>
          <a
            href="mailto:hemangwason@gmail.com"
            className="mt-10 inline-flex h-14 items-center rounded-[4px] bg-[var(--signal)] px-7 text-[26px] leading-none text-white transition-transform hover:scale-[0.97]"
          >
            Let&rsquo;s Connect!
          </a>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <LinkList title="Contact" links={CONTACT} />
            <LinkList title="Live in production" links={LIVE} />
          </div>
        </div>

        <div className="flex flex-col justify-end px-4 py-16 sm:px-8 lg:py-24">
          <p aria-hidden className="text-[clamp(3.4rem,8vw,7.4rem)] leading-[0.9] tracking-[-0.02em]">
            {STACK.map((w, i) => (
              <span key={w} className={`block ${i === 2 ? "italic text-[var(--signal)]" : ""}`}>
                {w}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 border-t border-[var(--night-rule)] px-4 py-8 sm:flex-row sm:justify-between sm:px-8">
        <p className="mono-label text-[11px] text-[rgba(244,239,226,0.45)]">© 2026 Hemang Wason</p>
        <TickerPill />
        <p className="mono-label text-[11px] text-[rgba(244,239,226,0.45)]">India</p>
      </div>
    </section>
  );
}
