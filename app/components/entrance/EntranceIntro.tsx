"use client";

import { useEffect, useRef } from "react";
import { BIRD_ORIGIN, BIRD_PATH } from "../shared/BirdMark";
import { EntranceChrome } from "./EntranceChrome";

/** Posters that grow out of the white once the bird has flooded it. */
const TUNNEL_POSTERS = [
  { src: "/projects/street-football-poster.jpg?v=2", alt: "Street Football" },
  { src: "/projects/sidetake-poster.jpg", alt: "Sidetake" },
  { src: "/projects/zepto-turns-5-poster.jpg?v=2", alt: "Zepto Turns 5" },
] as const;

const BIRD_PHASE_END = 0.5;
const BIRD_MAX_ZOOM = 150;
/** Shortest distance (bird units) from the zoom origin to the outline. */
const BIRD_BODY_RADIUS = 9;
const BIRD_SPAN_UNITS = 96;

/* [start, length] in entrance progress — the last one must finish
   before the stage unpins at 1. */
const POSTER_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [0.5, 0.2],
  [0.62, 0.2],
  [0.74, 0.2],
];
const POSTER_MIN_SCALE = 0.05;
const POSTER_MAX_SCALE = 2.2;

const PAPER = "#f2f0ea";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function EntranceIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<SVGGElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const posterRefs = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    let raf = 0;

    const apply = () => {
      raf = 0;
      const section = sectionRef.current;
      const stage = stageRef.current;
      const bird = birdRef.current;
      if (!section || !stage || !bird) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const travel = section.offsetHeight - vh;
      const p = clamp01(-section.getBoundingClientRect().top / Math.max(1, travel));

      // Phase 1 — the bird zooms exponentially about its body.
      const birdPx = Math.min(Math.max(vw * 0.078, 84), 140);
      const base = birdPx / BIRD_SPAN_UNITS;
      const t = clamp01(p / BIRD_PHASE_END);
      const scale = base * Math.exp(t * Math.log(BIRD_MAX_ZOOM));
      const halfDiagonal = Math.hypot(vw, vh) / 2;
      const flooded = scale * BIRD_BODY_RADIUS > halfDiagonal;

      bird.setAttribute(
        "transform",
        `translate(${vw / 2} ${vh / 2}) scale(${scale}) translate(${-BIRD_ORIGIN.x} ${-BIRD_ORIGIN.y})`,
      );
      bird.style.visibility = flooded ? "hidden" : "visible";
      stage.style.backgroundColor = flooded ? PAPER : "#000";

      if (labelRef.current) {
        labelRef.current.textContent = p > BIRD_PHASE_END ? "Work" : "Entrance";
      }

      // Phase 2 — posters grow out of the centre, one after another.
      POSTER_WINDOWS.forEach(([start, length], i) => {
        const el = posterRefs.current[i];
        if (!el) return;
        const u = (p - start) / length;
        if (u <= 0 || u >= 1) {
          el.style.opacity = "0";
          return;
        }
        const s = POSTER_MIN_SCALE * Math.exp(u * Math.log(POSTER_MAX_SCALE / POSTER_MIN_SCALE));
        const fadeIn = clamp01(u / 0.06);
        const fadeOut = 1 - clamp01((u - 0.78) / 0.22);
        el.style.opacity = String(fadeIn * fadeOut);
        el.style.transform = `translate(-50%, -50%) scale(${s})`;
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Entrance"
      className="relative h-[460vh] w-full"
    >
      <a
        href="#work"
        className="times sr-only z-[90] bg-white px-3 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to work
      </a>

      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black"
      >
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <g ref={birdRef} fill="#fff">
            <path d={BIRD_PATH} />
          </g>
        </svg>

        {TUNNEL_POSTERS.map((poster, i) => (
          <img
            key={poster.src}
            ref={(el) => {
              posterRefs.current[i] = el;
            }}
            src={poster.src}
            alt=""
            decoding="async"
            className="entrance-poster h-[62vh] w-auto max-w-none opacity-0"
          />
        ))}

        <EntranceChrome labelRef={labelRef} />
      </div>
    </section>
  );
}
