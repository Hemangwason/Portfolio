"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const fragments = [
  { text: "hemang's ", plain: true },
  { text: "play", plain: false, href: "/play", accent: "var(--accent)" },
  { text: "ground", plain: false, href: "/ground", accent: "var(--brand)" },
];

export function PlaygroundTitle() {
  const reduce = useReducedMotion();

  return (
    <h1 className="hero-word relative z-20 text-center text-[clamp(3rem,14vw,11rem)]">
      {fragments.map((frag, fi) => {
        if (frag.plain) {
          return (
            <span key={fi} className="inline-block">
              {frag.text.split("").map((ch, i) => (
                <motion.span
                  key={`${fi}-${i}`}
                  className="letter"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.08 * i,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
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
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.08 * (fi === 1 ? i + 9 : i + 13),
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
