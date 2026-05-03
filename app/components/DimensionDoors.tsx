import Link from "next/link";

// Two large doors that send the visitor to the full archives. Sits
// directly after the pinned showcase so the carousel reads as a
// curated cut, with the full product / visual collections one click
// away. Light dimension styling — these are still the home page.
export function DimensionDoors() {
  return (
    <section
      aria-labelledby="dimension-doors-heading"
      className="relative px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col items-start gap-3 sm:mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/40 sm:text-[11px]">
            Want the full archive?
          </p>
          <h2
            id="dimension-doors-heading"
            className="text-[clamp(1.6rem,4vw,2.6rem)] font-semibold leading-[1.1] tracking-tight text-black"
          >
            Step into the dimension that fits the work you came for.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <Door
            href="/ground"
            kicker="Dim. 02 · /ground"
            title="The product wing"
            blurb="Research, systems, shipped software. Case studies written properly."
            chips={["Research", "Systems", "Mobile", "B2B"]}
            accent="brand"
          />
          <Door
            href="/play"
            kicker="Dim. 02 · /play"
            title="The visual archive"
            blurb="Posters, type, motion loops, identity. The visual side of the practice."
            chips={["Motion", "Type", "Identity", "Loops"]}
            accent="accent"
          />
        </div>
      </div>
    </section>
  );
}

type DoorProps = {
  href: string;
  kicker: string;
  title: string;
  blurb: string;
  chips: string[];
  accent: "brand" | "accent";
};

function Door({ href, kicker, title, blurb, chips, accent }: DoorProps) {
  const accentVar = accent === "brand" ? "var(--brand)" : "var(--accent)";

  return (
    <Link
      href={href}
      className="group relative isolate flex flex-col justify-between overflow-hidden rounded-[24px] border border-black/[0.08] bg-white p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 40px -22px rgba(15,23,42,0.18)",
      }}
    >
      {/* Soft branded wash that intensifies on hover. Stays well below
          the type so contrast never breaks. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, ${accentVar} 22%, transparent) 0%, transparent 60%), radial-gradient(120% 90% at 0% 100%, color-mix(in oklab, ${accentVar} 12%, transparent) 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-[11px]">
          {kicker}
        </p>
        <span
          className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-black transition-transform duration-300 group-hover:rotate-[-12deg]"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3.5 10.5 L10.5 3.5 M10.5 3.5 L5 3.5 M10.5 3.5 L10.5 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="mt-12 sm:mt-16">
        <h3 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-black">
          <span style={{ color: accentVar }}>{title.split(" ")[0]}</span>{" "}
          {title.split(" ").slice(1).join(" ")}
        </h3>
        <p className="mt-2 max-w-[28ch] text-sm text-black/60 sm:text-[15px]">
          {blurb}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-black/[0.08] bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-black/65 backdrop-blur-sm"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
