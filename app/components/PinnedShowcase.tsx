"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import { ProjectVideoModal } from "./ProjectVideoModal";
import { ProjectModal } from "./ProjectModal";
import { ProjectIcon } from "./ProjectIcon";

// Pre-render-safe layout effect: useLayoutEffect on the client so the
// initial transform is committed before paint (no flash on deep refresh),
// useEffect on the server (Next.js SSR) where DOM doesn't exist yet.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Vertical scroll budget allocated per project, expressed as a fraction of
// the viewport height. 1 ≈ one full swipe of vertical scroll per project.
const VH_PER_PROJECT = 1;

// Per-project palette used to tint the ambient wash behind the active
// panel. Each project owns:
//   - `primary`  — deeper colour pulled from the masthead's dominant hue
//   - `accent`   — lighter complement that fills the diagonally opposite
//                  corner so the canvas reads as a balanced two-tone wash
//                  rather than a blob on white
//   - `anchor`   — viewport-relative [x%, y%] where the primary's centre
//                  sits. We rotate the anchor around the viewport across
//                  the 12 projects so scrolling feels like the camera
//                  panning across a room — each project is a new scene.
//
// All values are raw numbers so we can linearly interpolate between two
// adjacent projects on every scroll tick without re-parsing hex.
type Rgb = readonly [number, number, number];
type Anchor = readonly [number, number];
type Palette = { primary: Rgb; accent: Rgb; anchor: Anchor };

// Per-project pastels with real chroma. We sit in the 300/400-luminance
// range (light enough that no spot ever reads as "dark" against the
// canvas) but choose the more SATURATED end of that range so the hue is
// unmistakable when the wash applies. The previous 200-level pastels
// looked watered down; these announce the project without darkening it.
// Each project also gets two distinct hues (primary + accent), not just
// two values of the same one, so the diagonal balance reads as a real
// duotone rather than one colour fading into a tint of itself.
const PROJECT_PALETTES: Record<string, Palette> = {
  sidetake: { primary: [56, 189, 248], accent: [34, 211, 238], anchor: [22, 24] },
  sidetalk: { primary: [167, 139, 250], accent: [232, 121, 249], anchor: [78, 22] },
  boomerang: { primary: [251, 146, 60], accent: [253, 186, 116], anchor: [82, 78] },
  jexlin: { primary: [96, 165, 250], accent: [129, 140, 248], anchor: [20, 80] },
  crater: { primary: [244, 114, 182], accent: [251, 113, 133], anchor: [50, 18] },
  "sid-voice-host": { primary: [148, 163, 184], accent: [192, 132, 252], anchor: [85, 50] },
  "healthy-high-five": { primary: [251, 146, 60], accent: [244, 114, 182], anchor: [50, 82] },
  "independence-day-banner": { primary: [74, 222, 128], accent: [251, 146, 60], anchor: [15, 50] },
  "asia-cup-2025": { primary: [248, 113, 113], accent: [250, 204, 21], anchor: [28, 30] },
  "goat-offers-bumrah": { primary: [248, 113, 113], accent: [250, 204, 21], anchor: [78, 32] },
  "durga-puja-pandal": { primary: [251, 146, 60], accent: [253, 224, 71], anchor: [72, 76] },
  "zomato-plus-identity": { primary: [251, 113, 133], accent: [253, 164, 175], anchor: [25, 70] },
};

const DEFAULT_PALETTE: Palette = {
  primary: [129, 140, 248],
  accent: [232, 121, 249],
  anchor: [50, 50],
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const lerpRgb = (a: Rgb, b: Rgb, t: number): Rgb => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

const lerpAnchor = (a: Anchor, b: Anchor, t: number): Anchor => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
];

const rgba = ([r, g, b]: Rgb, alpha: number): string =>
  `rgba(${r},${g},${b},${alpha})`;

type Props = { projects: Project[] };

