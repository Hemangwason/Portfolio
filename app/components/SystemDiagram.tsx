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
      <svg viewBox="0 0 400 400" className="h-full w-full">
        {/* orbits */}
        {[80, 130, 180].map((r, i) => (
          <motion.circle
            key={r}
            cx={200}
            cy={200}
            r={r}
            fill="none"
            stroke="black"
            strokeOpacity={0.12}
            strokeDasharray="2 6"
            initial={{ rotate: 0 }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{
              duration: 40 + i * 12,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "200px 200px" }}
          />
        ))}

        {/* center */}
        <circle cx={200} cy={200} r={38} fill="var(--foreground)" />
        <text
          x={200}
          y={205}
          fontSize={11}
          fontWeight={700}
          textAnchor="middle"
          fill="var(--background)"
          letterSpacing={1.2}
        >
          USER
        </text>

        {/* satellites */}
        {satellites.map((s, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: i * 0.12 }}
          >
            <motion.circle
              cx={s.cx}
              cy={s.cy}
              r={20}
              fill={s.color}
              animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
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
