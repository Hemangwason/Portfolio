"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { globeAtlas, showcase, type Project } from "../../data/projects";
import { CaseSheet } from "../case/CaseSheet";
import { GlobeHeader } from "./GlobeHeader";
import { TickerPill } from "./TickerPill";
import type { GlobeHandle } from "./globeScene";

const PAPER = "#f2f0ea";
const INK = "#141414";

type OpenCase = { project: Project; number: number; origin: { x: number; y: number } };

/**
 * The globe: a pinned viewport (header grid + WebGL sphere) whose
 * tilt follows page scroll. Drag spins it; a click on any tile opens
 * that project's case sheet, growing out of the click point.
 */
export function GlobeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<GlobeHandle | null>(null);
  const tiltRef = useRef<HTMLSpanElement>(null);
  const spinRef = useRef<HTMLSpanElement>(null);
  const visibleRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<OpenCase | null>(null);
  const openRef = useRef(false);

  const openCase = useCallback((id: string, x: number, y: number) => {
    const index = showcase.findIndex((p) => p.id === id);
    if (index < 0) return;
    setOpen({ project: showcase[index], number: index + 1, origin: { x, y } });
  }, []);

  // Deep link: /?case=<id> opens straight into a sheet.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("case");
    if (id) openCase(id, window.innerWidth / 2, window.innerHeight / 2);
  }, [openCase]);

  // Keep the URL in step with the open sheet.
  useEffect(() => {
    openRef.current = Boolean(open);
    const url = open ? `${window.location.pathname}?case=${open.project.id}` : window.location.pathname;
    window.history.replaceState(null, "", url);
    handleRef.current?.setActive(visibleRef.current && !open);
  }, [open]);

  // Boot the WebGL scene lazily — three.js only loads on this page.
  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    import("./globeScene")
      .then(({ createGlobe }) => {
        if (disposed) return;
        const handle = createGlobe(
          canvas,
          showcase.map((p) => ({ id: p.id, atlas: globeAtlas(p.id) })),
          {
            background: PAPER,
            lineColor: INK,
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            onSelect: openCase,
            onFrame: (tilt, spin) => {
              if (tiltRef.current) tiltRef.current.textContent = tilt.toFixed(6);
              if (spinRef.current) spinRef.current.textContent = spin.toFixed(6);
            },
          },
        );
        handleRef.current = handle;
        handle.setActive(visibleRef.current && !openRef.current);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [openCase]);

  // Scroll → tilt, and only render while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const travel = section.offsetHeight - window.innerHeight;
      const p = -section.getBoundingClientRect().top / Math.max(1, travel);
      handleRef.current?.setScrollProgress(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      handleRef.current?.setActive(entry.isIntersecting && !openRef.current);
    });
    io.observe(section);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="All work on a globe"
      className="relative h-[420vh] bg-[var(--paper)]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <GlobeHeader />

        <div className="absolute inset-x-0 bottom-0" style={{ top: "var(--header-h)" }}>
          <canvas
            ref={canvasRef}
            className="block h-full w-full cursor-grab touch-pan-y select-none"
            aria-label="Globe of projects. Drag to spin, click a tile to open it."
          />

          <span
            ref={tiltRef}
            aria-hidden
            className="mono-label pointer-events-none absolute left-8 top-12 hidden text-[12px] text-[var(--ink-faint)] md:block"
          >
            0.000000
          </span>
          <span
            ref={spinRef}
            aria-hidden
            className="mono-label pointer-events-none absolute right-8 top-12 hidden text-[12px] text-[var(--ink-faint)] md:block"
          >
            0.000000
          </span>

          {failed && <GlobeFallback onOpen={openCase} />}

          <TickerPill className="absolute bottom-6 left-1/2 -translate-x-1/2" />
        </div>

        {/* accessible index of every tile on the globe */}
        <nav aria-label="Projects" className="sr-only">
          <ul>
            {showcase.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => openCase(p.id, window.innerWidth / 2, window.innerHeight / 2)}
                >
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {open && (
        <CaseSheet
          key={open.project.id}
          project={open.project}
          number={open.number}
          origin={open.origin}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}

/** Flat grid shown only if WebGL can't start. */
function GlobeFallback({ onOpen }: { onOpen: (id: string, x: number, y: number) => void }) {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-[var(--paper)] p-4 sm:p-8">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {showcase.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={(e) => onOpen(p.id, e.clientX, e.clientY)}
              className="block w-full text-left"
            >
              <img src={globeAtlas(p.id)} alt="" loading="lazy" className="aspect-[2/1] w-full object-cover" />
              <span className="mt-1.5 block text-[18px] leading-tight">{p.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
