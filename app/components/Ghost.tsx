"use client";

import { useEffect, useRef, useState } from "react";

// Pure-delight floating ghost — adapted from the Crater browser-extension
// "Boo" ghost. Sits docked at bottom-left; click to launch and it'll trail
// the cursor with a soft spring lag and a gentle floating bob. Click again
// to dock at the current spot; double-click to send it home to the corner.

const GHOST_W = 64;
const GHOST_H = 72;
const DOCK_OFFSET = { x: 22, y: 22 };

export function Ghost() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flying, setFlying] = useState(false);
  const [hint, setHint] = useState(true);

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
        // Spring-lag chase toward cursor target.
        const dx = targetRef.current.x - pos.x;
        const dy = targetRef.current.y - pos.y;
        const dist = Math.hypot(dx, dy);

        let k: number, d: number;
        if (dist > 240) {
          k = 0.08;
          d = 0.82;
        } else if (dist > 90) {
          k = 0.05;
          d = 0.85;
        } else {
          k = 0.022;
          d = 0.88;
        }
        vel.x = (vel.x + dx * k) * d;
        vel.y = (vel.y + dy * k) * d;
        pos.x += vel.x;
        pos.y += vel.y;

        // Always-on floating bob.
        bobRef.current += 0.04;
        const bobScale = dist > 240 ? 0.35 : dist > 90 ? 0.7 : 1;
        const bobX = Math.sin(bobRef.current * 0.9) * 3 * bobScale;
        const bobY = Math.sin(bobRef.current * 1.3 + 0.6) * 4.5 * bobScale;

        const rawTilt = Math.max(-12, Math.min(12, vel.x * 1.6));
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

  // Hide hint after a few seconds.
  useEffect(() => {
    if (!hint) return;
    const id = window.setTimeout(() => setHint(false), 6500);
    return () => window.clearTimeout(id);
  }, [hint]);

  const onClick = () => {
    setHint(false);
    if (flying) {
      // Dock at current position. Reset velocity so it doesn't drift.
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
      {hint && !flying && (
        <span
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 animate-fade-in whitespace-nowrap rounded-full border border-black/8 bg-white/95 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-black/70 shadow-sm backdrop-blur"
          style={{ animation: "ghostHint 0.5s 1.2s both" }}
        >
          click me ✦
        </span>
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
        <GhostSVG flying={flying} />
      </button>

      <style jsx>{`
        @keyframes ghostHint {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
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

function GhostSVG({ flying }: { flying: boolean }) {
  return (
    <svg
      viewBox="0 0 68 76"
      width={GHOST_W}
      height={GHOST_H}
      aria-hidden
      style={{
        filter: flying
          ? "drop-shadow(0 12px 18px rgba(30,41,59,0.18))"
          : "drop-shadow(0 8px 14px rgba(30,41,59,0.16))",
        transition: "filter 250ms ease",
      }}
    >
      <defs>
        <radialGradient id="ghost-body" cx="38%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F9FAFF" />
          <stop offset="100%" stopColor="#D5DDF2" />
        </radialGradient>
        <radialGradient id="ghost-cheek" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FB7185" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#FDA4AF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FECDD3" stopOpacity="0" />
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
        fill="url(#ghost-body)"
        stroke="rgba(30,41,59,0.12)"
        strokeWidth="0.9"
      />

      <ellipse cx="15" cy="40" rx="7" ry="4.5" fill="url(#ghost-cheek)" />
      <ellipse cx="53" cy="40" rx="7" ry="4.5" fill="url(#ghost-cheek)" />

      <ellipse
        cx="24"
        cy="32"
        rx={flying ? 3.6 : 3.2}
        ry={flying ? 4.6 : 4.2}
        fill="#1E293B"
        style={{ transition: "all 200ms ease" }}
      />
      <ellipse
        cx="44"
        cy="32"
        rx={flying ? 3.6 : 3.2}
        ry={flying ? 4.6 : 4.2}
        fill="#1E293B"
        style={{ transition: "all 200ms ease" }}
      />
      <ellipse cx="25" cy="30" rx="1.2" ry="1.4" fill="#FFFFFF" />
      <ellipse cx="45" cy="30" rx="1.2" ry="1.4" fill="#FFFFFF" />

      {flying ? (
        <path
          d="M29 43 Q 34 48, 39 43"
          stroke="#1E293B"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <ellipse cx="34" cy="44" rx="2.3" ry="2.9" fill="#1E293B" />
      )}
    </svg>
  );
}
