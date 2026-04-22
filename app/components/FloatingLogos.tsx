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

// Desktop / tablet: 8 tiles arranged around the title's safe zone.
// Title sits roughly in the central 60% horizontal × 40% vertical band — keep
// every tile fully outside of that to avoid the visual collision.
const desktopItems: FloatingItem[] = [
  { key: "spotify", style: { top: "8%", left: "5%" }, rotate: -6, delay: 0.1 },
  { key: "vimeo", style: { top: "10%", right: "6%" }, rotate: 5, delay: 0.2 },
  {
    key: "templerun",
    style: { top: "16%", left: "26%" },
    rotate: -3,
    delay: 0.3,
    withLabel: false,
  },
  {
    key: "clash",
    style: { top: "14%", right: "28%" },
    rotate: 4,
    delay: 0.35,
    withLabel: false,
  },
  {
    key: "behance",
    style: { bottom: "26%", left: "3%" },
    rotate: -8,
    delay: 0.4,
  },
  {
    key: "discord",
    style: { bottom: "30%", right: "4%" },
    rotate: 7,
    delay: 0.3,
  },
  {
    key: "letterboxd",
    style: { bottom: "10%", left: "22%" },
    rotate: 3,
    delay: 0.5,
  },
  {
    key: "survivors",
    style: { bottom: "8%", right: "22%" },
    rotate: -5,
    delay: 0.45,
  },
];

// Mobile: 4 small icon-only tiles tucked into the corners. No labels — keeps
// the hero airy and avoids any chance of overlap with the wrapped title.
const mobileItems: FloatingItem[] = [
  {
    key: "spotify",
    style: { top: "9%", left: "6%" },
    rotate: -8,
    delay: 0.15,
    withLabel: false,
    size: "sm",
  },
  {
    key: "vimeo",
    style: { top: "9%", right: "6%" },
    rotate: 8,
    delay: 0.2,
    withLabel: false,
    size: "sm",
  },
  {
    key: "letterboxd",
    style: { bottom: "12%", left: "8%" },
    rotate: 5,
    delay: 0.3,
    withLabel: false,
    size: "sm",
  },
  {
    key: "survivors",
    style: { bottom: "12%", right: "8%" },
    rotate: -6,
    delay: 0.35,
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
