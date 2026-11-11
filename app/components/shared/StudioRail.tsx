"use client";

import { useRef } from "react";
import { useIndiaClock, usePointerReadout } from "./useIndiaClock";

/**
 * Bottom instrument rail: logotype, studio line, live India time on
 * the left; language and pointer coordinates on the right. Inherits
 * `color` from its parent so it works on black and on paper.
 */
export function StudioRail({ className = "" }: { className?: string }) {
  const time = useIndiaClock();
  const coordRef = useRef<HTMLSpanElement>(null);
  usePointerReadout(coordRef);

  return (
    <div
      className={`times flex h-12 items-center justify-between gap-4 px-4 text-[13px] sm:px-[9.3%] sm:text-[14px] ${className}`}
    >
      <p className="flex min-w-0 items-center gap-2 whitespace-nowrap">
        <span className="inline-block h-3.5 w-[2px] bg-current" />
        <span className="text-[15px] font-black uppercase tracking-[-0.02em] [font-family:Helvetica,Arial,sans-serif]">
          Hemang Wason
        </span>
        <span className="hidden md:inline">Hemang Wason Studio, India</span>
        <span className="hidden h-4 w-px bg-current opacity-50 md:inline-block" />
        <span className="hidden sm:inline" suppressHydrationWarning>
          India Time, {time} (GMT+5:30)
        </span>
      </p>
      <p className="flex items-center gap-2 whitespace-nowrap">
        <span>en</span>
        <span className="h-4 w-px bg-current opacity-50" />
        <span ref={coordRef} className="tabular-nums">
          x0 y0
        </span>
      </p>
    </div>
  );
}
