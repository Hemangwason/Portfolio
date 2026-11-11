"use client";

import { useState } from "react";

type Site = {
  name: string;
  url: string;
  domain: string;
  tagline: string;
  role: string;
};

const SITES: Site[] = [
  {
    name: "Jexlin Designs",
    url: "https://jexlindesigns.com/",
    domain: "jexlindesigns.com",
    tagline: "Streetwear label · D2C store",
    role: "identity · storefront · art direction",
  },
  {
    name: "Sidetake",
    url: "https://www.sidetake.com/",
    domain: "sidetake.com",
    tagline: "Mentorship · guidance platform",
    role: "brand · site · systems",
  },
  {
    name: "The Lab Mag",
    url: "https://www.thelabmagofficial.com/",
    domain: "thelabmagofficial.com",
    tagline: "Editorial · culture & art",
    role: "editorial design · web build",
  },
  {
    name: "McKinley Rice",
    url: "https://mckinleyrice.com/",
    domain: "mckinleyrice.com",
    tagline: "Talent network · global",
    role: "site design · narrative flow",
  },
];

const shotUrl = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(
    url,
  )}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&waitUntil=networkidle0`;

const fallbackShot = (url: string) =>
  `https://image.thum.io/get/width/800/crop/500/noanimate/${url}`;

function SiteShot({ site }: { site: Site }) {
  const [stage, setStage] = useState<"primary" | "fallback" | "error">("primary");
  if (stage === "error") {
    return (
      <span className="hud-label grid h-full w-full place-items-center text-[var(--ink-mute)]">
        {site.domain}
      </span>
    );
  }
  return (
    <img
      src={stage === "primary" ? shotUrl(site.url) : fallbackShot(site.url)}
      alt={`${site.name} — live preview`}
      loading="lazy"
      decoding="async"
      onError={() => setStage(stage === "primary" ? "fallback" : "error")}
      className="h-full w-full object-cover object-top"
    />
  );
}

/**
 * Deployed, public, still running — the live endpoints, indexed like
 * everything else.
 */
export function SitesIndex() {
  return (
    <section id="live" aria-labelledby="live-heading" className="border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[170px_1fr]">
          <p className="hud-label text-[var(--ink-faint)]">04 — live endpoints</p>
          <h2
            id="live-heading"
            className="text-[clamp(1.6rem,3.6vw,2.8rem)] font-extrabold uppercase leading-[1.08] tracking-[-0.03em]"
          >
            In production right now
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
          {SITES.map((site, i) => (
            <li key={site.url} className="bg-[var(--background)]">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col transition-colors hover:bg-[var(--surface)]"
              >
                <span className="relative block h-40 overflow-hidden border-b border-[var(--line)] bg-[#101012] sm:h-44">
                  <SiteShot site={site} />
                  <span className="hud-label absolute right-3 top-3 inline-flex items-center gap-1.5 border border-[var(--chip-border)] bg-[rgba(10,10,11,0.8)] px-2 py-1 text-[var(--amber-ink)] backdrop-blur-sm">
                    <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
                    live
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-2 p-5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[19px] font-extrabold uppercase tracking-[-0.02em]">
                      {site.name}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--ink-faint)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="text-[13px] text-[var(--ink-soft)]">{site.tagline}</span>
                  <span className="hud-label mt-auto flex items-center justify-between pt-3 text-[var(--ink-faint)]">
                    {site.role}
                    <span aria-hidden className="text-[var(--ink-soft)] transition-colors group-hover:text-[var(--amber)]">
                      ↗
                    </span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