export function PinnedShowcase({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [videoId, setVideoId] = useState<string | null>(null);
  const [writeupId, setWriteupId] = useState<string | null>(null);

  const videoProject = videoId
    ? (projects.find((p) => p.id === videoId) ?? null)
    : null;
  const writeupProject = writeupId
    ? (projects.find((p) => p.id === writeupId) ?? null)
    : null;

  const handleKnowMore = () => {
    if (!videoId) return;
    const id = videoId;
    setVideoId(null);
    setWriteupId(id);
  };

  const N = projects.length;
  const MAX = N - 1;

  // Drive the horizontal track from natural vertical scroll. The outer
  // section is tall (N viewport-heights); inside, a sticky child pins
  // to the viewport top while the user scrolls through that height,
  // and we map that scroll progress to a horizontal translate on the
  // track. No wheel hijack, no preventDefault — only one scroll axis
  // (vertical) is ever live, and horizontal traverse is a pure visual
  // derivative of it. The moment scroll progress reaches 1, the sticky
  // child unpins and the next section flows in naturally.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let raf = 0;

    // Cache section.offsetHeight + window dimensions outside the rAF
    // callback. Both are stable until a resize, and reading them on
    // every frame forces a layout recompute. Refresh on resize.
    let sectionHeight = section.offsetHeight;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const refreshDims = () => {
      sectionHeight = section.offsetHeight;
      vw = window.innerWidth;
      vh = window.innerHeight;
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      // The sticky child is pinned across `pinDistance` worth of
      // vertical scroll — i.e. the section's height minus one viewport.
      const pinDistance = sectionHeight - vh;
      // -rect.top: pixels scrolled past the section's top edge.
      const scrolled = -rect.top;
      const t =
        pinDistance > 0
          ? Math.max(0, Math.min(1, scrolled / pinDistance))
          : 0;
      const p = t * MAX;

      track.style.transform = `translate3d(${-p * vw}px, 0, 0)`;

      const gradient = gradientRef.current;
      if (gradient) {
        // Per-project ambient wash. Each project owns a primary +
        // accent colour AND an anchor (viewport-relative %), and we
        // linearly interpolate ALL THREE between floor(p) and ceil(p)
        // on every tick. The result is a full-bleed gradient that
        // shifts hue AND focal point as the user scrolls — every
        // project feels like a different scene, and the camera pans
        // smoothly between them.
        //
        // Composition is two SOFT, oversized pastel washes that span
        // edge-to-edge of the viewport with a long, gentle falloff.
        //   1. Primary wash — 150% × 120% radial centred on the
        //      project's anchor. The extents are larger than the
        //      viewport on purpose: only the SOFT outer fade actually
        //      lands inside, never the bright centre. That's what
        //      kills the "dark spot" feel — the wash reads as a tinted
        //      direction rather than a glowing blob.
        //   2. Accent counterpoint — anchored to the diagonal
        //      opposite, slightly smaller (130% × 105%), at a quieter
        //      alpha. Balances the composition so the canvas has
        //      colour from both sides like the reference.
        //
        // Both alphas are kept low (~0.22 / 0.18) — the hue is a
        // suggestion, not a statement. The vertical mask on this div
        // still fades both layers at the section's top/bottom edges
        // so we never collide with neighbouring sections.
        const i0 = Math.max(0, Math.min(MAX, Math.floor(p)));
        const i1 = Math.max(0, Math.min(MAX, Math.ceil(p)));
        const tx = p - i0;
        const pal0 =
          PROJECT_PALETTES[projects[i0].id] ?? DEFAULT_PALETTE;
        const pal1 =
          PROJECT_PALETTES[projects[i1].id] ?? DEFAULT_PALETTE;
        const primary = lerpRgb(pal0.primary, pal1.primary, tx);
        const accent = lerpRgb(pal0.accent, pal1.accent, tx);
        const [px, py] = lerpAnchor(pal0.anchor, pal1.anchor, tx);
        // Diagonal opposite of the primary anchor — keeps the
        // composition balanced regardless of where the primary lands.
        const ax = 100 - px;
        const ay = 100 - py;
        gradient.style.background =
          `radial-gradient(150% 120% at ${px}% ${py}%, ${rgba(primary, 0.22)} 0%, ${rgba(primary, 0.10)} 50%, rgba(255,255,255,0) 90%),` +
          `radial-gradient(130% 105% at ${ax}% ${ay}%, ${rgba(accent, 0.18)} 0%, rgba(255,255,255,0) 80%)`;
      }

      const idx = Math.round(p);
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      refreshDims();
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [N, MAX]);

  const jumpToIndex = (i: number) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const sectionTop = window.scrollY + sec.getBoundingClientRect().top;
    const pinDistance = sec.offsetHeight - window.innerHeight;
    const t = MAX > 0 ? i / MAX : 0;
    window.scrollTo({
      top: sectionTop + t * pinDistance,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Mobile fallback — wheel hijack on a phone is fighting the
          platform. Show a clean vertical stack instead. Same modal
          flow, same content, just laid out top-to-bottom. */}
      <section className="md:hidden flex flex-col gap-10 px-4 pt-12 pb-20">
        {projects.map((p) => (
          <MobilePanel key={p.id} project={p} onOpen={() => setVideoId(p.id)} />
        ))}
      </section>

      {/* Desktop: outer wrapper is N viewport-heights tall to give the
          sticky child enough vertical scroll budget to drive the
          horizontal traverse. The user is always doing native vertical
          scroll — there is no wheel hijack — so only one axis is ever
          live. The sticky child is the visible stage: a viewport-sized
          window onto a horizontal track that translates as scroll
          progresses through the wrapper. When the wrapper's bottom
          passes, the next section flows in naturally. */}
      <section
        ref={sectionRef}
        className="relative hidden w-full md:block"
        style={{ height: `${N * VH_PER_PROJECT * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* No solid bg here — the carousel sits on the same canvas
              as the rest of the page so there's no hard-edged box to
              clash with the GhostPicker above or LiveSites below.
              Visual interest comes entirely from the ambient sweep
              blobs, which track progress and shift hue. */}
          {/* Ambient sweep — vertical alpha mask fades the blobs to
              transparent at the top and bottom edges of the sticky
              child, so the colour never collides with the surrounding
              section bgs and the seam disappears. */}
          <div
            ref={gradientRef}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              maskImage:
                "linear-gradient(180deg, transparent 0%, black 22%, black 78%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, black 22%, black 78%, transparent 100%)",
            }}
          />

          <IconBar
            projects={projects}
            activeIndex={activeIndex}
            onJump={jumpToIndex}
          />

          <div className="absolute right-8 top-7 z-30 font-mono text-[11px] uppercase tracking-[0.22em] text-black/45 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="mx-1.5 text-black/20">/</span>
            {String(N).padStart(2, "0")}
          </div>

          <div
            ref={trackRef}
            className="absolute left-0 top-0 flex h-full"
            // NOTE: do NOT set `transform` here. The scroll handler
            // writes the translate imperatively; if we set it via
            // inline style, every React rerender (e.g. when
            // activeIndex flips) clobbers the live transform back to 0
            // and the carousel snaps to the start.
            style={{
              width: `${N * 100}vw`,
              willChange: "transform",
            }}
          >
            {projects.map((p, i) => (
              <ProjectPanel
                key={p.id}
                project={p}
                index={i}
                isActive={i === activeIndex}
                onOpen={() => setVideoId(p.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProjectVideoModal
        project={videoProject}
        onClose={() => setVideoId(null)}
        onKnowMore={handleKnowMore}
      />
      <ProjectModal
        project={writeupProject}
        onClose={() => setWriteupId(null)}
      />
    </>
  );
}

function IconBar({
  projects,
  activeIndex,
  onJump,
}: {
  projects: Project[];
  activeIndex: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="absolute left-1/2 top-5 z-30 -translate-x-1/2">
      {/* Pill rail — soft inset shadow on the inside top edge gives the
          impression of a recessed groove that the active "stone" rests
          inside, lit from above. */}
      <div
        className="flex items-center gap-1 rounded-full border border-black/[0.06] p-1.5"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,249,251,0.92))",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset, 0 10px 30px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.05)",
          backdropFilter: "blur(18px) saturate(1.4)",
          WebkitBackdropFilter: "blur(18px) saturate(1.4)",
        }}
      >
        {projects.map((p, i) => (
          <IconButton
            key={p.id}
            project={p}
            isActive={i === activeIndex}
            onClick={() => onJump(i)}
          />
        ))}
      </div>
    </div>
  );
}

// Monochrome 3D glyph treatment. The emoji's intrinsic shading is what
// gives the depth — we strip the colour with `grayscale(1)`, push contrast
// just enough to keep the highlight/shadow legible, then layer two drop
// shadows (one tight, one diffuse) so each glyph reads as a small machined
// object resting on the rail. Active state: raised pearl pill with a
// soft inner highlight, like an embossed stone in a setting.
function IconButton({
  project,
  isActive,
  onClick,
}: {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Go to ${project.title}`}
      aria-current={isActive ? "true" : undefined}
      className={`group relative grid shrink-0 place-items-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isActive ? "h-12 w-12" : "h-9 w-9 hover:scale-110"
      }`}
      style={
        isActive
          ? {
              background:
                "radial-gradient(120% 120% at 50% 0%, #ffffff 0%, #f3f4f7 60%, #e7e9ef 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.95) inset, 0 -1px 1px rgba(15,23,42,0.06) inset, 0 6px 18px rgba(15,23,42,0.14), 0 2px 4px rgba(15,23,42,0.08)",
            }
          : undefined
      }
    >
      <span
        aria-hidden
        className="leading-none transition-transform duration-300 group-hover:scale-105"
        style={{
          // Layered shadows give every icon the same grounded "3D
          // sticker" depth — a tight contact shadow plus a softer
          // floor shadow. Inactive icons get a touch of desaturation
          // and lower opacity so the active one reads as raised.
          filter: isActive
            ? "drop-shadow(0 1px 1px rgba(15,23,42,0.22)) drop-shadow(0 4px 8px rgba(15,23,42,0.18))"
            : "saturate(0.9) opacity(0.78) drop-shadow(0 1px 1px rgba(15,23,42,0.16)) drop-shadow(0 3px 5px rgba(15,23,42,0.10))",
          transition: "filter 300ms ease, transform 300ms ease",
        }}
      >
        <ProjectIcon id={project.id} size={isActive ? 28 : 22} />
      </span>
      {/* Hover tooltip */}
      <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {project.title}
      </span>
    </button>
  );
}

function ProjectPanel({
  project,
  index,
  isActive,
  onOpen,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onOpen: () => void;
}) {
  const kindLabel = project.kind === "play" ? "VISUALS" : "PRODUCT";
  const kindAccent =
    project.kind === "play" ? "var(--accent)" : "var(--brand)";

  // Layout strategy: a flex column that fills the viewport. The
  // video stage takes the *remaining* space (flex-1 + min-h-0) and
  // sizes itself to 16:9 within both width AND height limits using
  // aspect-ratio plus max-h. The title bar is its own natural-height
  // row at the bottom. This guarantees the panel never overflows the
  // viewport, no matter how tall the screen is.
  return (
    <div className="relative flex h-full w-screen flex-shrink-0 flex-col px-8 pb-10 pt-24">
      <div className="relative flex flex-1 min-h-0 items-center justify-center">
        <div
          className="relative w-full max-w-[960px] overflow-hidden rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
          style={{
            aspectRatio: "16 / 9",
            // Cap height to the available flex space so the 16:9
            // ratio is honoured *within* what's left, not pushed
            // past the panel. Width auto-derives from aspect-ratio
            // + maxHeight when the height cap kicks in. Source videos
            // are 1280×720-ish, so we cap CSS width at 960 — closer
            // to native pixel density on retina, much sharper than
            // 1100px which forced a 1.7× upscale.
            maxHeight: "100%",
            backgroundColor:
              project.masthead?.bg ?? project.thumbnail?.bg ?? "#0a0a0a",
            // Inactive panels: only fade, no scale. Sub-pixel scale on a
            // <video> forces the compositor into a softer rasterisation
            // that lingers as visible blur even on the active frame.
            opacity: isActive ? 1 : 0.45,
            transition: "opacity 500ms ease-out",
          }}
        >
          <PanelMedia project={project} isActive={isActive} />

          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open ${project.title}`}
            className="absolute inset-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15"
          />
        </div>
      </div>

      {/* Title + Know more bar — fixed-height row, never compresses
          out of view because it's not flex-1. */}
      <div className="mx-auto mt-6 flex w-full max-w-[1100px] items-end justify-between gap-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white/70 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-black/65 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: kindAccent }}
            />
            {kindLabel}
            <span className="text-black/30">·</span>
            {project.year}
            <span className="text-black/30">·</span>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="mt-2 truncate text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-tight text-black">
            {project.title}
          </h2>
          <p className="mt-1 max-w-xl truncate text-[14px] text-black/55 sm:text-[15px]">
            {project.tagline}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-3 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 sm:text-[14px]"
        >
          Know more
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
      </div>
    </div>
  );
}

// Plays the video only when the panel is the currently active one.
// Inactive panels keep their poster. Avoids 12 concurrent video
// decoders during a scroll pass.
function PanelMedia({
  project,
  isActive,
}: {
  project: Project;
  isActive: boolean;
}) {
  const media = project.masthead ?? project.thumbnail;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) v.play().catch(() => {});
    else v.pause();
  }, [isActive]);

  if (!media) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-7xl">{project.emoji}</span>
      </div>
    );
  }

  if (media.type === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt ?? project.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      // auto so an inactive panel that's about to be scrolled into
      // already has frames buffered. Without this, the video shows
      // a blank black frame for a beat after activation.
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover"
      // Promote to its own compositor layer so the browser uses the
      // higher-quality scaler path. Combined with the tighter 960-px
      // card cap, this kills the visible blur on the source files.
      style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    />
  );
}

// Simple vertical card for mobile. No horizontal trickery; just one
// project per scroll-screen, full-width video, click to open the
// cinematic modal.
function MobilePanel({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const kindLabel = project.kind === "play" ? "VISUALS" : "PRODUCT";
  const kindAccent =
    project.kind === "play" ? "var(--accent)" : "var(--brand)";

  return (
    <article className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-video w-full overflow-hidden rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        style={{
          backgroundColor:
            project.masthead?.bg ?? project.thumbnail?.bg ?? "#0a0a0a",
        }}
      >
        <MobilePanelMedia project={project} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/15"
        />
      </button>
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white/70 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-black/65">
          <span
            className="h-1 w-1 rounded-full"
            style={{ background: kindAccent }}
          />
          {kindLabel} · {project.year}
        </span>
        <h2 className="mt-2 text-[1.4rem] font-semibold leading-tight tracking-tight">
          {project.title}
        </h2>
        <p className="mt-1 text-[14px] text-black/60">{project.tagline}</p>
      </div>
    </article>
  );
}

function MobilePanelMedia({ project }: { project: Project }) {
  const media = project.thumbnail ?? project.masthead;
  if (!media) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-7xl">{project.emoji}</span>
      </div>
    );
  }
  if (media.type === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt ?? project.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <img
      src={media.poster}
      alt=""
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
