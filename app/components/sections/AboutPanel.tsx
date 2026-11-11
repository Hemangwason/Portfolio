const DISCIPLINES: Array<{ group: string; items: string[] }> = [
  {
    group: "Product",
    items: ["Product Design", "User Research", "Design Systems", "Prototyping", "Front-end Builds"],
  },
  {
    group: "Visual",
    items: ["Campaigns", "Brand Identity", "Illustration", "Art Direction", "AI Imagery"],
  },
  {
    group: "Motion",
    items: ["2D Animation", "3D in Blender", "Lottie", "Motion Identity", "Game UI"],
  },
];

export function AboutPanel() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-[134px_1fr_1fr]">
        <p className="mono-label border-b border-[var(--rule)] px-4 py-4 text-[var(--ink-faint)] md:border-b-0 md:border-r md:py-6">
          About
        </p>

        <div className="border-b border-[var(--rule)] px-4 py-12 sm:px-8 md:border-b-0 md:border-r md:py-20">
          <p className="mono-label text-[var(--ink-faint)]">Product · Visual · Motion</p>
          <h2 id="about-heading" className="mt-4 text-[clamp(3rem,7vw,6rem)] leading-[0.92] tracking-[-0.02em]">
            I am <em>Hemang</em>
          </h2>
          <div className="mt-8 max-w-xl space-y-5 text-[clamp(1.25rem,1.7vw,1.6rem)] leading-[1.2]">
            <p>
              The globe above is a bird&rsquo;s-eye view of my work — the games,
              campaigns, identities and products I&rsquo;ve designed, every one
              given the same weight.
            </p>
            <p>
              Ex-Zomato, currently at Zepto. A penalty shootout 940K people played,
              a birthday story 1.81M people watched, and festival worlds on some
              of India&rsquo;s busiest home feeds.
            </p>
            <p className="text-[var(--ink-soft)]">
              Street Football was featured by LottieFiles; the motion work has
              been showcased by Adobe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          {DISCIPLINES.map((d, i) => (
            <div
              key={d.group}
              className={`border-b border-[var(--rule)] px-4 py-8 sm:px-6 md:py-12 ${
                i < DISCIPLINES.length - 1 ? "sm:border-r lg:border-r md:border-r-0" : ""
              }`}
            >
              <p className="text-[28px] leading-none">{d.group}</p>
              <ul className="mt-6 space-y-2.5">
                {d.items.map((item) => (
                  <li key={item} className="mono-label text-[var(--ink-soft)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
