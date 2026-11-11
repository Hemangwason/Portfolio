"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loopFor, showcase, stillFor } from "../../data/projects";
import type { GlobeHandle } from "./globeScene";
import { BoardHeader, PillHeader, type NavActions } from "./Headers";
import { BOARD_TICKER } from "./links";
import { Loader } from "./Loader";
import { AboutPanel, ContactPanel } from "./Panels";
import { ProjectReel } from "./ProjectReel";
import { Ticker } from "./Ticker";

export type View = "board" | "about" | "contact" | "project";

type Props = {
  initialView?: View;
  initialProject?: string;
};

const BG = "#f6f4f2";
const LINE = "#17151b";
const LOADER_MIN_MS = 1300;
const LOADER_MAX_MS = 5000;
const REEL_FADE_MS = 520;
/** Swap from the landed tile to the project view — same still, so short. */
const REEL_SWAP_MS = 160;
/** Loader fade (600ms) plus a beat on the floating globe. */
const ARRIVAL_DELAY_MS = 900;

export type ReelPhase = "hidden" | "shown" | "closing";

const nextFrames = (n: number) =>
  new Promise<void>((resolve) => {
    const step = (left: number) => (left <= 0 ? resolve() : requestAnimationFrame(() => step(left - 1)));
    step(n);
  });

function pathFor(view: View, projectId?: string | null): string {
  if (view === "project" && projectId) return `/projects/${projectId}`;
  if (view === "about") return "/about";
  if (view === "contact") return "/contact";
  return "/";
}

function parsePath(pathname: string): { view: View; project?: string } {
  const m = pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (m && showcase.some((p) => p.id === m[1])) return { view: "project", project: m[1] };
  if (pathname.startsWith("/about")) return { view: "about" };
  if (pathname.startsWith("/contact")) return { view: "contact" };
  return { view: "board" };
}

