// Real receipts from shipped work, run as a wire-service ticker.
const SIGNALS: string[] = [
  "Street Football — 940K players · 2.8M games",
  "featured by LottieFiles",
  "Zepto Turns 5 — 1.81M users reached",
  "featured by Adobe",
  "₹40L sponsorship revenue on one game",
  "90.6% game completion rate",
  "1 in 6 users shared their recap",
  "4,000+ research calls logged",
];

export function SignalTicker() {
  const track = [...SIGNALS, ...SIGNALS];

  return (
    <section
      aria-label="Highlights"
      className="relative overflow-hidden border-y border-black/20 bg-[var(--amber)] py-2.5 text-[#0a0a0b]"
    >
      {/* the heading below carries the same info for assistive tech */}
      <p className="sr-only">
        Highlights: Street Football reached 940K players and 2.8 million games
        and was featured by LottieFiles. Zepto Turns 5 reached 1.81 million
        users. Motion work featured by Adobe.
      </p>
      <div aria-hidden className="scroll-marquee">
        <div className="scroll-marquee-track">
          {track.map((text, i) => (
            <span
              key={i}
              className="inline-flex items-center font-mono text-[12px] font-semibold uppercase tracking-[0.14em]"
            >
              <span className="px-5">{text}</span>
              <span className="inline-block h-[5px] w-[5px] rotate-45 bg-[#0a0a0b]/70" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
