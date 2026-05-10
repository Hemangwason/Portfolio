"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project, ProjectProcess } from "../data/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
};

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3;
const WHEEL_SENSITIVITY = 0.0018;

// Full-bleed canvas viewer for a project's design board / flow image.
// The image lives in a transformed wrapper; pan via pointer drag,
// zoom via wheel/pinch, and a "Reset" pill resets to fit-to-frame.
//
// Layered above the ProjectModal so opening the flow keeps the modal
// stack alive — closing the overlay drops you back into the case
// study, not the page underneath.
const EXIT_MS = 220;

export function ProjectProcessOverlay({ project, onClose }: Props) {
  const open = Boolean(project?.process);

  // Hold onto the last open project so the close animation has data
  // to render against — without this the panel snaps to empty as soon
  // as `project` is cleared. Stays above the early-return so the hook
  // count is stable across renders.
  const cached = useCachedProject(project);

  // `keepAlive` keeps the overlay mounted long enough to play its
  // exit animation after `open` flips to false. Without this React
  // would yank the DOM the same frame the user clicks Close, and
  // there'd be no fade.
  const [keepAlive, setKeepAlive] = useState(open);

  useEffect(() => {
    if (open) {
      setKeepAlive(true);
      return;
    }
    const id = window.setTimeout(() => setKeepAlive(false), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  if (!keepAlive && !open) return null;

  const renderProject = open ? project : cached;
  if (!renderProject?.process) return null;

  return createPortal(
    <div
      data-open={open ? "true" : "false"}
      className="process-overlay fixed inset-0 z-[120] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`process-title-${renderProject.id}`}
      style={{ background: renderProject.process.bg ?? "#0b0b0b" }}
    >
      <ProcessShell project={renderProject} onClose={onClose} />
    </div>,
    document.body,
  );
}

// Stash the last non-null project so the exit animation has something
// to draw while React unwinds the panel.
function useCachedProject(project: Project | null): Project | null {
  const ref = useRef<Project | null>(null);
  if (project) ref.current = project;
  return ref.current;
}

function ProcessShell({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const process = project.process as ProjectProcess;

  return (
    <>
      {/* Soft vignette so the canvas reads as a stage, not a flat slab. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.04), transparent 55%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.5), transparent 55%)",
        }}
      />

      <ProcessHeader project={project} process={process} onClose={onClose} />

      <ProcessCanvas process={process} />

      <ProcessFooter />
    </>
  );
}

function ProcessHeader({
  project,
  process,
  onClose,
}: {
  project: Project;
  process: ProjectProcess;
  onClose: () => void;
}) {
  return (
    <header
      className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.06] px-4 py-3 sm:px-6 sm:py-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)",
      }}
    >
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          <span className="text-white/35">{project.title}</span>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">
            {process.label ?? "Process flow"}
          </span>
        </p>
        <h2
          id={`process-title-${project.id}`}
          className="mt-1 max-w-[60ch] text-[13px] leading-snug text-white/85 sm:text-[14px]"
        >
          {process.blurb ??
            "How this project came together — explorations, decisions, and the screens that landed."}
        </h2>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close process flow"
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition-colors hover:bg-white hover:text-black sm:h-10 sm:w-10"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M2 2 L12 12 M12 2 L2 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  );
}

function ProcessCanvas({ process }: { process: ProjectProcess }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [stageSize, setStageSize] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
  const [loaded, setLoaded] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  // True until the user manually pans or zooms. While true, every
  // viewport resize re-fits the board so it never drifts off-frame
  // (e.g. phone rotation, browser resize). Pan or zoom flips this to
  // false so the user's framing isn't yanked out from under them.
  const isFittedRef = useRef(true);

  // Track stage size so we can compute the fit-to-frame zoom.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setStageSize({ w: rect.width, h: rect.height });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Initial zoom strategy: fit the image to the SHORTER side of the
  // viewport so screens are immediately legible (Math.max). For tall
  // portrait boards on a landscape viewport this means width fits and
  // the user scrolls vertically, PDF-style. The wheel handler is
  // already scroll-to-pan so this composes naturally.
  //
  // Recomputed whenever the stage resizes so rotating a phone or
  // resizing the window keeps the image legibly fit.
  const fitZoom = (() => {
    if (!stageSize) return 1;
    const margin = 0.96;
    const zx = (stageSize.w * margin) / process.width;
    const zy = (stageSize.h * margin) / process.height;
    return Math.max(zx, zy);
  })();

  // When the image overflows the viewport in either axis we want the
  // user to land on the TOP/LEFT corner — like opening a PDF — not
  // the geometric centre, which is often empty canvas. Compute the
  // translate that aligns the top/left edge to the viewport edge with
  // the same margin used in fitZoom.
  const fitOrigin = (() => {
    if (!stageSize) return { x: 0, y: 0 };
    const renderedW = process.width * fitZoom;
    const renderedH = process.height * fitZoom;
    const margin = 0.96;
    const innerW = stageSize.w * margin;
    const innerH = stageSize.h * margin;
    // Positive Y shifts the image down → exposes its TOP. Same logic
    // for X. Only kick in when the image actually overflows.
    const y =
      renderedH > innerH ? (renderedH - innerH) / 2 : 0;
    const x =
      renderedW > innerW ? (renderedW - innerW) / 2 : 0;
    return { x, y };
  })();

  const resetTransform = useCallback(() => {
    isFittedRef.current = true;
    setTransform({ x: fitOrigin.x, y: fitOrigin.y, zoom: fitZoom });
  }, [fitZoom, fitOrigin.x, fitOrigin.y]);

  // Re-fit while the user hasn't taken control. Covers first paint,
  // late-arriving stage size, and viewport resizes.
  useEffect(() => {
    if (!stageSize || !isFittedRef.current) return;
    setTransform({ x: fitOrigin.x, y: fitOrigin.y, zoom: fitZoom });
  }, [stageSize, fitZoom, fitOrigin.x, fitOrigin.y]);

  // Figma-style wheel: trackpad/wheel pans the canvas, modifier keys
  // (or pinch on trackpads, which fires wheel with ctrlKey=true) zoom.
  // Lets users scroll through tall boards naturally without fighting
  // the zoom.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      isFittedRef.current = false;

      // Pinch-zoom on macOS trackpads arrives as a wheel event with
      // `ctrlKey: true`, regardless of whether the user actually
      // holds Control. Treat any modifier as "zoom".
      const isZoom = e.ctrlKey || e.metaKey;

      if (isZoom) {
        setTransform((prev) => {
          const rect = el.getBoundingClientRect();
          const cx = e.clientX - rect.left - rect.width / 2;
          const cy = e.clientY - rect.top - rect.height / 2;

          const factor = Math.exp(-e.deltaY * WHEEL_SENSITIVITY);
          const nextZoom = clamp(prev.zoom * factor, MIN_ZOOM, MAX_ZOOM);

          // Keep the point under the cursor stable while zooming.
          const k = nextZoom / prev.zoom;
          const nx = cx - (cx - prev.x) * k;
          const ny = cy - (cy - prev.y) * k;

          return { x: nx, y: ny, zoom: nextZoom };
        });
        return;
      }

      // Otherwise: pan. shift+scroll inverts axes for users who want
      // horizontal travel from a vertical wheel.
      setTransform((prev) => {
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        const dy = e.shiftKey ? e.deltaX : e.deltaY;
        return { ...prev, x: prev.x - dx, y: prev.y - dy };
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Pointer state: a Map of active pointers lets us run two distinct
  // gestures off the same handler set — single-pointer = pan, two
  // pointers = pinch zoom + pan in one motion (touchpads, touchscreens).
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const pinchRef = useRef<{
    startDistance: number;
    startZoom: number;
    startMidX: number;
    startMidY: number;
    startTx: number;
    startTy: number;
  } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const el = wrapRef.current;
    const stageEl = stageRef.current;
    if (!el || !stageEl) return;
    el.setPointerCapture(e.pointerId);
    isFittedRef.current = false;

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1) {
      // Single-pointer: start drag.
      dragRef.current = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        ox: transform.x,
        oy: transform.y,
      };
      pinchRef.current = null;
      setGrabbing(true);
    } else if (pointersRef.current.size === 2) {
      // Second pointer down: drop drag, lock in pinch baseline. The
      // midpoint is captured in stage-local coordinates so we can
      // anchor zoom at the user's fingers, just like the cursor for
      // wheel zoom.
      dragRef.current = null;
      const pts = Array.from(pointersRef.current.values());
      const [p1, p2] = pts;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.hypot(dx, dy) || 1;
      const stageRect = stageEl.getBoundingClientRect();
      const midX = (p1.x + p2.x) / 2 - stageRect.left - stageRect.width / 2;
      const midY = (p1.y + p2.y) / 2 - stageRect.top - stageRect.height / 2;
      pinchRef.current = {
        startDistance: distance,
        startZoom: transform.zoom,
        startMidX: midX,
        startMidY: midY,
        startTx: transform.x,
        startTy: transform.y,
      };
      setGrabbing(false);
    }
  }, [transform.x, transform.y, transform.zoom]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      // Pinch: scale = newDistance / startDistance, anchor at the
      // initial midpoint. Translation rides on top so the canvas
      // stays under the user's fingers cleanly.
      const pts = Array.from(pointersRef.current.values());
      const [p1, p2] = pts;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.hypot(dx, dy) || 1;
      const pinch = pinchRef.current;
      const nextZoom = clamp(
        pinch.startZoom * (distance / pinch.startDistance),
        MIN_ZOOM,
        MAX_ZOOM,
      );
      const k = nextZoom / pinch.startZoom;
      const nx = pinch.startMidX - (pinch.startMidX - pinch.startTx) * k;
      const ny = pinch.startMidY - (pinch.startMidY - pinch.startTy) * k;
      setTransform({ x: nx, y: ny, zoom: nextZoom });
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    setTransform((prev) => ({ ...prev, x: drag.ox + dx, y: drag.oy + dy }));
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);

    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    const drag = dragRef.current;
    if (drag && drag.id === e.pointerId) {
      dragRef.current = null;
      setGrabbing(false);
    }

    try {
      wrapRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer was already released — fine.
    }
  }, []);

  const zoomBy = useCallback((factor: number) => {
    isFittedRef.current = false;
    setTransform((prev) => {
      const nextZoom = clamp(prev.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      const k = nextZoom / prev.zoom;
      return { x: prev.x * k, y: prev.y * k, zoom: nextZoom };
    });
  }, []);

  const zoomPercent = stageSize ? Math.round((transform.zoom / fitZoom) * 100) : 100;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={stageRef}
        className="relative flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden"
        style={{ touchAction: "none" }}
      >
        {/* Faint grid behind the canvas so empty space reads as a
            studio backdrop, not a void. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div
          ref={wrapRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={resetTransform}
          className="relative h-full w-full"
          style={{ cursor: grabbing ? "grabbing" : "grab" }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: process.width,
              height: process.height,
              transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
              transformOrigin: "center center",
              willChange: "transform",
              transition: dragRef.current ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Soft border so the board reads as an artifact on the
                canvas, not a flat splat. */}
            <div
              className="absolute inset-0 rounded-[6px]"
              style={{
                boxShadow:
                  "0 60px 140px -40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            />

            {process.poster && !loaded && (
              <img
                src={process.poster}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full rounded-[6px] object-contain blur-[2px]"
                draggable={false}
              />
            )}
            <img
              src={process.src}
              alt={process.label ?? "Project flow"}
              loading="eager"
              decoding="async"
              draggable={false}
              onLoad={() => setLoaded(true)}
              className="absolute inset-0 h-full w-full rounded-[6px] object-contain"
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 240ms ease-out" }}
            />
          </div>
        </div>
      </div>

      <ZoomDock
        zoomPercent={zoomPercent}
        onZoomIn={() => zoomBy(1.2)}
        onZoomOut={() => zoomBy(1 / 1.2)}
        onReset={resetTransform}
      />
    </div>
  );
}

function ZoomDock({
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 sm:bottom-6">
      <div
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/55 p-1 backdrop-blur-md"
        style={{
          boxShadow:
            "0 18px 36px -18px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.02) inset",
        }}
      >
        <DockButton onClick={onZoomOut} aria-label="Zoom out">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 7H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </DockButton>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white"
        >
          {zoomPercent}%
          <span className="ml-2 text-white/40">·</span>
          <span className="ml-2 text-white/55">reset</span>
        </button>

        <DockButton onClick={onZoomIn} aria-label="Zoom in">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </DockButton>
      </div>
    </div>
  );
}

function DockButton({
  children,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white hover:text-black"
      {...rest}
    >
      {children}
    </button>
  );
}

function ProcessFooter() {
  return (
    <footer className="pointer-events-none absolute left-0 right-0 top-[calc(100%-44px)] z-0 hidden items-center justify-between px-6 pb-3 sm:flex">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
        scroll · drag to pan · ⌘ scroll to zoom
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
        esc to close
      </span>
    </footer>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
