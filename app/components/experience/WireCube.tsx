const FACES: Array<{ transform: string; color: string }> = [
  { transform: "translateZ(var(--half))", color: "#ff3b30" },
  { transform: "rotateY(180deg) translateZ(var(--half))", color: "#7b5cff" },
  { transform: "rotateY(90deg) translateZ(var(--half))", color: "#29d36b" },
  { transform: "rotateY(-90deg) translateZ(var(--half))", color: "#2e8bff" },
  { transform: "rotateX(90deg) translateZ(var(--half))", color: "#f5eedc" },
  { transform: "rotateX(-90deg) translateZ(var(--half))", color: "#ffb000" },
];

/** A slowly spinning wireframe cube — the loader and header motif. */
export function WireCube({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ width: size, height: size, perspective: size * 6 }}
    >
      <div
        className="wire-cube h-full w-full"
        style={{ "--half": `${size / 2}px` } as React.CSSProperties}
      >
        {FACES.map((f) => (
          <span
            key={f.transform}
            style={{ transform: f.transform, "--face": f.color } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
