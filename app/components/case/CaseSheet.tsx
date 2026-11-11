"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../../data/projects";
import { ProjectProcessOverlay } from "../ProjectProcessOverlay";
import { StudioRail } from "../shared/StudioRail";
import { FlareMedia, type MediaItem } from "./FlareMedia";

type Props = {
  project: Project;
  number: number;
  origin: { x: number; y: number };
  onClose: () => void;
};

const OPEN_MS = 640;
const CLOSE_MS = 420;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const ORIGIN_HALF_W = 90;
const ORIGIN_HALF_H = 62;
const RULER_CELLS = 12;
const RULER_FIRST_CELL = 8;

function mediaFor(project: Project): MediaItem[] {
  const items: MediaItem[] = [];
  const head = project.masthead ?? project.thumbnail;
  if (head?.type === "video") items.push({ type: "video", src: head.src, poster: head.poster });
  if (head?.type === "image") items.push({ type: "image", src: head.src, alt: head.alt ?? project.title });
  project.screens?.forEach((s) => items.push({ type: "image", src: s.src, alt: s.title }));
  return items;
}

function originClip(origin: { x: number; y: number }): string {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const top = Math.max(0, origin.y - ORIGIN_HALF_H);
  const left = Math.max(0, origin.x - ORIGIN_HALF_W);
  const right = Math.max(0, vw - origin.x - ORIGIN_HALF_W);
  const bottom = Math.max(0, vh - origin.y - ORIGIN_HALF_H);
  return `inset(${top}px ${right}px ${bottom}px ${left}px round 4px)`;
}

const FULL_CLIP = "inset(0px 0px 0px 0px round 0px)";

/**
 * Full-screen case sheet that grows out of the clicked tile: a ruled
 * header row, an Info drop-down with the write-up, a numbered media
 * ruler and the flared media stage.
 */
