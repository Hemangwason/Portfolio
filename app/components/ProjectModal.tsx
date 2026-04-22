"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../data/projects";
import { GradientMesh, variantFor } from "./GradientMesh";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll lock + ESC close
  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Focus the modal for screen readers
    queueMicrotask(() => contentRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  // Render to a portal on <body> so it overlays everything, regardless of
  // parent stacking contexts / backdrop-filters elsewhere on the page.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.id}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 sm:py-6 md:items-center md:px-6 md:py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${project.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Backdrop */}
          <motion.button
            aria-label="Close project"
            onClick={onClose}
            className="fixed inset-0 -z-10 bg-white/50 backdrop-blur-[18px]"
            style={{ WebkitBackdropFilter: "blur(18px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal card */}
          <motion.div
            ref={contentRef}
            tabIndex={-1}
            className="glass-strong relative my-auto w-full max-w-[560px] overflow-hidden rounded-[20px] outline-none sm:rounded-[22px]"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectModalBody project={project} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ProjectModalBody({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const kindLabel = project.kind === "play" ? "PLAY" : "GROUND";
  const kindAccent =
    project.kind === "play" ? "var(--accent)" : "var(--brand)";

  const meshSeed = getMeshSeed(project.id);

  return (
    <>
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="glass absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full text-black/70 transition-colors hover:bg-black hover:text-white sm:right-4 sm:top-4 sm:h-9 sm:w-9"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 2 L12 12 M12 2 L2 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Masthead */}
      <div className="relative aspect-[5/2] w-full overflow-hidden">
        <MastheadMedia project={project} seed={meshSeed} />

        {/* overlay chip */}
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/80 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-black/75 backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: kindAccent }}
          />
          {kindLabel}
          <span className="text-black/30">·</span>
          {project.year}
        </span>

        {/* subtle inner stroke */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40"
        />
      </div>

      {/* Body */}
      <div className="relative max-h-[68vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 md:max-h-[58vh] md:px-7 md:py-7">
        <header>
          <h2
            id={`modal-title-${project.id}`}
            className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1] tracking-tight text-black"
          >
            {project.title}
          </h2>
          <p className="mt-1.5 text-[14px] text-black/55 md:text-[15px]">
            {project.tagline}
          </p>
        </header>

        {/* Meta grid */}
        <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3 border-y border-black/8 py-4">
          {project.role && (
            <MetaItem label="Role" value={project.role} />
          )}
          {project.client && (
            <MetaItem label="Client" value={project.client} />
          )}
          {project.team && <MetaItem label="Team" value={project.team} />}
          <MetaItem label="Year" value={project.year} />
        </dl>

        {/* Writeup */}
        <div className="mt-6 space-y-4">
          {project.writeup.map((p, i) => (
            <p
              key={i}
              className="text-[14px] leading-relaxed text-black/75 md:text-[15px]"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/8 bg-white/60 px-2.5 py-0.5 text-[11px] font-medium text-black/60 backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>

        {/* External link */}
        {project.link && (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {project.link.label}
            <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-black/85">{value}</dd>
    </div>
  );
}

function MastheadMedia({
  project,
  seed,
}: {
  project: Project;
  seed: number;
}) {
  const media = project.masthead ?? project.thumbnail;

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

  // Fallback: larger gradient mesh with a subtle "video coming" hint
  return (
    <>
      <GradientMesh
        variant={variantFor(seed)}
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 flex items-end justify-start p-5">
        <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/40 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black/70" />
          </span>
          masthead coming soon
        </span>
      </div>
    </>
  );
}

function getMeshSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}
