"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { LogoTile } from "./LogoTile";
import { type PlatformKey } from "./BrandLogos";

type FloatingItem = {
  key: PlatformKey;
  style: CSSProperties;
  rotate: number;
  delay: number;
  withLabel?: boolean;
  size?: "sm" | "md";
};

// Desktop / tablet: tiles arranged around the title's safe zone.
// Title sits roughly in the central 60% horizontal × 40% vertical band — keep
// every tile fully outside of that to avoid the visual collision.
// Mix of platforms (Spotify/YouTube/etc) + AI tools (Claude/Codex/Gemini…)
// since both sets live in the same daily rotation.
const desktopItems: FloatingItem[] = [
  // Top band — platforms left, AI tools right.
  { key: "spotify", style: { top: "7%", left: "4%" }, rotate: -6, delay: 0.1 },
  { key: "claude", style: { top: "8%", right: "5%" }, rotate: 5, delay: 0.15 },
  {
    key: "youtube",
    style: { top: "17%", left: "22%" },
    rotate: -3,
    delay: 0.25,
    withLabel: false,
  },
  {
    key: "cursor",
    style: { top: "15%", right: "23%" },
    rotate: 4,
    delay: 0.3,
    withLabel: false,
  },
  // Mid band — icon-only, tucked right against the edges.
  {
    key: "github",
    style: { top: "42%", left: "2%" },
    rotate: -10,
    delay: 0.38,
    withLabel: false,
    size: "sm",
  },
  {
    key: "codex",
    style: { top: "44%", right: "2%" },
    rotate: 9,
    delay: 0.4,
    withLabel: false,
    size: "sm",
  },
  // Lower band.
  {
    key: "behance",
    style: { bottom: "24%", left: "4%" },
    rotate: -8,
    delay: 0.45,
  },
  {
    key: "gemini",
    style: { bottom: "27%", right: "4%" },
    rotate: 7,
    delay: 0.5,
  },
  {
    key: "letterboxd",
    style: { bottom: "9%", left: "20%" },
    rotate: 3,
    delay: 0.55,
  },
  {
    key: "chatgpt",
    style: { bottom: "8%", right: "20%" },
    rotate: -5,
    delay: 0.6,
  },
];

// Mobile: 6 small icon-only tiles tucked into the corners and edges.
// Keeps the hero airy while still representing both platforms + AI tools.
const mobileItems: FloatingItem[] = [
  {
    key: "spotify",
    style: { top: "8%", left: "5%" },
    rotate: -8,
    delay: 0.12,
    withLabel: false,
    size: "sm",
  },
  {
    key: "claude",
    style: { top: "8%", right: "5%" },
    rotate: 8,
    delay: 0.18,
    withLabel: false,
    size: "sm",
  },
  {
    key: "cursor",
    style: { top: "40%", left: "3%" },
    rotate: -5,
    delay: 0.24,
    withLabel: false,
    size: "sm",
  },
  {
    key: "gemini",
    style: { top: "40%", right: "3%" },
    rotate: 6,
    delay: 0.3,
    withLabel: false,
    size: "sm",
  },
  {
    key: "letterboxd",
    style: { bottom: "11%", left: "7%" },
    rotate: 5,
    delay: 0.36,
    withLabel: false,
    size: "sm",
  },
  {
    key: "chatgpt",
    style: { bottom: "11%", right: "7%" },
    rotate: -6,
    delay: 0.42,
    withLabel: false,
    size: "sm",
  },
];

function FloatingLayer({
  items,
  className,
}: {
  items: FloatingItem[];
  className: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
      aria-hidden="true"
      // Radial mask: fully visible at the edges, transparent through the
      // center band where the title sits. Catches any tile that strays
      // toward the middle and softly fades it out.
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 55% 38% at center, transparent 55%, black 88%)",
        maskImage:
          "radial-gradient(ellipse 55% 38% at center, transparent 55%, black 88%)",
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          className="absolute"
          style={item.style}
          initial={{ opacity: 0, y: 16, rotate: item.rotate - 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotate: item.rotate, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: item.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -5, 0],
                    rotate: [
                      item.rotate - 0.8,
                      item.rotate + 0.8,
                      item.rotate - 0.8,
                    ],
                  }
            }
            transition={{
              duration: 5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <LogoTile
              platformKey={item.key}
              size={item.size ?? "md"}
              withLabel={item.withLabel !== false}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export function FloatingLogos() {
  return (
    <>
      <FloatingLayer items={mobileItems} className="block md:hidden" />
      <FloatingLayer items={desktopItems} className="hidden md:block" />
    </>
  );
}
