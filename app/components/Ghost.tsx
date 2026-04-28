"use client";

import { useEffect, useRef, useState } from "react";
import { useGhost } from "./GhostContext";
import {
  DEFAULT_VARIANT,
  type GhostExpression,
  type GhostVariant,
} from "./GhostVariants";

// Pure-delight floating ghost — adapted from the Crater browser-extension
// "Boo" ghost. Sits docked at bottom-left; click to launch and it'll trail
// the cursor with a soft spring lag and a gentle floating bob. Click again
// to dock at the current spot; double-click to send it home to the corner.

const GHOST_W = 64;
const GHOST_H = 72;
const DOCK_OFFSET = { x: 22, y: 22 };

export function Ghost() {
  const { variant } = useGhost();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flying, setFlying] = useState(false);
  // Two-phase ambient coaching:
  //   intro  — a one-liner from the ghost ("hi, i'm hem…")
  //   hint   — a smaller delight nudge after the intro has been read
  const [intro, setIntro] = useState(true);
  const [hint, setHint] = useState(false);

  // All animation state lives in refs so the rAF loop never re-renders.
  const flyingRef = useRef(false);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const bobRef = useRef(Math.random() * Math.PI * 2);
  const tiltRef = useRef(0);
  const idleBobRef = useRef(0);

  // Single mount-only effect: dock the ghost, attach listeners, start the
  // perpetual rAF loop. Cleanup only on unmount, not on state change.
  useEffect(() => {
    const dock = () => ({
      x: DOCK_OFFSET.x,
      y: window.innerHeight - GHOST_H - DOCK_OFFSET.y,
    });

    const initial = dock();
    posRef.current = { ...initial };
    targetRef.current = { ...initial };

    const paint = (x: number, y: number, tilt: number) => {
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
      if (buttonRef.current) {
        buttonRef.current.style.transform = `rotate(${tilt.toFixed(2)}deg)`;
      }
    };

    paint(initial.x, initial.y, 0);

    const onMove = (e: PointerEvent) => {
      if (!flyingRef.current) return;
      targetRef.current = {
        x: e.clientX - GHOST_W / 2 + 4,
        y: e.clientY + 24,
      };
    };

    const onResize = () => {
      if (flyingRef.current) return;
      const d = dock();
      posRef.current = { ...d };
      targetRef.current = { ...d };
      paint(d.x, d.y, 0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const tick = () => {
      const pos = posRef.current;
      const vel = velRef.current;

      if (flyingRef.current) {
        // Gentle spring-lag chase — trails behind the cursor with a soft,
        // unhurried catch-up so it reads as floating, not snapping.
        const dx = targetRef.current.x - pos.x;
        const dy = targetRef.current.y - pos.y;
        const dist = Math.hypot(dx, dy);

        let k: number, d: number;
        if (dist > 240) {
          k = 0.09;
          d = 0.75;
        } else if (dist > 90) {
          k = 0.06;
          d = 0.77;
        } else {
          k = 0.04;
          d = 0.80;
        }
        vel.x = (vel.x + dx * k) * d;
        vel.y = (vel.y + dy * k) * d;
        pos.x += vel.x;
        pos.y += vel.y;

        // Always-on floating bob — fades out at high speed so it never
        // fights with the chase.
        bobRef.current += 0.04;
        const bobScale = dist > 240 ? 0.18 : dist > 90 ? 0.4 : 0.85;
        const bobX = Math.sin(bobRef.current * 0.9) * 3 * bobScale;
        const bobY = Math.sin(bobRef.current * 1.3 + 0.6) * 4.5 * bobScale;

        // Tilt — softer, follows velocity with more smoothing.
        const rawTilt = Math.max(-14, Math.min(14, vel.x * 1.6));
        tiltRef.current = tiltRef.current * 0.82 + rawTilt * 0.18;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const px = Math.max(-4, Math.min(vw - GHOST_W + 4, pos.x + bobX));
        const py = Math.max(-4, Math.min(vh - GHOST_H + 4, pos.y + bobY));
        paint(px, py, tiltRef.current);
      } else {
        // Idle bob — gentle vertical float at the dock.
        idleBobRef.current += 0.025;
        const ib = Math.sin(idleBobRef.current) * 4;
        // Smoothly decay tilt to zero when docked.
        tiltRef.current = tiltRef.current * 0.85;
        paint(pos.x, pos.y + ib, tiltRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mirror state into the ref so the rAF loop sees it.
  useEffect(() => {
    flyingRef.current = flying;
  }, [flying]);

  // Phase 1: intro bubble reads for ~10s, then collapses into the smaller
  // "take me along" hint for another 8s. Both dismissed early on click.
  useEffect(() => {
    if (!intro) return;
    const id = window.setTimeout(() => {
      setIntro(false);
      setHint(true);
    }, 10000);
    return () => window.clearTimeout(id);
  }, [intro]);

  useEffect(() => {
    if (!hint) return;
    const id = window.setTimeout(() => setHint(false), 8000);
    return () => window.clearTimeout(id);
  }, [hint]);

  const onClick = () => {
    setIntro(false);
    setHint(false);
    if (flying) {
      // Dock at current position, but clamp inside the viewport with a
      // comfortable margin so the ghost never ends up clipped under a
      // screen edge, a floating dev badge, or behind another UI element.
      const MARGIN = 12;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      posRef.current = {
        x: Math.max(MARGIN, Math.min(vw - GHOST_W - MARGIN, posRef.current.x)),
        y: Math.max(MARGIN, Math.min(vh - GHOST_H - MARGIN, posRef.current.y)),
      };
      velRef.current = { x: 0, y: 0 };
      setFlying(false);
      return;
    }
    setFlying(true);
  };

  const onDoubleClick = () => {
    // Send back to dock with a 600ms ease-out lerp.
    setFlying(false);
    velRef.current = { x: 0, y: 0 };
    const start = { ...posRef.current };
    const end = {
      x: DOCK_OFFSET.x,
      y: window.innerHeight - GHOST_H - DOCK_OFFSET.y,
    };
    const t0 = performance.now();
    const dur = 600;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = ease(t);
      posRef.current = {
        x: start.x + (end.x - start.x) * e,
        y: start.y + (end.y - start.y) * e,
      };
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: GHOST_W,
        height: GHOST_H,
        zIndex: 60,
        willChange: "transform",
        cursor: flying ? "grabbing" : "grab",
      }}
    >
      {intro && !flying && (
        <div
          className="pointer-events-none absolute -top-[78px] left-6 z-10 w-[220px]"
          style={{ animation: "ghostHint 0.6s 0.3s both" }}
        >
          <div className="relative rounded-2xl bg-white px-3 py-2 text-[11px] leading-snug text-black/80 shadow-[0_14px_32px_-12px_rgba(30,41,59,0.25)] ring-1 ring-black/5 ghost-hint-bob">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40">
              boo · a note
            </p>
            <p className="mt-1">
              hi — i&apos;m{" "}
              <span className="font-semibold text-black">hem</span>,
              hemang&apos;s ghost. left here to make sure you get him on
              the team <span aria-hidden>✦</span>
            </p>
            <span
              aria-hidden
              className="absolute bottom-0 left-5 h-2 w-2 translate-y-1/2 rotate-45 bg-white ring-1 ring-black/5"
            />
          </div>
        </div>
      )}

      {hint && !flying && (
        <div
          className="pointer-events-none absolute -top-8 left-7 z-10"
          style={{ animation: "ghostHint 0.6s 0.1s both" }}
        >
          <div
            className="relative whitespace-nowrap rounded-full px-2 py-[3px] font-mono text-[9px] font-medium lowercase tracking-[0.08em] text-white/95 shadow-[0_4px_10px_-4px_rgba(0,87,255,0.4)] ghost-hint-bob"
            style={{ backgroundColor: variant.hint }}
          >
            take me along ✦
            <span
              aria-hidden
              className="absolute bottom-0 left-2.5 h-[5px] w-[5px] translate-y-1/2 rotate-45"
              style={{ backgroundColor: variant.hint }}
            />
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        aria-label={flying ? "Dock the ghost" : "Wake the ghost"}
        title={
          flying
            ? "Click to dock · double-click to send home"
            : "Click me!"
        }
        className="ghost-btn relative grid h-full w-full place-items-center rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
      >
        <GhostSVG variant={variant} flying={flying} />
      </button>

      <style jsx>{`
        @keyframes ghostHint {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes ghostHintBob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .ghost-hint-bob {
          animation: ghostHintBob 2.4s ease-in-out 1s infinite;
        }
        .ghost-btn {
          transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ghost-btn:hover {
          transform: scale(1.06) !important;
        }
        .ghost-btn:active {
          transform: scale(0.92) !important;
        }
      `}</style>
    </div>
  );
}

// Exported so the GhostPicker can render the same body in different colors
// without duplicating the SVG geometry. Gradient ids are scoped per variant
// so multiple ghosts can share a page without their <defs> colliding.
//
// `expressionOverride` lets the picker rotate through a variant's cycle
// (smile → wink → blink → ...) without us having to mutate the variant.
// `floatAccessory` adds a CSS bob to the hat/crown/headphones group so
// the accessory drifts above the body like it's barely tethered.
export function GhostSVG({
  variant = DEFAULT_VARIANT,
  flying,
  size = GHOST_W,
  expressionOverride,
  floatAccessory = false,
  accessoryFloatDelay = 0,
}: {
  variant?: GhostVariant;
  flying: boolean;
  size?: number;
  expressionOverride?: GhostExpression;
  floatAccessory?: boolean;
  accessoryFloatDelay?: number;
}) {
  const height = (size / GHOST_W) * GHOST_H;
  const bodyId = `ghost-body-${variant.id}`;
  const cheekId = `ghost-cheek-${variant.id}`;
  const mouthStroke = variant.eye;
  const expression = expressionOverride ?? variant.expression;

  return (
    <svg
      // overflow="visible" lets accessories (hats, etc.) render above the
      // viewBox without clipping. Keeps the SVG element the same size as
      // before so the docked ghost's button bounds don't have to change.
      viewBox="0 0 68 76"
      width={size}
      height={height}
      overflow="visible"
      aria-hidden
      style={{
        filter: flying
          ? "drop-shadow(0 12px 18px rgba(30,41,59,0.18))"
          : "drop-shadow(0 8px 14px rgba(30,41,59,0.16))",
        transition: "filter 250ms ease",
      }}
    >
      <defs>
        <radialGradient id={bodyId} cx="38%" cy="26%" r="85%">
          <stop offset="0%" stopColor={variant.body[0]} />
          <stop offset="55%" stopColor={variant.body[1]} />
          <stop offset="100%" stopColor={variant.body[2]} />
        </radialGradient>
        <radialGradient id={cheekId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={variant.cheek[0]} />
          <stop offset="55%" stopColor={variant.cheek[1]} />
          <stop offset="100%" stopColor={variant.cheek[2]} />
        </radialGradient>
      </defs>

      <ellipse
        cx="34"
        cy="70"
        rx="20"
        ry="2.5"
        fill="rgba(30,41,59,0.18)"
        opacity={flying ? 0 : 1}
        style={{ transition: "opacity 250ms ease" }}
      />

      <path
        d="M34 4
           C 14 4, 6 18, 6 34
           L 6 54
           C 6 60, 9 64, 14 64
           C 18 64, 20 60, 22 57
           C 24 54, 27 54, 28 57
           C 29 61, 31 64, 34 64
           C 37 64, 39 61, 40 57
           C 41 54, 44 54, 46 57
           C 48 60, 50 64, 54 64
           C 59 64, 62 60, 62 54
           L 62 34
           C 62 18, 54 4, 34 4 Z"
        fill={`url(#${bodyId})`}
        stroke="rgba(30,41,59,0.12)"
        strokeWidth="0.9"
      />

      <ellipse cx="15" cy="40" rx="7" ry="4.5" fill={`url(#${cheekId})`} />
      <ellipse cx="53" cy="40" rx="7" ry="4.5" fill={`url(#${cheekId})`} />

      <Face variant={variant} flying={flying} expression={expression} />

      {floatAccessory ? (
        <g
          className="ghost-accessory-float"
          style={{ animationDelay: `${accessoryFloatDelay}s` }}
        >
          <Accessory variant={variant} />
        </g>
      ) : (
        <Accessory variant={variant} />
      )}
    </svg>
  );
}

// Pulls the eye and mouth pair together so each variant gets a coherent
// expression (smile + bowtie reads gentleman; hearts + flower crown reads
// florist). The flying state always overrides to a wide-eye / open-mouth
// "yay i'm out" face — so picking up the ghost still feels like waking it.
function Face({
  variant,
  flying,
  expression,
}: {
  variant: GhostVariant;
  flying: boolean;
  expression: GhostExpression;
}) {
  if (flying) {
    return (
      <g>
        <ellipse cx="24" cy="32" rx="3.6" ry="4.6" fill={variant.eye} />
        <ellipse cx="44" cy="32" rx="3.6" ry="4.6" fill={variant.eye} />
        <ellipse cx="25" cy="30" rx="1.2" ry="1.4" fill={variant.eyeHighlight} />
        <ellipse cx="45" cy="30" rx="1.2" ry="1.4" fill={variant.eyeHighlight} />
        <path
          d="M29 43 Q 34 48, 39 43"
          stroke={variant.eye}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  }

  switch (expression) {
    case "smile":
      return (
        <g>
          {/* Closed crescent eyes — like ^ ^ — content and a little smug */}
          <path
            d="M 20 33 Q 24 28, 28 33"
            stroke={variant.eye}
            strokeWidth="1.9"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 40 33 Q 44 28, 48 33"
            stroke={variant.eye}
            strokeWidth="1.9"
            fill="none"
            strokeLinecap="round"
          />
          {/* Tiny upward smile */}
          <path
            d="M 31 44 Q 34 47.5, 37 44"
            stroke={variant.eye}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case "hearts":
      return (
        <g>
          {/* Heart-shaped eyes — two stacked circles + downward triangle */}
          <Heart cx={24} cy={32} fill={variant.eye} />
          <Heart cx={44} cy={32} fill={variant.eye} />
          {/* Tiny dot mouth — smitten, speechless */}
          <ellipse cx="34" cy="44" rx="1.5" ry="1.7" fill={variant.eye} />
        </g>
      );
    case "smirk":
      return (
        <g>
          {/* Half-closed chill eyes — flat top, rounded bottom */}
          <path
            d="M 20 31 L 28 31 Q 28 35, 24 35 Q 20 35, 20 31 Z"
            fill={variant.eye}
          />
          <path
            d="M 40 31 L 48 31 Q 48 35, 44 35 Q 40 35, 40 31 Z"
            fill={variant.eye}
          />
          <ellipse cx="25" cy="32.5" rx="1" ry="1.1" fill={variant.eyeHighlight} />
          <ellipse cx="45" cy="32.5" rx="1" ry="1.1" fill={variant.eyeHighlight} />
          {/* Asymmetric smirk — left side raised */}
          <path
            d="M 30 45 Q 34 42, 38 45"
            stroke={variant.eye}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case "wide":
      return (
        <g>
          {/* Big curious eyes */}
          <ellipse cx="24" cy="32" rx="4" ry="5" fill={variant.eye} />
          <ellipse cx="44" cy="32" rx="4" ry="5" fill={variant.eye} />
          <ellipse cx="25.4" cy="30.4" rx="1.4" ry="1.7" fill={variant.eyeHighlight} />
          <ellipse cx="45.4" cy="30.4" rx="1.4" ry="1.7" fill={variant.eyeHighlight} />
          <ellipse cx="34" cy="44.2" rx="2" ry="2.5" fill={variant.eye} />
        </g>
      );
    case "cool":
      // Eyes are entirely covered by the headphones-shades accessory; the
      // mouth alone has to carry the cool. A slight downturned line reads
      // unbothered, not sad, because of the strong silhouette around it.
      return (
        <g>
          <path
            d="M 30 45 L 38 45"
            stroke={variant.eye}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </g>
      );
    case "sing":
      // Cool's mid-song twin: same hidden eyes, but a small open "o" mouth
      // so noir feels like he's humming along to whatever's in the cans.
      return (
        <g>
          <ellipse
            cx="34"
            cy="45"
            rx="1.8"
            ry="2.4"
            fill={variant.eye}
          />
        </g>
      );
    case "blink":
      // Both eyes briefly closed — picker drops this in for ~140ms between
      // expression swaps. The mouth stays as a small "o" so the face still
      // reads as a face, not a featureless blob, mid-blink.
      return (
        <g>
          <path
            d="M 20 32 L 28 32"
            stroke={variant.eye}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M 40 32 L 48 32"
            stroke={variant.eye}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <ellipse cx="34" cy="44" rx="1.8" ry="2.2" fill={variant.eye} />
        </g>
      );
    case "wink":
      // Right eye open + round, left eye a closed crescent, tiny upturned
      // smile. Reads cheeky regardless of the variant's base expression.
      return (
        <g>
          <path
            d="M 20 32 Q 24 28, 28 32"
            stroke={variant.eye}
            strokeWidth="1.9"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="44" cy="32" rx="3.4" ry="4.4" fill={variant.eye} />
          <ellipse cx="45" cy="30" rx="1.2" ry="1.4" fill={variant.eyeHighlight} />
          <path
            d="M 30 44 Q 34 47, 38 44"
            stroke={variant.eye}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case "neutral":
    default:
      return (
        <g>
          <ellipse cx="24" cy="32" rx="3.2" ry="4.2" fill={variant.eye} />
          <ellipse cx="44" cy="32" rx="3.2" ry="4.2" fill={variant.eye} />
          <ellipse cx="25" cy="30" rx="1.2" ry="1.4" fill={variant.eyeHighlight} />
          <ellipse cx="45" cy="30" rx="1.2" ry="1.4" fill={variant.eyeHighlight} />
          <ellipse cx="34" cy="44" rx="2.3" ry="2.9" fill={variant.eye} />
        </g>
      );
  }
}

// Two stacked circles + a downward triangle = a tiny heart. Used for
// the florist ghost's smitten eyes.
function Heart({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle cx="-1.6" cy="-1" r="2.2" fill={fill} />
      <circle cx="1.6" cy="-1" r="2.2" fill={fill} />
      <path d="M -3.6 0.2 L 3.6 0.2 L 0 4.2 Z" fill={fill} />
    </g>
  );
}

// Renders the personality accessory on top of the body. Positions are
// expressed in the original 0-68 by 0-76 viewBox; hats and crowns sit
// above y=0 and rely on overflow="visible" on the parent SVG so they
// aren't clipped.
function Accessory({ variant }: { variant: GhostVariant }) {
  switch (variant.accessory) {
    case "tophat-bowtie":
      return (
        <g>
          {/* Top hat — wide brim + tall crown + gold band */}
          <ellipse cx="34" cy="2" rx="20" ry="2.6" fill="#0B0F1A" />
          <ellipse cx="34" cy="1.5" rx="20" ry="1.6" fill="#1E2538" />
          <rect x="23" y="-14" width="22" height="16" rx="1" fill="#0B0F1A" />
          <rect x="23" y="-14" width="22" height="16" rx="1" fill="url(#tophatGloss)" opacity="0.35" />
          <rect x="23" y="-3" width="22" height="2.4" fill="#7C2D12" />
          <rect x="23" y="-2.4" width="22" height="0.8" fill="#FBBF24" />
          <circle cx="33" cy="-2" r="0.9" fill="#FCD34D" />
          {/* Bow tie — puffy ellipse wings + center knot */}
          <ellipse cx="26" cy="60" rx="5.4" ry="3.4" fill="#0B0F1A" />
          <ellipse cx="42" cy="60" rx="5.4" ry="3.4" fill="#0B0F1A" />
          <ellipse cx="26" cy="59.5" rx="3.6" ry="2.2" fill="#1E2538" />
          <ellipse cx="42" cy="59.5" rx="3.6" ry="2.2" fill="#1E2538" />
          <rect x="31.5" y="56.8" width="5" height="6.4" rx="1" fill="#0B0F1A" />
          <line
            x1="33"
            y1="58"
            x2="33"
            y2="62"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.4"
          />
          <defs>
            <linearGradient id="tophatGloss" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </g>
      );
    case "flower-crown":
      return (
        <g>
          {/* Five flowers across the crown + a tiny butterfly hovering
             above. Flowers vary in size so the crown reads woven. */}
          <Leaf cx={11} cy={11} angle={-30} />
          <Leaf cx={57} cy={11} angle={30} />
          <Leaf cx={22} cy={5} angle={-12} />
          <Leaf cx={46} cy={5} angle={12} />
          <Flower cx={10} cy={10} r={2.3} petal="#F472B6" core="#FBBF24" />
          <Flower cx={22} cy={3} r={2.6} petal="#FB7185" core="#FCD34D" />
          <Flower cx={34} cy={-2} r={3} petal="#A855F7" core="#FDE68A" />
          <Flower cx={46} cy={3} r={2.6} petal="#EC4899" core="#FCD34D" />
          <Flower cx={58} cy={10} r={2.3} petal="#C084FC" core="#FBBF24" />
          {/* Butterfly — two dotted wings + body */}
          <g transform="translate(56 -10) rotate(-8)">
            <ellipse cx="-2.2" cy="0" rx="2" ry="2.6" fill="#A855F7" />
            <ellipse cx="2.2" cy="0" rx="2" ry="2.6" fill="#A855F7" />
            <ellipse cx="-2.2" cy="-0.3" rx="0.7" ry="1" fill="#FBBF24" />
            <ellipse cx="2.2" cy="-0.3" rx="0.7" ry="1" fill="#FBBF24" />
            <line
              x1="0"
              y1="-2"
              x2="0"
              y2="2"
              stroke="#1E1B4B"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
          </g>
        </g>
      );
    case "beanie":
      return (
        <g>
          {/* Tall folded beanie with a thick rolled cuff at the bottom.
             The body of the hat is one color, the cuff is a half-shade
             lighter so the fold reads. Big white pom-pom on top. */}
          <path
            d="M 7 13 Q 7 -8, 34 -8 Q 61 -8, 61 13 Q 61 17, 56 17 Q 48 16, 34 17 Q 20 16, 12 17 Q 7 17, 7 13 Z"
            fill="#066B3D"
          />
          {/* Two vertical knit stripes */}
          <rect x="20" y="-6" width="1.2" height="20" fill="#055730" opacity="0.6" />
          <rect x="46.8" y="-6" width="1.2" height="20" fill="#055730" opacity="0.6" />
          {/* Rolled cuff */}
          <rect x="6" y="13" width="56" height="6" rx="3" fill="#13A368" />
          <line
            x1="8"
            y1="16"
            x2="60"
            y2="16"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.5"
          />
          {/* Pom-pom on top */}
          <circle cx="34" cy="-12" r="4" fill="#FCFCFC" />
          <circle cx="33" cy="-13" r="1.6" fill="#FFFFFF" />
          <circle cx="35" cy="-11" r="1" fill="#E5E7EB" opacity="0.7" />
        </g>
      );
    case "cowboy":
      return (
        <g>
          {/* Wide brim with subtle upturn, taller crown with a crease,
             leather band with a gold star. */}
          <ellipse cx="34" cy="14" rx="30" ry="3.6" fill="#5A2B11" />
          <ellipse cx="34" cy="13.2" rx="30" ry="2.4" fill="#8B4520" />
          {/* Brim upturn at sides */}
          <path
            d="M 4 13 Q 4 10, 8 10"
            stroke="#5A2B11"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M 64 13 Q 64 10, 60 10"
            stroke="#5A2B11"
            strokeWidth="1.6"
            fill="none"
          />
          {/* Crown */}
          <path
            d="M 20 14 Q 20 -4, 34 -5 Q 48 -4, 48 14 Z"
            fill="#5A2B11"
          />
          <path
            d="M 21 13 Q 21 -3, 34 -4 Q 47 -3, 47 13 Z"
            fill="#8B4520"
          />
          {/* Crease down the front */}
          <path
            d="M 34 -4 L 34 12"
            stroke="#5A2B11"
            strokeWidth="0.8"
            opacity="0.7"
          />
          {/* Band */}
          <rect x="20.5" y="8.5" width="27" height="2.6" fill="#1F1208" />
          {/* Star buckle */}
          <path
            d="M 34 7.4 L 34.7 9.2 L 36.6 9.2 L 35 10.4 L 35.6 12.2 L 34 11.1 L 32.4 12.2 L 33 10.4 L 31.4 9.2 L 33.3 9.2 Z"
            fill="#FCD34D"
            stroke="#92400E"
            strokeWidth="0.3"
          />
        </g>
      );
    case "round-glasses":
      return (
        <g>
          {/* Big tortoise-shell rounds with a thicker brow line so they
             read as proper specs at small sizes too. */}
          <circle
            cx="22"
            cy="32"
            r="9"
            fill="rgba(255,255,255,0.22)"
            stroke="#3F2517"
            strokeWidth="2"
          />
          <circle
            cx="46"
            cy="32"
            r="9"
            fill="rgba(255,255,255,0.22)"
            stroke="#3F2517"
            strokeWidth="2"
          />
          {/* Bridge */}
          <path
            d="M 30 30 Q 34 28, 38 30"
            stroke="#3F2517"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Brow accent over each lens (the iconic top-frame highlight) */}
          <path
            d="M 14 28 Q 22 23, 30 28"
            stroke="#241409"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 38 28 Q 46 23, 54 28"
            stroke="#241409"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Tortoise spots inside the frames */}
          <circle cx="17" cy="34" r="0.7" fill="#241409" opacity="0.7" />
          <circle cx="27" cy="36" r="0.5" fill="#241409" opacity="0.6" />
          <circle cx="42" cy="36" r="0.5" fill="#241409" opacity="0.6" />
          <circle cx="51" cy="34" r="0.7" fill="#241409" opacity="0.7" />
          {/* Temple stubs poking out */}
          <line
            x1="13"
            y1="32"
            x2="9"
            y2="33"
            stroke="#3F2517"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="55"
            y1="32"
            x2="59"
            y2="33"
            stroke="#3F2517"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      );
    case "headphones-shades":
      return (
        <g>
          {/* Headband arching over the head */}
          <path
            d="M 6 24 Q 6 -2, 34 -2 Q 62 -2, 62 24"
            stroke="#1E2538"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 6 24 Q 6 0, 34 0"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Earcups — left and right ovals over the cheeks */}
          <ellipse cx="6" cy="32" rx="4.4" ry="6" fill="#1E2538" />
          <ellipse cx="6" cy="32" rx="2.6" ry="3.8" fill="#0B0F1A" />
          <circle cx="6" cy="32" r="0.9" fill="#EC4899" />
          <ellipse cx="62" cy="32" rx="4.4" ry="6" fill="#1E2538" />
          <ellipse cx="62" cy="32" rx="2.6" ry="3.8" fill="#0B0F1A" />
          <circle cx="62" cy="32" r="0.9" fill="#EC4899" />
          {/* Aviator-style shades — bigger, slight teardrop */}
          <path
            d="M 13 28 L 31 28 Q 32 33, 27 36.5 L 18 36.5 Q 12 33, 13 28 Z"
            fill="#0B0F1A"
            stroke="#1E2538"
            strokeWidth="0.8"
          />
          <path
            d="M 37 28 L 55 28 Q 56 33, 50 36.5 L 41 36.5 Q 36 33, 37 28 Z"
            fill="#0B0F1A"
            stroke="#1E2538"
            strokeWidth="0.8"
          />
          <rect x="31" y="29" width="6" height="2" fill="#0B0F1A" />
          {/* Lens highlights — gives them a glass shine */}
          <path
            d="M 16 30 L 21 30 L 18 34 Z"
            fill="rgba(255,255,255,0.45)"
          />
          <path
            d="M 40 30 L 45 30 L 42 34 Z"
            fill="rgba(255,255,255,0.45)"
          />
        </g>
      );
    default:
      return null;
  }
}

// A leaf shape used behind flower-crown blooms — a tiny pointed oval
// rotated by `angle` degrees around its own anchor.
function Leaf({ cx, cy, angle }: { cx: number; cy: number; angle: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx="2.4"
      ry="1.1"
      fill="#16A34A"
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  );
}

function Flower({
  cx,
  cy,
  r,
  petal,
  core,
}: {
  cx: number;
  cy: number;
  r: number;
  petal: string;
  core: string;
}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle cx="0" cy={-r} r={r} fill={petal} />
      <circle cx={-r} cy="0" r={r} fill={petal} />
      <circle cx={r} cy="0" r={r} fill={petal} />
      <circle cx="0" cy={r} r={r} fill={petal} />
      <circle cx="0" cy="0" r={r * 0.55} fill={core} />
    </g>
  );
}
