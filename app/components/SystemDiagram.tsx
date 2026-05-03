"use client";

import { motion, useReducedMotion } from "framer-motion";

type Satellite = {
  r: number;
  angle: number;
  color: string;
  label: string;
  cx: number;
  cy: number;
};

const satellites: Satellite[] = [
  { r: 80, angle: 0, color: "var(--brand)", label: "BRIEF" },
  { r: 130, angle: 120, color: "var(--accent)", label: "SPECS" },
  { r: 180, angle: 220, color: "var(--brand)", label: "SHIP" },
  { r: 130, angle: 300, color: "var(--accent)", label: "TEST" },
].map((s) => {
  const rad = (s.angle * Math.PI) / 180;
  return {
    ...s,
    cx: Number((200 + s.r * Math.cos(rad)).toFixed(2)),
    cy: Number((200 + s.r * Math.sin(rad)).toFixed(2)),
  };
});

export function SystemDiagram() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 400 400" className="relative h-full w-full">
        <defs>
          <radialGradient id="sd-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        {/* Static orbits — kept dotted, no rotation. The previous infinite
            rotate-on-three-rings animation was a constant compositor task
            that produced visible scroll jitter. */}
        {[80, 130, 180].map((r) => (
          <circle
            key={r}
            cx={200}
            cy={200}
            r={r}
            fill="none"
            stroke="var(--foreground)"
            strokeOpacity={0.18}
            strokeDasharray="2 6"
          />
        ))}

        {/* Center */}
        <circle cx={200} cy={200} r={38} fill="url(#sd-core)" />
        <circle
          cx={200}
          cy={200}
          r={38}
          fill="none"
          stroke="var(--foreground)"
          strokeOpacity={0.25}
        />
        <text
          x={200}
          y={205}
          fontSize={11}
          fontWeight={700}
          textAnchor="middle"
          fill="white"
          letterSpacing={1.2}
        >
          USER
        </text>

        {/* Satellites — single-shot entry only, no infinite loops. */}
        {satellites.map((s, i) => (
          <motion.g
            key={i}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 18,
              delay: i * 0.08,
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={s.cx} cy={s.cy} r={20} fill={s.color} />
            <text
              x={s.cx}
              y={s.cy + 3}
              fontSize={9}
              fontWeight={700}
              textAnchor="middle"
              fill="white"
              letterSpacing={0.8}
            >
              {s.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
