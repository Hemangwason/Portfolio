"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";

/**
 * Fixed HUD chrome — a thin instrument bar top and bottom, in the
 * spirit of a design console: wordmark, index count and availability
 * up top; live IST clock, employer line and a cursor-coordinate
 * readout below. Pure cosmetics, near-zero cost: one 1s interval for
 * the clock, one rAF-throttled pointermove for the x/y readout.
 */
export function SystemChrome() {
  return (
    <>
      <header
        className="hud-bar fixed inset-x-0 top-0 z-[80] border-b border-[var(--line)]"
        style={{ height: "var(--bar-top)" }}
      >
        <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#top" className="flex items-baseline gap-2 text-[var(--foreground)]">
            <span className="text-[13px] font-extrabold uppercase tracking-[-0.02em]">
              Hemang Wason
            </span>
            <span className="hud-label hidden text-[var(--ink-faint)] sm:inline">
              product × visual
            </span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-5 md:flex">
            {[
              ["profile", "01 profile"],
              ["index", "02 index"],
              ["signals", "03 signals"],
              ["live", "04 live"],
              ["contact", "05 contact"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="hud-label text-[var(--ink-soft)] transition-colors hover:text-[var(--amber)]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hud-label hidden text-[var(--ink-faint)] sm:inline">
              [ {String(projects.length).padStart(2, "0")} works ]
            </span>
            <span className="hud-label inline-flex items-center gap-1.5 text-[var(--amber-ink)]">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
              open for work
            </span>
          </div>
        </div>
      </header>

      <BottomBar />
    </>
  );
}

function BottomBar() {
  const [clock, setClock] = useState("--:--:--");
  const coordRef = useRef<HTMLSpanElement>(null);

  // Live IST clock. One tick per second; formatted via Intl so it is
  // correct regardless of the visitor's own timezone.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Cursor x/y readout, throttled to animation frames and written
  // directly to the DOM node so React never re-renders for it.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = Math.round(e.clientX);
      y = Math.round(e.clientY);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (coordRef.current) {
            coordRef.current.textContent = `x${String(x).padStart(4, "0")} y${String(y).padStart(4, "0")}`;
          }
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer
      className="hud-bar fixed inset-x-0 bottom-0 z-[80] border-t border-[var(--line)]"
      style={{ height: "var(--bar-bottom)" }}
    >
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <p className="hud-label flex items-center gap-2 text-[var(--ink-soft)]">
          <span className="text-[var(--ink-base)]" suppressHydrationWarning>
            IST {clock}
          </span>
          <span className="hidden text-[var(--ink-mute)] sm:inline">(GMT+5:30)</span>
        </p>

        <p className="hud-label hidden text-[var(--ink-faint)] md:block">
          ex-Zomato · currently Zepto
        </p>

        <p className="hud-label flex items-center gap-3 text-[var(--ink-faint)]">
          <span ref={coordRef} className="hidden tabular-nums lg:inline">
            x0000 y0000
          </span>
          <span className="text-[var(--ink-soft)]">v3.0</span>
        </p>
      </div>
    </footer>
  );
}