export function CaseSheet({ project, number, origin, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [index, setIndex] = useState(0);
  const media = useMemo(() => mediaFor(project), [project]);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.animate([{ clipPath: originClip(origin) }, { clipPath: FULL_CLIP }], {
      duration: reduced ? 0 : OPEN_MS,
      easing: EASE,
      fill: "forwards",
    });
  }, [origin, reduced]);

  const close = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet || closingRef.current) return;
    closingRef.current = true;
    const anim = sheet.animate([{ clipPath: FULL_CLIP }, { clipPath: originClip(origin) }], {
      duration: reduced ? 0 : CLOSE_MS,
      easing: EASE,
      fill: "forwards",
    });
    anim.onfinish = onClose;
  }, [onClose, origin, reduced]);

  const step = useCallback(
    (dir: number) => setIndex((i) => (i + dir + media.length) % media.length),
    [media.length],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (showBoard) return;
      if (e.key === "Escape") {
        if (infoOpen) setInfoOpen(false);
        else close();
      }
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close, infoOpen, showBoard, step]);

  if (typeof document === "undefined") return null;

  const disciplines = project.tags.join(", ");
  const current = media[index];

  return createPortal(
    <>
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`case-${project.id}`}
        className="case-sheet times fixed inset-0 z-[100] overflow-hidden bg-white text-black"
        style={{ clipPath: originClip(origin) }}
      >
        {/* header row */}
        <header className="relative z-20 grid grid-cols-[1fr_auto] text-[15px] sm:text-[16px] md:grid-cols-3">
          <div className="flex items-start justify-between gap-3 px-4 pt-2.5 md:pr-2">
            <span className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-[34px] w-[2px] bg-black" />
              <span>{number}</span>
            </span>
            <h2 id={`case-${project.id}`} className="text-right">
              {project.title}
            </h2>
          </div>

          <div className="relative hidden border-l border-black md:block">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--rule)] px-2 pb-2 pt-2.5">
              <span>{disciplines}</span>
              <span>{project.year}</span>
            </div>
            <button
              type="button"
              onClick={() => setInfoOpen((v) => !v)}
              aria-expanded={infoOpen}
              className="relative flex w-full items-center justify-center py-2.5 hover:underline"
            >
              Info
              <Crosshair className="absolute right-3 top-1/2 -translate-y-1/2" />
            </button>
          </div>

          <div className="flex items-start justify-between border-l border-black px-2 pt-2.5 md:pr-4">
            <button type="button" onClick={close} className="hover:underline">
              Close
            </button>
            <button type="button" onClick={close} aria-label="Close case" className="ml-6 mt-0.5">
              <CloseGlyph />
            </button>
          </div>

          {/* mobile second row */}
          <div className="col-span-2 flex items-center justify-between border-t border-[var(--rule)] px-4 py-2 md:hidden">
            <span className="truncate pr-3">
              {disciplines} · {project.year}
            </span>
            <button
              type="button"
              onClick={() => setInfoOpen((v) => !v)}
              aria-expanded={infoOpen}
              className="shrink-0 underline"
            >
              Info
            </button>
          </div>

          {infoOpen && (
            <InfoPanel
              project={project}
              onClose={() => setInfoOpen(false)}
              onBoard={() => setShowBoard(true)}
            />
          )}
        </header>

        {/* media ruler */}
        <nav
          aria-label="Media"
          className="relative mx-4 mt-8 flex h-6 items-end border-x-2 border-black md:mt-10"
        >
          <div className="case-rule absolute inset-0" aria-hidden />
          <div className="relative grid h-full w-full grid-cols-12">
            {Array.from({ length: RULER_CELLS }).map((_, cell) => {
              const first = Math.max(0, Math.min(RULER_FIRST_CELL, RULER_CELLS - media.length));
              const i = cell - first;
              const has = i >= 0 && i < media.length;
              return (
                <span key={cell} className="relative flex items-start justify-end pr-1.5">
                  {has && (
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Media ${i + 1}`}
                      aria-current={i === index}
                      className={`text-[13px] leading-none ${i === index ? "text-black" : "text-black/35 hover:text-black"}`}
                    >
                      {i + 1}
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </nav>

        {/* stage */}
        <div className="absolute inset-x-0 bottom-0 top-[124px] md:top-[140px]">
          {current && (
            <button
              type="button"
              onClick={() => media.length > 1 && step(1)}
              className={`block h-full w-full ${media.length > 1 ? "cursor-e-resize" : "cursor-default"}`}
              aria-label={media.length > 1 ? "Next media" : project.title}
            >
              <FlareMedia key={`${project.id}-${index}`} item={current} label={project.title} />
            </button>
          )}
        </div>

        <StudioRail className="pointer-events-none absolute inset-x-0 bottom-0 z-10 text-white mix-blend-difference" />
      </div>

      <ProjectProcessOverlay project={showBoard ? project : null} onClose={() => setShowBoard(false)} />
    </>,
    document.body,
  );
}

function InfoPanel({
  project,
  onClose,
  onBoard,
}: {
  project: Project;
  onClose: () => void;
  onBoard: () => void;
}) {
  const credits = [
    project.role && `Role — ${project.role}`,
    project.client && `${project.clientLabel ?? "Client"} — ${project.client}`,
    project.team && `Team — ${project.team}`,
    `Year — ${project.year}`,
  ].filter(Boolean) as string[];

  const sections: Array<{ title: string; body: React.ReactNode }> = [
    { title: "About the Project", body: <p>{project.blurb}</p> },
    {
      title: "The Work",
      body: project.writeup.map((para, i) => <p key={i}>{para}</p>),
    },
    { title: "Credits", body: credits.map((c) => <p key={c}>{c}</p>) },
  ];
  if (project.process) {
    sections.push({
      title: "Design Board",
      body: (
        <button type="button" onClick={onBoard} className="underline">
          Open the board behind {project.title} →
        </button>
      ),
    });
  }

  return (
    <div
      data-scroll-momentum
      className="info-drop absolute left-0 right-0 top-full z-30 max-h-[calc(100svh-150px)] md:max-h-[calc(100svh-110px)] overflow-y-auto border-y border-[var(--rule)] bg-white px-4 md:left-1/3 md:right-1/3 md:top-[36px] md:border md:px-2"
    >
      {sections.map((s, i) => (
        <section key={s.title} className="border-b border-[var(--rule)] py-3">
          <h3 className="flex items-center gap-2 pb-2.5">
            <span className="w-4 text-right">{i + 1}</span>
            <span className="inline-block h-4 w-[2px] bg-black" />
            {s.title}
          </h3>
          <div className="space-y-3 border-t border-[var(--rule)] pt-3 text-[15px] leading-[1.32]">
            {s.body}
          </div>
        </section>
      ))}
      <button
        type="button"
        onClick={onClose}
        className="relative flex w-full items-center justify-center py-3 hover:underline"
      >
        Close
        <CloseGlyph className="absolute right-3 top-1/2 -translate-y-1/2" />
      </button>
    </div>
  );
}

function CloseGlyph({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path d="M2 2 L16 16 M16 2 L2 16" stroke="currentColor" strokeWidth="1" />
      <path d="M5 2 L16 13 M13 2 L2 13" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className={className}>
      <path d="M11 1 V21 M1 11 H21" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
    </svg>
  );
}
