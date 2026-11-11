/** Slowly turning iridescent orb — the site's mark in the header and loader. */
export function GradientOrb({ size = 48, blur = 2, className = "" }: { size?: number; blur?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={`orb ${className}`}
      style={{ width: size, height: size, filter: `blur(${blur}px) saturate(1.15)` }}
    />
  );
}
