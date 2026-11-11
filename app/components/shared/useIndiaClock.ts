"use client";

import { useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live IST wall clock, ticking once per second. */
export function useIndiaClock(): string {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setTime(FORMAT.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/**
 * Writes the live pointer position as "x### y###" into the given
 * element. rAF-throttled and DOM-direct so React never re-renders.
 */
export function usePointerReadout(ref: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = Math.round(e.clientX);
      y = Math.round(e.clientY);
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (ref.current) ref.current.textContent = `x${x} y${y}`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}
