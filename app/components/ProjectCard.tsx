"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();
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
    <motion.article
      // content-visibility lets the browser skip layout/paint for off-screen
      // cards. contain-intrinsic-size reserves 420px so the scrollbar doesn't
      // jump as cards below the fold render. Big win on the homepage's 11-card
      // grid on low-end phones.
      className="group relative [contain-intrinsic-size:auto_420px] [content-visibility:auto]"
    >
      <motion.div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKey}
        aria-label={`Open ${project.title}`}
        className="glass-strong relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
        whileHover={reduce ? undefined : { y: -5 }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Media area */}
        <div className="relative h-48 overflow-hidden bg-black/[0.04]">
          <CardMedia project={project} seed={seed} />

          {/* floating meta chip */}
          <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/70 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-black/75 backdrop-blur-md">
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: kindAccent }}
            />
            {kindLabel}
            <span className="text-black/30">·</span>
            {project.year}
          </span>

          {/* open affordance — peeks on hover */}
          <span
            className="pointer-events-none absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-all duration-300 group-hover:-translate-y-0 group-hover:opacity-100"
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

          {/* subtle inner stroke */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-t-[22px] ring-1 ring-inset ring-white/40"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-[20px] font-semibold leading-tight tracking-tight text-black">
              {project.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-black/50">
              {project.tagline}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-black/65">
            {project.blurb}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/8 bg-white/60 px-2.5 py-0.5 text-[11px] font-medium text-black/60 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.article>
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
        className="absolute inset-0 h-full w-full object-contain"
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

// Poster-first, deferred-mount video card. The <video> element doesn't even
// enter the DOM until the card is within 200px of the viewport — so 11 cards
// on the home page don't mean 11 decoders + 11 network fetches on load. Once
// mounted, preload="none" keeps the network quiet until the user is actually
// looking at it (40%+ in view), and we pause when they scroll away. The
// static poster image carries the visual the whole time.
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
        // Once the card has come near the viewport, keep the video mounted
        // so we don't flap DOM nodes on minor scrolls.
        if (entry.isIntersecting) setShouldMount(true);
        // Only actually play when the card is meaningfully visible — keeps
        // concurrent decoders down on phones in a 2-col grid.
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
          className="absolute inset-0 h-full w-full object-contain"
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
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
    </div>
  );
}
