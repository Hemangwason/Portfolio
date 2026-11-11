"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fieldLabel, filmFor, type Project } from "../../data/projects";
import type { ReelPhase } from "./Experience";
import { isConstrainedNetwork } from "./network";

type Props = {
  projects: Project[];
  startId: string;
  jumpTo: { id: string; nonce: number } | null;
  onCurrent: (id: string) => void;
  onClose: () => void;
  /** True once the visitor has scrolled past the top — shrinks the header. */
  onScrolled: (scrolled: boolean) => void;
  phase: ReelPhase;
};

const SCROLLED_PX = 12;

/* Entering media rises lying back (top edge away from you) and
   stands up as it reaches the upper third of the screen. */
const ENTER_SPAN = 0.72;
const MAX_TILT_DEG = 34;
const MIN_SCALE = 0.9;
const EXIT_SPAN = 0.4;
const EXIT_MIN_OPACITY = 0.3;
const PLAY_RATIO = 0.35;
/** After the match cut lands, the open card's video starts on the next beat. */
const VIDEO_START_DELAY_MS = 180;
/** A section's text rises in once its top passes this share of the screen. */
const TEXT_REVEAL_AT = 0.88;
/** After the match cut, the first project's text follows the picture in. */
const TEXT_REVEAL_DELAY_MS = 240;
/** How far ahead videos start streaming: generous on good links only. */
const PREFETCH_MARGIN = "60% 0px";
const PREFETCH_MARGIN_LEAN = "5% 0px";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Give a lazily-sourced video its file and let it start buffering. */
function ensureSource(v: HTMLVideoElement, lean: boolean) {
  if (v.getAttribute("src") || !v.dataset.src) return;
  v.preload = lean ? "metadata" : "auto";
  v.src = v.dataset.src;
}

/** Play a reel video. The first play jumps to the frame its still was
    cut from, so the picture carries on from the poster; after that it
    just resumes. Calling play() is what makes a not-yet-loaded video
    fetch, so it is never left waiting on metadata that won't come. */
function playFromStill(v: HTMLVideoElement, lean: boolean) {
  ensureSource(v, lean);
  const resume = () => {
    v.play().catch(() => {
      // Autoplay refused (e.g. iOS Low Power Mode): the poster stays up.
    });
  };
  if (v.dataset.seeked) {
    resume();
    return;
  }
  const seek = () => {
    if (v.dataset.seeked) return;
    v.dataset.seeked = "1";
    const start = Number(v.dataset.start || 0);
    if (Number.isFinite(v.duration) && start > 0) v.currentTime = v.duration * start;
  };
  if (v.readyState >= HTMLMediaElement.HAVE_METADATA) seek();
  else v.addEventListener("loadedmetadata", seek, { once: true });
  resume();
}

/**
 * Every project in one continuous scroll, starting from the one that
 * was clicked: the video, then its text.
 */
