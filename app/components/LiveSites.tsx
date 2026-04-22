"use client";

import { motion, useReducedMotion } from "framer-motion";

type Site = {
  name: string;
  url: string;
  domain: string;
  tagline: string;
  role: string;
};

const sites: Site[] = [
  {
    name: "Jexlin Designs",
    url: "https://jexlindesigns.com/",
    domain: "jexlindesigns.com",
    tagline: "Interior studio · brand & site",
    role: "Identity, site, art direction",
  },
  {
    name: "Sidetake",
    url: "https://www.sidetake.com/",
    domain: "sidetake.com",
    tagline: "Studio of small experiments",
    role: "Brand, site, systems",
  },
  {
    name: "The Lab Mag",
    url: "https://www.thelabmagofficial.com/",
    domain: "thelabmagofficial.com",
    tagline: "Editorial · culture & art",
    role: "Editorial design, web build",
  },
  {
    name: "McKinley Rice",
    url: "https://mckinleyrice.com/",
    domain: "mckinleyrice.com",
    tagline: "Talent network · global",
    role: "Site design, narrative flow",
  },
];

export function LiveSites() {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sites.map((site, i) => (
        <motion.a
          key={site.url}
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-strong group relative flex h-full flex-col overflow-hidden rounded-[22px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.55,
            delay: i * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={reduce ? undefined : { y: -4 }}
        >
          {/* preview area — blank browser canvas, ready for a screenshot */}
          <div className="relative h-36 overflow-hidden border-b border-black/8 bg-white">
            {/* faux browser chrome */}
            <div className="flex items-center gap-2 border-b border-black/6 bg-black/[0.02] px-3 py-2">
              <span className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-black/12" />
                <span className="h-2 w-2 rounded-full bg-black/12" />
                <span className="h-2 w-2 rounded-full bg-black/12" />
              </span>
              <span className="ml-1 truncate font-mono text-[10px] text-black/35">
                {site.domain}
              </span>
            </div>
            {/* blank canvas */}
            <div className="absolute inset-x-0 bottom-0 top-[34px] bg-white" />

            <span className="pointer-events-none absolute right-3 top-[42px] inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white/90 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-black/65 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              live
            </span>
            <span
              className="pointer-events-none absolute right-3 bottom-3 grid h-8 w-8 place-items-center rounded-full bg-black/85 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
              aria-hidden
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 9 L9 3 M9 3 L4.5 3 M9 3 L9 7.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* content */}
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div>
              <h3 className="text-[18px] font-semibold leading-tight tracking-tight text-black">
                {site.name}
              </h3>
              <p className="mt-1 text-[13px] font-medium text-black/55">
                {site.tagline}
              </p>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
              {site.role}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <span className="truncate font-mono text-[11px] text-black/40">
                {site.domain}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[11px] font-semibold text-white transition-transform group-hover:scale-[1.03]">
                Visit
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 9 L9 3 M9 3 L4.5 3 M9 3 L9 7.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
