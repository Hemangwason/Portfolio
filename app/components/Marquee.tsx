type MarqueeProps = {
  words: string[];
  className?: string;
};

export function Marquee({ words, className = "" }: MarqueeProps) {
  const full = [...words, ...words];
  return (
    <div className={`scroll-marquee py-4 ${className}`}>
      <div className="scroll-marquee-track">
        {full.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 text-[clamp(1.6rem,3.8vw,3rem)] font-semibold tracking-tight"
          >
            {w}
            <span className="inline-block h-2 w-2 rounded-full bg-current opacity-40" />
          </span>
        ))}
      </div>
    </div>
  );
}
