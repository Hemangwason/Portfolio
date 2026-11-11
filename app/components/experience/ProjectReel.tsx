"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fieldLabel, filmFor, type Project } from "../../data/projects";

type Props = {
  projects: Project[];
  startId: string;
  jumpTo: { id: string; nonce: number } | null;
  onCurrent: (id: string) => void;
  onClose: () => void;
};

/* Entering media rises lying back (top edge away from you) and
   stands up as it reaches the upper third of the screen. */
const ENTER_SPAN = 0.72;
const MAX_TILT_DEG = 34;
const MIN_SCALE = 0.9;
const EXIT_SPAN = 0.4;
const EXIT_MIN_OPACITY = 0.3;
const PLAY_RATIO = 0.35;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Every project in one continuous scroll, starting from the one that
 * was clicked: the video, then its text.
 */
export function ProjectReel({ projects, startId, jumpTo, onCurrent, onClose }: Props) {
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
    const update = () => {
      raf = 0;
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
  }, [ordered, onCurrent]);

  // Videos stream only when near the viewport and play only in view.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const videos = [...scroller.querySelectorAll<HTMLVideoElement>("video[data-src]")];
    const near = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !v.src && v.dataset.src) v.src = v.dataset.src;
        });
      },
      { root: scroller, rootMargin: "60% 0px" },
    );
    const inView = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.intersectionRatio >= PLAY_RATIO) v.play().catch(() => {});
          else v.pause();
        });
      },
      { root: scroller, threshold: [0, PLAY_RATIO, 1] },
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
      className="reel fixed inset-0 z-20 overflow-y-auto overscroll-contain bg-[var(--bg)]"
    >
      <div className="pb-[40vh] pt-[92px]">
        {ordered.map((p, i) => (
          <ReelSection key={p.id} project={p} eager={i === 0} />
        ))}

        <div className="flex flex-col items-center gap-5 px-6 py-24 text-center">
          <p className="label text-[var(--cream-faint)]">That&rsquo;s all {projects.length}</p>
          <button
            type="button"
            onClick={onClose}
            className="display rounded-[4px] bg-[var(--red)] px-6 py-3 text-[24px] leading-none text-white transition-transform hover:scale-[0.97]"
          >
            Back to the board
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

  return (
    <section data-reel-id={project.id} aria-labelledby={`reel-${project.id}`} className="px-4 pb-16 sm:px-6">
      <figure
        className="reel-media relative mx-auto overflow-hidden rounded-[10px]"
        style={{
          width: `min(calc(100vw - 32px), calc((100svh - 200px) * ${aspect.toFixed(4)}), 1320px)`,
          aspectRatio: `${film.width} / ${film.height}`,
          background: bg,
        }}
      >
        {src ? (
          <video
            data-src={src}
            src={eager ? src : undefined}
            poster={film.poster}
            muted
            loop
            playsInline
            preload={eager ? "auto" : "none"}
            autoPlay={eager}
            aria-label={`${project.title} — film`}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <img src={film.poster} alt={project.title} className="absolute inset-0 h-full w-full object-contain" />
        )}
      </figure>

      <div className="mx-auto mt-8 grid max-w-[1320px] grid-cols-1 gap-6 md:grid-cols-[1fr_1.15fr] md:gap-12">
        <div>
          <p className="label text-[11px] text-[var(--red)]">
            {fieldLabel(project)} · {project.client ?? "Independent"} · {project.year}
          </p>
          <h2 id={`reel-${project.id}`} className="display mt-3 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[0.95]">
            {project.title}
          </h2>
          <p className="mt-3 text-[clamp(1.1rem,1.5vw,1.4rem)] font-medium leading-[1.2] tracking-[-0.01em] text-[var(--cream-soft)]">
            {project.tagline}
          </p>
        </div>

        <div className="text-[15px] leading-[1.5]">
          <p>{project.blurb}</p>
          {expanded && (
            <div className="mt-4 space-y-4 text-[var(--cream-soft)]">
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
              className="label text-[11px] underline underline-offset-4 hover:text-[var(--red)]"
            >
              {expanded ? "Show less" : "Read the full story"}
            </button>
            {project.role && <span className="label text-[11px] text-[var(--cream-faint)]">{project.role}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
