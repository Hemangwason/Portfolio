const HEADLINES = [
  "Street Football hits 940K players",
  "2.8M games played in one month",
  "Zepto Turns 5 reaches 1.81M users",
  "Featured by LottieFiles",
  "1 in 6 players shared their recap",
  "Featured by Adobe",
  "₹40 lakh sponsorship on one game",
  "Open for new work",
];

/** Wire-style headline pill floating over the globe. */
export function TickerPill({ className = "" }: { className?: string }) {
  const track = [...HEADLINES, ...HEADLINES];
  return (
    <div
      className={`ticker-pill pointer-events-none w-[min(410px,calc(100vw-32px))] overflow-hidden rounded-[8px] py-2.5 ${className}`}
    >
      <p className="sr-only">{HEADLINES.join(". ")}</p>
      <div aria-hidden className="scroll-marquee">
        <div className="scroll-marquee-track">
          {track.map((h, i) => (
            <span key={i} className="mono-label whitespace-nowrap text-[11px] text-[#f4efe2]">
              {h}
              <span className="px-2.5">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
