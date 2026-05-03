"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import { GradientMesh, variantFor } from "./GradientMesh";

type Props = {
  project: Project;
  index: number;
  onOpen?: () => void;
};

const variantByProject: Record<string, number> = {
  sidetake: 1,
  boomerang: 4,
  jexlin: 2,
  crater: 5,
};

export function ProjectCard({ project, index, onOpen }: Props) {
  const kindLabel = project.kind === "play" ? "VISUALS" : "PRODUCT";
  const kindAccent =
    project.kind === "play" ? "var(--accent)" : "var(--brand)";
  const seed = variantByProject[project.id] ?? index;

  const handleClick = () => onOpen?.();
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    <article
      // content-visibility lets the browser skip layout/paint for off-screen
      // cards. contain-intrinsic-size reserves 420px so the scrollbar doesn't
      // jump as cards below the fold render.
      className="group relative [contain-intrinsic-size:auto_420px] [content-visibility:auto]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKey}
        aria-label={`Open ${project.title}`}
        className="card-hover glass-strong relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        {/* Media */}
        <div
          className="relative aspect-[16/9] w-full overflow-hidden rounded-t-[22px]"
          style={{ backgroundColor: project.thumbnail?.bg ?? "var(--surface)" }}
        >
          <CardMedia project={project} seed={seed} />

          <span
            className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ink)] backdrop-blur-md"
            style={{
              background: "var(--chip-bg)",
              border: "1px solid var(--chip-border)",
            }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: kindAccent }}
            />
            {kindLabel}
            <span className="text-[var(--ink-mute)]">·</span>
            {project.year}
          </span>

          <span
            className="pointer-events-none absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[var(--foreground)] text-[var(--background)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-hidden
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 9 L9 3 M9 3 L4.5 3 M9 3 L9 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-t-[22px] ring-1 ring-inset ring-[var(--border)]"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-[20px] font-semibold leading-tight tracking-tight text-[var(--foreground)]">
              {project.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--ink-soft)]">
              {project.tagline}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-[var(--ink-base)]">
            {project.blurb}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink-base)] backdrop-blur-sm"
                style={{
                  background: "var(--tag-bg)",
                  border: "1px solid var(--tag-border)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CardMedia({
  project,
  seed,
}: {
  project: Project;
  seed: number;
}) {
  const media = project.thumbnail;

  if (media?.type === "video") {
    return <LazyCardVideo src={media.src} poster={media.poster} />;
  }

  if (media?.type === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt ?? project.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <GradientMesh
      variant={variantFor(seed)}
      className="absolute inset-0 h-full w-full"
    />
  );
}

function LazyCardVideo({ src, poster }: { src: string; poster?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldMount(true);
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.4);
      },
      { threshold: [0, 0.4], rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, shouldMount]);

  return (
    <div ref={wrapRef} className="absolute inset-0 h-full w-full">
      {poster && !shouldMount && (
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {shouldMount && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
