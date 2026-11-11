/** Glass capsule floating over the bottom of the globe. The capsule
    stays crisp; only the scrolling line fades out at its edges. */
export function Ticker({ items, className = "" }: { items: string[]; className?: string }) {
  const track = [...items, ...items];
  return (
    <div
      className={`ticker pointer-events-none flex w-[min(320px,calc(100vw-140px))] items-center gap-2.5 rounded-full py-2 pl-2 pr-3 ${className}`}
      aria-live="off"
    >
      <span aria-hidden className="orb h-5 w-5 shrink-0" style={{ filter: "blur(0.6px)" }} />
      <p className="sr-only">{items.join(". ")}</p>
      <div aria-hidden className="ticker-window flex min-w-0 flex-1 overflow-hidden whitespace-nowrap">
        <div className="ticker-track">
          {track.map((t, i) => (
            <span key={i} className="label whitespace-nowrap text-[10.5px] text-[var(--ink-soft)]">
              {t}
              <span className="px-2.5 text-[var(--ink-faint)]">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
