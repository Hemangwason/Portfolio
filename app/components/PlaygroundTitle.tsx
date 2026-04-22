"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

const fragments = [
  { text: "hemang's ", plain: true },
  { text: "play", plain: false, href: "/play", accent: "var(--accent)" },
  { text: "ground", plain: false, href: "/ground", accent: "var(--brand)" },
];

const letterDelay = (s: number): CSSProperties =>
  ({ "--letter-delay": `${s}s` } as CSSProperties);

export function PlaygroundTitle() {
  const reduce = useReducedMotion();

  return (
    <h1 className="hero-word relative z-20 text-center text-[clamp(2.6rem,13.5vw,11rem)]">
      {/* Soft white halo so any background element sits visually behind the title */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/55 blur-2xl"
      />
      {fragments.map((frag, fi) => {
        if (frag.plain) {
          return (
            <span key={fi} className="inline-block">
              {frag.text.split("").map((ch, i) => (
                <span
                  key={`${fi}-${i}`}
                  className="letter"
                  style={letterDelay(0.08 * i)}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          );
        }

        return (
          <Link
            key={fi}
            href={frag.href!}
            prefetch
            className={
              frag.text === "play" ? "play-link" : "ground-link"
            }
            aria-label={
              frag.text === "play"
                ? "Open the visual design portfolio"
                : "Open the product design portfolio"
            }
          >
            {frag.text.split("").map((ch, i) => (
              <motion.span
                key={`${fi}-${i}`}
                className="letter"
                style={letterDelay(0.08 * (fi === 1 ? i + 9 : i + 13))}
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -8,
                        color: frag.accent,
                        transition: { duration: 0.2 },
                      }
                }
              >
                {ch}
              </motion.span>
            ))}
          </Link>
        );
      })}
    </h1>
  );
}