export function Experience({ initialView = "board", initialProject }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<GlobeHandle | null>(null);
  const uRef = useRef<HTMLSpanElement>(null);
  const vRef = useRef<HTMLSpanElement>(null);

  const [view, setView] = useState<View>(initialView === "project" ? "board" : initialView);
  const [reelStart, setReelStart] = useState<string | null>(null);
  const [reelPhase, setReelPhase] = useState<ReelPhase>("hidden");
  const reelVisible = reelPhase === "shown";
  const [current, setCurrent] = useState<string | null>(null);
  const [jumpTo, setJumpTo] = useState<{ id: string; nonce: number } | null>(null);
  const [boardReady, setBoardReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reelScrolled, setReelScrolled] = useState(false);
  const busyRef = useRef(false);
  const viewRef = useRef(view);
  viewRef.current = view;

  const currentProject = useMemo(() => showcase.find((p) => p.id === current) ?? null, [current]);

  /* ── boot the board ──────────────────────────────────────────── */
  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("./globeScene")
      .then(({ createGlobe }) => {
        if (disposed) return;
        const handle = createGlobe(
          canvas,
          showcase.map((p) => {
            const s = stillFor(p.id);
            return { id: p.id, still: s.src, aspect: s.width / s.height, loop: loopFor(p) };
          }),
          {
            background: BG,
            lineColor: LINE,
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            onSelect: (id) => openProjectRef.current(id),
            onReady: () => setBoardReady(true),
            onFrame: (tiltDeg, spinDeg) => {
              if (uRef.current) uRef.current.textContent = tiltDeg.toFixed(6);
              if (vRef.current) vRef.current.textContent = spinDeg.toFixed(6);
            },
          },
        );
        boardRef.current = handle;
        handle.setActive(true);
      })
      .catch(() => {
        if (!disposed) {
          setFailed(true);
          setBoardReady(true);
        }
      });
    return () => {
      disposed = true;
      boardRef.current?.dispose();
      boardRef.current = null;
    };
  }, []);

  // Loader: at least LOADER_MIN_MS, at most LOADER_MAX_MS.
  useEffect(() => {
    const started = performance.now();
    const cap = setTimeout(() => setLoaderDone(true), LOADER_MAX_MS);
    let min: ReturnType<typeof setTimeout> | undefined;
    if (boardReady) {
      min = setTimeout(() => setLoaderDone(true), Math.max(0, LOADER_MIN_MS - (performance.now() - started)));
    }
    return () => {
      clearTimeout(cap);
      if (min) clearTimeout(min);
    };
  }, [boardReady]);

  /* ── transitions ─────────────────────────────────────────────── */
  const openProject = useCallback(async (id: string, push = true) => {
    if (viewRef.current === "project") {
      setJumpTo({ id, nonce: Date.now() });
      return;
    }
    if (busyRef.current) return;
    busyRef.current = true;
    setView("project");
    setCurrent(id);
    setReelScrolled(false);
    if (push) window.history.pushState(null, "", pathFor("project", id));

    // Match cut: lay the project view out invisibly, measure where its
    // first frame will sit, and fly the tile onto exactly that rect.
    // The frame's poster is the same still the tile shows, so the swap
    // that follows is invisible.
    setReelPhase("hidden");
    setReelStart(id);
    await nextFrames(2);
    const frame = document
      .querySelector<HTMLElement>(`[data-reel-id="${CSS.escape(id)}"] .reel-media`)
      ?.getBoundingClientRect();
    await boardRef.current?.flyIn(id, frame);
    setReelPhase("shown");
    setTimeout(() => {
      boardRef.current?.setActive(false);
      busyRef.current = false;
    }, REEL_SWAP_MS + 80);
  }, []);
  const openProjectRef = useRef(openProject);
  openProjectRef.current = openProject;

  const closeProject = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    boardRef.current?.setActive(true);
    setReelScrolled(false);
    // Shrink + fade the view while the camera is already pulling back
    // out, so closing reads as one move back onto the globe.
    setReelPhase("closing");
    const unmount = new Promise<void>((resolve) =>
      setTimeout(() => {
        setReelStart(null);
        setCurrent(null);
        setReelPhase("hidden");
        resolve();
      }, REEL_FADE_MS),
    );
    await Promise.all([boardRef.current?.flyOut(), unmount]);
    busyRef.current = false;
  }, []);

  // Arrival: once the loader clears, fly from the floating globe in.
  useEffect(() => {
    if (!loaderDone || !boardReady) return;
    if (initialView === "project") return;
    // Wait for the loader's fade so the whole journey in is visible.
    const t = setTimeout(() => boardRef.current?.enter(), ARRIVAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [loaderDone, boardReady, initialView]);

  const go = useCallback(
    async (next: Exclude<View, "project">, push = true) => {
      if (viewRef.current === "project") await closeProject();
      const target = viewRef.current === next && next !== "board" ? "board" : next;
      setView(target);
      if (push) window.history.pushState(null, "", pathFor(target));
    },
    [closeProject],
  );

  const actions: NavActions = useMemo(
    () => ({
      onHome: () => go("board"),
      onAbout: () => go("about"),
      onContact: () => go("contact"),
    }),
    [go],
  );

  // Deep link straight into a project once the board can fly.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !loaderDone || initialView !== "project" || !initialProject) return;
    deepLinked.current = true;
    void openProject(initialProject, false);
  }, [loaderDone, initialView, initialProject, openProject]);

  // Scroll position inside the reel picks the current project.
  const onCurrent = useCallback((id: string) => {
    setCurrent(id);
    window.history.replaceState(null, "", pathFor("project", id));
  }, []);

  // Browser back / forward.
  useEffect(() => {
    const onPop = () => {
      const { view: next, project } = parsePath(window.location.pathname);
      if (next === "project" && project) void openProject(project, false);
      else void go(next as Exclude<View, "project">, false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [go, openProject]);

  // Esc: close whatever is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (viewRef.current === "project") {
        window.history.pushState(null, "", "/");
        void closeProject().then(() => setView("board"));
      } else if (viewRef.current !== "board") {
        void go("board");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProject, go]);

  const inProject = view === "project";
  const headerActive = inProject ? "project" : view === "board" ? "home" : view;
  const tickerItems = currentProject
    ? [...currentProject.tags, currentProject.client ?? "Independent", currentProject.year]
    : BOARD_TICKER;

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0" style={{ top: "var(--hdr-h)" }}>
        <canvas
          ref={canvasRef}
          className="block h-full w-full cursor-grab touch-none select-none"
          aria-label="Globe of projects. Scroll to spin, drag to turn, click a tile to open it."
        />
        <span
          ref={uRef}
          aria-hidden
          className="label pointer-events-none absolute left-8 top-12 hidden text-[12px] text-[var(--ink-faint)] md:block"
        >
          0.000000
        </span>
        <span
          ref={vRef}
          aria-hidden
          className="label pointer-events-none absolute right-8 top-12 hidden text-[12px] text-[var(--ink-faint)] md:block"
        >
          0.000000
        </span>
        {failed && <BoardFallback onOpen={(id) => void openProject(id)} />}
      </div>

      <BoardHeader actions={actions} active={headerActive} collapsed={inProject && reelScrolled} />
      <PillHeader
        actions={actions}
        visible={inProject && reelVisible && reelScrolled}
        projects={showcase}
        current={currentProject}
        onPick={(id) => void openProject(id)}
      />

      <AboutPanel open={view === "about"} />
      <ContactPanel open={view === "contact"} />

      {reelStart && (
        <ProjectReel
            phase={reelPhase}
            projects={showcase}
            startId={reelStart}
            jumpTo={jumpTo}
            onCurrent={onCurrent}
            onScrolled={setReelScrolled}
            onClose={() => {
              window.history.pushState(null, "", "/");
              void closeProject().then(() => setView("board"));
            }}
          />
      )}

      <Ticker
        key={currentProject?.id ?? "board"}
        items={tickerItems}
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      />

      {!inProject && <QuickView onOpen={() => void openProject(showcase[0].id)} />}

      {/* keyboard / screen-reader route into every project */}
      <nav aria-label="Projects" className="sr-only">
        <ul>
          {showcase.map((p) => (
            <li key={p.id}>
              <a
                href={`/projects/${p.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  void openProject(p.id);
                }}
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Loader done={loaderDone} />
    </main>
  );
}

const QUICK_VIEW_STACK = 3;

/** Small bubble: a fanned stack of stills that opens the full scroll. */
function QuickView({ onOpen }: { onOpen: () => void }) {
  const stack = showcase.slice(0, QUICK_VIEW_STACK);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Quick view: scroll through all ${showcase.length} projects`}
      className="pill group fixed bottom-[78px] left-4 z-50 flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition-transform hover:-translate-y-0.5 sm:bottom-5 sm:left-6"
    >
      <span className="relative flex h-9 w-14 items-center" aria-hidden>
        {stack.map((p, i) => (
          <img
            key={p.id}
            src={stillFor(p.id).src}
            alt=""
            className="absolute h-9 w-9 rounded-full border-2 border-[var(--bg)] object-cover transition-transform duration-300 group-hover:translate-x-[var(--fan)]"
            style={{ left: i * 9, zIndex: QUICK_VIEW_STACK - i, "--fan": `${i * 4}px` } as React.CSSProperties}
          />
        ))}
      </span>
      <span className="label whitespace-nowrap text-[var(--ink)]">All {showcase.length}</span>
    </button>
  );
}

/** Flat grid of stills, used only if WebGL can't start. */
function BoardFallback({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="iris-bg absolute inset-0 overflow-y-auto p-4 sm:p-8">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {showcase.map((p) => {
          const s = stillFor(p.id);
          return (
            <li key={p.id}>
              <button type="button" onClick={() => onOpen(p.id)} className="block w-full text-left">
                <img src={s.src} alt="" loading="lazy" className="aspect-video w-full rounded-[6px] object-cover" />
                <span className="display mt-2 block text-[20px] leading-tight">{p.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