export function ProjectReel({ projects, startId, jumpTo, onCurrent, onClose, onScrolled, phase }: Props) {
  const shownRef = useRef(phase === "shown");
  shownRef.current = phase === "shown";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(startId);

  const ordered = useMemo(() => {
    const i = Math.max(0, projects.findIndex((p) => p.id === startId));
    return [...projects.slice(i), ...projects.slice(0, i)];
  }, [projects, startId]);

  // Perspective entry, exit dimming and "which project is current".
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    let wasScrolled = false;
    const update = () => {
      raf = 0;
      const scrolled = scroller.scrollTop > SCROLLED_PX;
      if (scrolled !== wasScrolled) {
        wasScrolled = scrolled;
        onScrolled(scrolled);
      }
      const vh = scroller.clientHeight;
      const probe = vh * 0.45;
      scroller.querySelectorAll<HTMLElement>("[data-reel-id]").forEach((section) => {
        const media = section.querySelector<HTMLElement>(".reel-media");
        if (!media) return;
        const r = media.getBoundingClientRect();
        const enter = clamp01((vh - r.top) / (vh * ENTER_SPAN));
        const tilt = MAX_TILT_DEG * Math.pow(1 - enter, 2);
        const scale = MIN_SCALE + (1 - MIN_SCALE) * enter;
        media.style.transform = `perspective(1400px) rotateX(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        const exit = clamp01((vh * EXIT_SPAN - r.bottom) / (vh * EXIT_SPAN));
        media.style.opacity = String(1 - exit * (1 - EXIT_MIN_OPACITY));
        if (shownRef.current && !section.dataset.in && r.top < vh * TEXT_REVEAL_AT) section.dataset.in = "1";

        const s = section.getBoundingClientRect();
        if (s.top <= probe && s.bottom > probe) {
          const id = section.dataset.reelId!;
          if (id !== currentRef.current) {
            currentRef.current = id;
            onCurrent(id);
          }
        }
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ordered, onCurrent, onScrolled]);

  // Videos start buffering as they near the viewport and autoplay as
  // soon as their card is in view — every card, so it's clear they move.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const lean = isConstrainedNetwork();
    const videos = [...scroller.querySelectorAll<HTMLVideoElement>("video[data-src]")];
    const near = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) ensureSource(e.target as HTMLVideoElement, lean);
        });
      },
      { root: scroller, rootMargin: lean ? PREFETCH_MARGIN_LEAN : PREFETCH_MARGIN },
    );
    const inView = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.intersectionRatio >= PLAY_RATIO && shownRef.current) playFromStill(v, lean);
          else if (e.intersectionRatio < PLAY_RATIO) v.pause();
        });
      },
      { root: scroller, threshold: [0, PLAY_RATIO, 0.6, 1] },
    );
    videos.forEach((v) => {
      near.observe(v);
      inView.observe(v);
    });
    return () => {
      near.disconnect();
      inView.disconnect();
      videos.forEach((v) => v.pause());
    };
  }, [ordered]);

  // Once the match cut lands, start the in-view videos after a beat so
  // the still the tile flew in with is what the eye settles on first.
  useEffect(() => {
    if (phase !== "shown") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reveal = setTimeout(() => {
      const vh = scroller.clientHeight;
      scroller.querySelectorAll<HTMLElement>("[data-reel-id]").forEach((section) => {
        const media = section.querySelector<HTMLElement>(".reel-media");
        if (media && media.getBoundingClientRect().top < vh * TEXT_REVEAL_AT) section.dataset.in = "1";
      });
    }, TEXT_REVEAL_DELAY_MS);
    const t = setTimeout(() => {
      const lean = isConstrainedNetwork();
      const vh = scroller.clientHeight;
      scroller.querySelectorAll<HTMLVideoElement>("video[data-src]").forEach((v) => {
        const r = v.getBoundingClientRect();
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (r.height > 0 && visible / r.height >= PLAY_RATIO) playFromStill(v, lean);
      });
    }, VIDEO_START_DELAY_MS);
    return () => {
      clearTimeout(reveal);
      clearTimeout(t);
    };
  }, [phase]);

  // Menu jumps.
  useEffect(() => {
    if (!jumpTo) return;
    const el = scrollerRef.current?.querySelector<HTMLElement>(`[data-reel-id="${jumpTo.id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [jumpTo]);

  return (
    <div
      ref={scrollerRef}
      data-scroll-momentum
      className={`reel fixed inset-0 z-20 overflow-y-auto overscroll-contain iris-bg reel-${phase}`}
    >
      <div className="pb-[40vh]" style={{ paddingTop: "calc(var(--hdr-h) + 24px)" }}>
        {ordered.map((p, i) => (
          <ReelSection key={p.id} project={p} eager={i === 0} />
        ))}

        <div className="flex flex-col items-center gap-5 px-6 py-24 text-center">
          <p className="label text-[var(--ink-faint)]">That&rsquo;s all {projects.length}</p>
          <button
            type="button"
            onClick={onClose}
            className="display cta-iris rounded-full px-7 py-3.5 text-[22px] leading-none"
          >
            Back to the globe
          </button>
        </div>
      </div>
    </div>
  );
}

function ReelSection({ project, eager }: { project: Project; eager: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const film = filmFor(project);
  const aspect = film.width / film.height;
  const src = film.src;
  const bg = project.masthead?.bg ?? project.thumbnail?.bg ?? "#000";
  const [lean] = useState(isConstrainedNetwork);

  return (
    <section data-reel-id={project.id} aria-labelledby={`reel-${project.id}`} className="px-4 pb-16 sm:px-6">
      <figure
        className="reel-media relative mx-auto overflow-hidden rounded-[10px]"
        style={{
          width: `min(calc(100vw - 32px), calc((100svh - var(--hdr-h) - 64px) * ${aspect.toFixed(4)}), 1320px)`,
          aspectRatio: `${film.width} / ${film.height}`,
          background: bg,
        }}
      >
        {src ? (
          <video
            data-src={src}
            data-start={film.startAt}
            src={eager ? src : undefined}
            poster={film.poster}
            muted
            loop
            playsInline
            preload={eager ? (lean ? "metadata" : "auto") : "none"}
            aria-label={`${project.title} — film`}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <img src={film.poster} alt={project.title} className="absolute inset-0 h-full w-full object-contain" />
        )}
      </figure>

      <div className="reel-copy mx-auto mt-8 grid max-w-[1320px] grid-cols-1 gap-6 md:grid-cols-[1fr_1.15fr] md:gap-12">
        <div>
          <p className="label text-[11px] text-[var(--accent)]">
            {fieldLabel(project)} · {project.client ?? "Independent"} · {project.year}
          </p>
          <h2 id={`reel-${project.id}`} className="display mt-3 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[0.95]">
            {project.title}
          </h2>
          <p className="mt-3 text-[clamp(1.1rem,1.5vw,1.4rem)] font-medium leading-[1.2] tracking-[-0.01em] text-[var(--ink-soft)]">
            {project.tagline}
          </p>
        </div>

        <div className="text-[15px] leading-[1.5]">
          <p>{project.blurb}</p>
          {expanded && (
            <div className="mt-4 space-y-4 text-[var(--ink-soft)]">
              {project.writeup.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="label text-[11px] underline underline-offset-4 hover:text-[var(--accent)]"
            >
              {expanded ? "Show less" : "Read the full story"}
            </button>
            {project.role && <span className="label text-[11px] text-[var(--ink-faint)]">{project.role}</span>}
          </div>
        </div>
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <ul className="reel-copy mx-auto mt-10 grid max-w-[1320px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {project.gallery.map((img) => (
            <li key={img.src} className="reel-still overflow-hidden rounded-[10px]" style={{ background: bg }}>
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
