"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGhost } from "./GhostContext";
import {
  GHOST_VARIANTS,
  type GhostExpression,
  type GhostVariant,
} from "./GhostVariants";
import { GhostSVG } from "./Ghost";

// Pure delight. Sits between the marquee and the chapter intro and gives
// the visitor something to play with — six ghost colorways, each gently
// floating at its own phase. Click to swap the docked Ghost in the corner;
// the choice is persisted to localStorage by GhostProvider.
export function GhostPicker() {
  const { variant, setVariantById } = useGhost();
  const reduce = useReducedMotion();

  return (
    <section className="relative px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-black/40">
          ── pick your guide ──
        </p>
        <h2 className="mt-4 text-balance text-[clamp(1.9rem,5vw,3.2rem)] font-semibold leading-[1.02] tracking-tight">
          A scroll companion to
          <span className="brand-gradient-text"> walk you through.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-black/55">
          Pick a ghost. They&apos;ll dock at the bottom-left and follow
          you through the work — click to wake them, double-click to
          send them home.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {GHOST_VARIANTS.map((v, i) => (
            <PickerTile
              key={v.id}
              variant={v}
              index={i}
              active={v.id === variant.id}
              onChoose={() => setVariantById(v.id)}
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// One picker tile, owning its own expression cycle. Each tile rotates
// through the variant's `cycle` (smile → wink → smile → ...), inserting a
// quick "blink" between swaps so the face feels like it's actually
// breathing instead of cutting between poses. Phases are staggered per
// tile so the row never beats in unison.
function PickerTile({
  variant,
  index,
  active,
  onChoose,
  reduce,
}: {
  variant: GhostVariant;
  index: number;
  active: boolean;
  onChoose: () => void;
  reduce: boolean;
}) {
  const [exprIdx, setExprIdx] = useState(0);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let blinkTimeout: number | undefined;
    let nextTimeout: number | undefined;
    // Noir's eyes are hidden under the shades — a blink would render as a
    // no-op (and the cycle exists to swing the mouth, not the eyes).
    const allowBlink = variant.expression !== "cool";

    const schedule = (delay: number) => {
      nextTimeout = window.setTimeout(() => {
        if (cancelled) return;
        if (allowBlink) {
          setBlinking(true);
          blinkTimeout = window.setTimeout(() => {
            if (cancelled) return;
            setBlinking(false);
            setExprIdx((n) => (n + 1) % variant.cycle.length);
            // 4.5–6.3 s between expression swaps. Slow on purpose so the
            // face has time to *be* an expression, not a flipbook.
            schedule(4500 + Math.random() * 1800);
          }, 220);
        } else {
          setExprIdx((n) => (n + 1) % variant.cycle.length);
          schedule(4800 + Math.random() * 1800);
        }
      }, delay);
    };

    // Stagger the first tick by tile index so the six tiles don't all
    // land their first expression change on the same frame.
    schedule(1400 + index * 520 + Math.random() * 700);

    return () => {
      cancelled = true;
      if (blinkTimeout !== undefined) window.clearTimeout(blinkTimeout);
      if (nextTimeout !== undefined) window.clearTimeout(nextTimeout);
    };
  }, [reduce, index, variant.cycle.length, variant.expression]);

  const expression: GhostExpression = blinking
    ? "blink"
    : variant.cycle[exprIdx];

  return (
    <button
      type="button"
      onClick={onChoose}
      aria-pressed={active}
      aria-label={`Choose ${variant.name} ghost as your scroll companion`}
      className={`glass group relative flex flex-col items-center gap-2 rounded-2xl px-3 py-5 outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 ${
        active
          ? "shadow-[0_18px_40px_-18px_rgba(61,90,254,0.5)] ring-2 ring-[var(--brand)]"
          : ""
      }`}
    >
      {active && (
        <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-white">
          <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
          you
        </span>
      )}
      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{
          // Slower body bob — 3.8–4.7 s — so the float reads as breathing
          // rather than bobbing. Eases also softened for less of a sine
          // and more of a held hover at the apex.
          duration: 3.8 + index * 0.2,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1] as const,
          delay: index * 0.18,
        }}
        whileHover={reduce ? undefined : { scale: 1.08, rotate: -3 }}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        // Extra top padding gives hat-style accessories room to
        // sit above the body without clipping against the tile.
        className="grid h-20 w-16 place-items-end pt-2"
      >
        <GhostSVG
          variant={variant}
          flying={false}
          size={56}
          expressionOverride={expression}
          floatAccessory
          // Stagger the accessory hover so the six hats don't bob in
          // lockstep — each is offset by a fraction of the cycle.
          accessoryFloatDelay={-(index * 0.32)}
        />
      </motion.div>
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-black/65">
        {variant.name}
      </span>
      <span className="-mt-1 font-mono text-[9px] lowercase tracking-[0.14em] text-black/40">
        {variant.vibe}
      </span>
    </button>
  );
}
