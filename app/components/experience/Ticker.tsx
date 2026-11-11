/** Wire-style pill floating over the bottom of the screen. */
export function Ticker({ items, className = "" }: { items: string[]; className?: string }) {
  const track = [...items, ...items];
  return (
    <div
      className={`ticker pointer-events-none w-[min(286px,calc(100vw-32px))] overflow-hidden rounded-[8px] py-[11px] ${className}`}
      aria-live="off"
    >
      <p className="sr-only">{items.join(". ")}</p>
      <div aria-hidden className="flex overflow-hidden whitespace-nowrap">
        <div className="ticker-track">
          {track.map((t, i) => (
            <span key={i} className="label whitespace-nowrap text-[11px] text-[var(--ink)]">
              {t}
              <span className="px-2">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
