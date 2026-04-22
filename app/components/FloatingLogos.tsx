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
};

const items: FloatingItem[] = [
  { key: "spotify", style: { top: "10%", left: "6%" }, rotate: -6, delay: 0.1 },
  { key: "vimeo", style: { top: "14%", right: "7%" }, rotate: 5, delay: 0.2 },
  {
    key: "behance",
    style: { top: "44%", left: "2%" },
    rotate: -10,
    delay: 0.35,
  },
  {
    key: "discord",
    style: { top: "48%", right: "3%" },
    rotate: 8,
    delay: 0.25,
  },
  {
    key: "letterboxd",
    style: { bottom: "24%", left: "12%" },
    rotate: 4,
    delay: 0.45,
  },
  {
    key: "survivors",
    style: { bottom: "20%", right: "14%" },
    rotate: -4,
    delay: 0.3,
  },
  {
    key: "templerun",
    style: { top: "28%", left: "30%" },
    rotate: 3,
    delay: 0.55,
    withLabel: false,
  },
  {
    key: "clash",
    style: { bottom: "34%", right: "32%" },
    rotate: -6,
    delay: 0.4,
    withLabel: false,
  },
];

export function FloatingLogos() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 hidden md:block"
      aria-hidden="true"
    >
      {items.map((item, i) => {
        return (
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
                size="md"
                withLabel={item.withLabel !== false}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
