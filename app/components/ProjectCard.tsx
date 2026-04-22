"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "../data/projects";
import { GradientMesh, variantFor } from "./GradientMesh";

type Props = {
  project: Project;
  index: number;
  onOpen?: () => void;
};

const variantByProject: Record<string, number> = {
  "orbit-os": 1,
  "mango-bank": 4,
  "signal-health": 3,
  lunchbox: 2,
  "sidetake-studio": 5,
  "ferry-wayfinding": 0,
  "mixtape-posters": 5,
  "zine-dispatch": 2,
  "moving-things": 4,
  "tiny-type": 1,
  "hello-stickers": 0,
  "field-notes": 3,
};

export function ProjectCard({ project, index, onOpen }: Props) {
  const reduce = useReducedMotion();
  const kindLabel = project.kind === "play" ? "PLAY" : "GROUND";
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
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
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
        <div className="relative h-48 overflow-hidden">
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
    return (
      <video
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  if (media?.type === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt ?? project.title}
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
