import { LogoTile } from "./LogoTile";

/**
 * Proof section — the work got picked up beyond the apps it shipped
 * in. LottieFiles featured Street Football and its engagement; Adobe
 * showcased the motion craft behind the banner work.
 */
export function SignalsStrip() {
  return (
    <section
      id="signals"
      aria-labelledby="signals-heading"
      className="border-b border-[var(--line)]"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-[170px_1fr]">
        <p className="hud-label text-[var(--ink-faint)]">03 — signals</p>

        <div>
          <h2
            id="signals-heading"
            className="max-w-3xl text-[clamp(1.6rem,3.6vw,2.8rem)] font-extrabold uppercase leading-[1.08] tracking-[-0.03em]"
          >
            Picked up beyond the app
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-base)]">
            LottieFiles featured Street Football — the game and the 2.8M games
            of engagement it pulled. Adobe showcased the motion work behind
            the campaigns.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LogoTile platformKey="lottiefiles" size="md" />
            <LogoTile platformKey="adobe" size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}
