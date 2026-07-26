import type { CSSProperties } from "react";
import { LogoTile } from "./LogoTile";

// One phrase in the reel. Tinted phrases carry the claim ("featured by
// X"), neutral phrases carry the receipts (which work, what it did).
type ReelPhrase = {
  text: string;
  tint?: string;
};

const LOTTIE_TEAL = "#2EE6C3";
const ADOBE_RED = "#FF5A4E";

const REEL: ReelPhrase[] = [
  { text: "featured by LottieFiles", tint: LOTTIE_TEAL },
  { text: "Street Football — the game" },
  { text: "featured by LottieFiles", tint: LOTTIE_TEAL },
  { text: "9.4L players · 2.8M games of engagement" },
  { text: "featured by Adobe", tint: ADOBE_RED },
  { text: "the motion behind the work" },
];

// LogoTile's labels read from the site's light-theme ink variables, so
// remap them for this one black section instead of forking the tile.
const darkTileVars = {
  "--foreground": "#ffffff",
  "--ink-soft": "rgba(255,255,255,0.55)",
} as CSSProperties;

export function FeaturedReel() {
  const track = [...REEL, ...REEL];

  return (
    <section
      aria-labelledby="featured-reel-heading"
      className="relative border-y border-black/10 bg-black py-12 text-white sm:py-16"
    >
      <div className="mx-auto mb-8 flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:mb-10 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 sm:text-[11px]">
          in the wild
        </p>
        <h2
          id="featured-reel-heading"
          className="max-w-2xl text-balance text-[clamp(1.5rem,3.2vw,2.4rem)] font-semibold leading-[1.15] tracking-tight"
        >
          The work got picked up beyond the app.
        </h2>
        <p className="max-w-xl text-balance text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
          LottieFiles featured Street Football — the game and the engagement
          it pulled — and Adobe has showcased the motion work behind it.
        </p>
      </div>

      {/* The reel — decorative, repeats infinitely; the heading above
          carries the same information for assistive tech. */}
      <div aria-hidden className="scroll-marquee py-2">
        <div className="scroll-marquee-track">
          {track.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 text-[clamp(1.2rem,3.4vw,2.6rem)] font-semibold tracking-tight sm:gap-4"
            >
              <span style={item.tint ? { color: item.tint } : undefined} className={item.tint ? "" : "text-white/50"}>
                {item.text}
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-white/25" />
            </span>
          ))}
        </div>
      </div>

      <div
        className="mx-auto mt-9 flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 sm:mt-11 sm:gap-4 sm:px-6"
        style={darkTileVars}
      >
        <p className="w-full text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 sm:w-auto sm:text-left">
          featured by
        </p>
        <LogoTile platformKey="lottiefiles" size="md" />
        <LogoTile platformKey="adobe" size="md" />
      </div>
    </section>
  );
}
