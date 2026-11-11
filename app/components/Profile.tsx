const FACTS: Array<[string, string]> = [
  ["experience", "2+ yrs shipping at scale"],
  ["industries", "6 — food, q-comm, fashion, edtech, AI, security"],
  ["research", "4,000+ user calls logged"],
  ["stack", "Figma · After Effects · Blender · Lottie"],
];

export function Profile() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="border-b border-[var(--line)]"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-[170px_1fr]">
        <p className="hud-label text-[var(--ink-faint)]">01 — profile</p>

        <div>
          <h2
            id="profile-heading"
            className="max-w-3xl text-[clamp(1.6rem,3.6vw,2.8rem)] font-extrabold uppercase leading-[1.08] tracking-[-0.03em]"
          >
            Design that ships, measured in{" "}
            <span className="text-[var(--amber-ink)]">players, orders and shares</span>{" "}
            — not dribbble likes.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-base)] sm:text-[16px]">
            I work across the whole surface — research, product systems, brand
            identities, and the motion that makes them feel alive. At Zomato I
            built festival worlds into the home feed; at Zepto I turn match
            nights and birthdays into games people actually play.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {FACTS.map(([k, v]) => (
              <div key={k} className="bg-[var(--background)] p-5">
                <dt className="hud-label text-[var(--ink-faint)]">{k}</dt>
                <dd className="mt-2 text-[15px] font-semibold text-[var(--ink-strong)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
