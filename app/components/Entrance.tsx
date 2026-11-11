const NAME_TOP = "HEMANG";
const NAME_BOTTOM = "WASON";

/**
 * Full-viewport entrance: the name set as a monument, HUD metadata
 * around it, and a frosted status card — the one piece of Sidetake
 * glass DNA carried into the console. CSS-only animation.
 */
export function Entrance() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
      style={{ paddingTop: "var(--bar-top)", paddingBottom: "var(--bar-bottom)" }}
    >
      <div className="dotted-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      {/* slow-rotating reticle ring behind the name */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <svg
          className="slow-spin h-[78vmin] w-[78vmin] opacity-[0.12]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle cx="200" cy="200" r="198" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 10" />
          <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 7" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            const x1 = 200 + Math.cos(a) * 186;
            const y1 = 200 + Math.sin(a) * 186;
            const x2 = 200 + Math.cos(a) * 198;
            const y2 = 200 + Math.sin(a) * 198;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />
            );
          })}
        </svg>
      </div>

      <div className="reticle relative z-10 flex w-full max-w-6xl flex-col items-center py-14 sm:py-16">
        {/* boot line */}
        <p className="hud-label fade-up mb-8 flex items-center gap-2 text-[var(--ink-soft)]" style={{ "--fade-delay": "0.15s" } as React.CSSProperties}>
          <span className="text-[var(--amber)]">▸</span>
          design console · 17 cases on file
          <span className="boot-caret" aria-hidden />
        </p>

        {/* the name */}
        <h1 className="entrance-name text-center text-[clamp(3.6rem,14.5vw,12rem)] text-[var(--foreground)]">
          <span className="block overflow-hidden">
            {NAME_TOP.split("").map((ch, i) => (
              <span
                key={i}
                className="letter"
                style={{ "--letter-delay": `${0.05 + i * 0.045}s` } as React.CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden text-[var(--ink-base)]">
            {NAME_BOTTOM.split("").map((ch, i) => (
              <span
                key={i}
                className="letter"
                style={{ "--letter-delay": `${0.32 + i * 0.045}s` } as React.CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* frosted status card */}
        <div
          className="glass fade-up mt-10 flex w-full max-w-md flex-col gap-3 rounded-2xl p-4 sm:p-5"
          style={{ "--fade-delay": "0.7s" } as React.CSSProperties}
        >
          <div className="flex items-center justify-between">
            <span className="hud-label rounded-full border border-[var(--chip-border)] bg-[var(--chip-bg)] px-2.5 py-1 text-[var(--ink-base)]">
              profile · v3
            </span>
            <span className="hud-label inline-flex items-center gap-1.5 text-[var(--amber-ink)]">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
              live
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--ink)]">
            Product &amp; visual designer. Ex-
            <span className="font-semibold text-[#ff5a4e]">Zomato</span>, currently at{" "}
            <span className="font-semibold text-[#b794ff]">Zepto</span> — games,
            campaigns, identities and the products behind them.
          </p>
          <p className="hud-label text-[var(--ink-faint)]">
            research · systems · motion · 3d · type
          </p>
        </div>

        {/* scroll cue */}
        <div
          className="fade-up mt-12 flex flex-col items-center gap-2"
          style={{ "--fade-delay": "1s" } as React.CSSProperties}
        >
          <span className="hud-label text-[var(--ink-mute)]">scroll for the index</span>
          <div className="h-8 w-px overflow-hidden bg-[var(--line)]">
            <span
              className="block h-full w-full bg-[var(--amber)]"
              style={{ animation: "bob 2.4s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
