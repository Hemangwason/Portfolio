"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import { GradientMesh, variantFor } from "./GradientMesh";
import { ProjectIcon } from "./ProjectIcon";

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
  const seed = variantByProject[project.id] ?? index;
  const chipLabel =
    project.chip?.label ??
    project.tags[0] ??
    (project.kind === "play" ? "Play" : "Ground");
  // Brucira pattern: small label above the headline is the parent
  // company / org. Falls back to project title when client isn't set.
  const company = project.client ?? project.title;

  const handleClick = () => onOpen?.();
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    <article className="group relative flex flex-col [contain-intrinsic-size:auto_640px] [content-visibility:auto]">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKey}
        aria-label={`Open ${project.title}`}
        className="card-hover relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        style={{ backgroundColor: project.thumbnail?.bg ?? "var(--surface)" }}
      >
        <CardMedia project={project} seed={seed} />

        {/* Subtle inner ring keeps the rounded edge crisp on photographic thumbs. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-[var(--border)]"
        />

        {/* Category chip — sits bottom-right inside the thumbnail.
            Uses the same bespoke 3D-style icon as the home page bar. */}
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1.5 pr-2.5 text-[11px] font-semibold text-black shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <span
            aria-hidden
            className="leading-none"
            style={{
              filter:
                "drop-shadow(0 1px 1px rgba(15,23,42,0.22)) drop-shadow(0 2px 4px rgba(15,23,42,0.18))",
            }}
          >
            <ProjectIcon id={project.id} size={16} />
          </span>
          <span>{chipLabel}</span>
        </span>

        {/* Hover open-arrow */}
        <span
          className="pointer-events-none absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[var(--foreground)] text-[var(--background)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 9 L9 3 M9 3 L4.5 3 M9 3 L9 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Text block — sits OUTSIDE the card, brucira style. */}
      <div className="mt-5 flex flex-col gap-3 sm:mt-6">
        <p className="text-[15px] font-medium tracking-tight text-[var(--ink)]">
          {company}
        </p>
        <h3 className="max-w-[28ch] text-[clamp(1.4rem,1.9vw,1.85rem)] font-semibold leading-[1.2] tracking-tight text-[var(--foreground)]">
          {project.tagline}
        </h3>
        <div className="mt-1 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-bg)] px-3 py-1 text-[12px] font-medium text-[var(--ink-base)]"
            >
              {t}
            </span>
          ))}
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
