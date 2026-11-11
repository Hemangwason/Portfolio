"use client";

import { CV_URL, EMAIL, INSTAGRAM_URL, LINKEDIN_URL, LIVE_SITES, X_URL } from "./links";

const PANEL_WIDTH = "panel-w";

const SERVICES: Array<{ group: string; items: string[] }> = [
  { group: "Product", items: ["Product Design", "User Research", "Design Systems", "Prototyping", "Front-end Builds"] },
  { group: "Visual", items: ["Campaigns", "Brand Identity", "Illustration", "Art Direction", "AI Imagery"] },
  { group: "Motion", items: ["2D Animation", "3D in Blender", "Lottie", "Motion Identity", "Game UI"] },
];

function Shell({
  side,
  open,
  label,
  children,
}: {
  side: "left" | "right";
  open: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const closed = side === "left" ? "-translate-x-full" : "translate-x-full";
  return (
    <aside
      aria-label={label}
      aria-hidden={!open}
      inert={!open}
      data-scroll-momentum
      className={`panel fixed bottom-0 z-30 w-full overflow-y-auto overscroll-contain glass-strong px-6 pb-24 pt-12 sm:px-10 ${PANEL_WIDTH} ${
        side === "left" ? "left-0 md:border-r" : "right-0 md:border-l"
      } border-[var(--rule)] ${open ? "translate-x-0" : closed}`}
      style={{ top: "var(--hdr-h)" }}
    >
      {children}
    </aside>
  );
}

export function AboutPanel({ open }: { open: boolean }) {
  return (
    <Shell side="left" open={open} label="About">
      <h2 className="display text-[clamp(2.6rem,4.6vw,4rem)] uppercase leading-[0.95]">I am Hemang</h2>
      <div className="mt-8 max-w-[420px] space-y-5 text-[15px] leading-[1.4] text-[var(--ink)]">
        <p>
          Hemang Wason is a product, visual and motion designer — ex-Zomato,
          currently at Zepto. This globe is a bird&rsquo;s-eye view of the work:
          games, campaigns, identities and products, every one given the same space.
        </p>
        <p>
          Street Football pulled 940K players into a penalty shootout. Zepto Turns 5
          retold five years to 1.81M people. Before that, festival worlds on
          Zomato&rsquo;s home feed — and products of my own, like Sidetake.
        </p>
        <p>Featured by LottieFiles and Adobe.</p>
      </div>

      <div className="mt-12 max-w-[452px] space-y-10">
        {SERVICES.map((s) => (
          <div key={s.group}>
            <p className="label text-[12px] font-medium text-[var(--accent)]">{s.group}</p>
            <ul className="mt-3">
              {s.items.map((item) => (
                <li key={item} className="border-b border-[var(--rule)] py-1.5 text-[13px] text-[var(--ink-soft)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function ContactPanel({ open }: { open: boolean }) {
  const socials = [
    INSTAGRAM_URL ? { label: "Instagram", href: INSTAGRAM_URL } : null,
    { label: "X", href: X_URL },
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "CV", href: CV_URL },
  ].filter((s): s is { label: string; href: string } => Boolean(s));

  return (
    <Shell side="right" open={open} label="Contact">
      <h2 className="display text-[clamp(2.6rem,4.6vw,4rem)] uppercase leading-[0.95]">
        Big idea? You know where to find me.
      </h2>
      <p className="mt-6 max-w-[400px] text-[15px] leading-[1.4]">
        Drop a line about the next product, campaign or game — I&rsquo;m open for new work.
      </p>

      <a
        href={`mailto:${EMAIL}`}
        className="display mt-8 inline-flex h-14 items-center cta-iris rounded-full px-7 text-[22px] leading-none"
      >
        Let&rsquo;s Connect!
      </a>
      <p className="mt-4 text-[14px] text-[var(--ink-soft)]">
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 hover:text-[var(--accent)]">
          {EMAIL}
        </a>
      </p>

      <div className="mt-12 grid max-w-[452px] grid-cols-2 gap-8">
        <div>
          <p className="label text-[12px] text-[var(--accent)]">Elsewhere</p>
          <ul className="mt-3">
            {socials.map((s) => (
              <li key={s.label} className="border-b border-[var(--rule)] py-1.5">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[13px] hover:text-[var(--accent)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-[12px] text-[var(--accent)]">Live</p>
          <ul className="mt-3">
            {LIVE_SITES.map((s) => (
              <li key={s.href} className="border-b border-[var(--rule)] py-1.5">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[13px] hover:text-[var(--accent)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p aria-hidden className="display mt-14 text-[clamp(2.4rem,4vw,3.4rem)] uppercase leading-[0.92]">
        For
        <br />
        ideas
        <br />
        <span className="text-[var(--accent)]">worth playing</span>
        <br />
        with
      </p>
    </Shell>
  );
}
