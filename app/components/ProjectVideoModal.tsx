"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { Project } from "../data/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
  onKnowMore: () => void;
};

// Stage-1 modal. Cinematic-first: the video occupies most of the
// screen, with just enough title + chip to anchor it. The "Know more"
// button hands off to the long-form ProjectModal — keeping the read
// flow optional rather than forced.
export function ProjectVideoModal({ project, onClose, onKnowMore }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    queueMicrotask(() => contentRef.current?.focus());

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (typeof document === "undefined" || !project) return null;

  // No AnimatePresence wrapper. We want the video modal to disappear
  // *immediately* when the parent flips to the writeup modal — the
  // writeup modal's own entry animation covers the visual handoff,
  // and unmounting cleanly avoids any stacked-portal weirdness.
  return createPortal(
    <motion.div
      key={project.id}
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`videomodal-title-${project.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <button
        type="button"
        aria-label="Close project"
        onClick={onClose}
        className="fixed inset-0 -z-10 bg-black/70 backdrop-blur-[14px]"
        style={{ WebkitBackdropFilter: "blur(14px)" }}
      />

      <motion.div
        ref={contentRef}
        tabIndex={-1}
        // Constrain the whole stack to the viewport. The video gets
        // `flex-1 min-h-0` so it shrinks to fit; the title/CTA row is
        // its natural height, sitting *below* the video — never
        // overlapping it. Without `min-h-0`, flex-1 children of a
        // flex-col container don't actually shrink and the video
        // would push the title bar off-screen, which is what was
        // happening in the previous layout.
        className="relative flex h-full max-h-[min(82vh,720px)] w-full max-w-[1100px] flex-col gap-4 outline-none sm:gap-5"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <VideoModalBody
          project={project}
          onClose={onClose}
          onKnowMore={onKnowMore}
        />
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function VideoModalBody({
  project,
  onClose,
  onKnowMore,
}: {
  project: Project;
  onClose: () => void;
  onKnowMore: () => void;
}) {
  const kindLabel = project.kind === "play" ? "VISUALS" : "PRODUCT";
  const kindAccent =
    project.kind === "play" ? "var(--accent)" : "var(--brand)";

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-0 top-0 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors hover:bg-white/22 sm:h-11 sm:w-11"
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

      {/* Video frame fills the available flex space (capped by parent
          max-h). object-contain keeps the original aspect intact. The
          `min-h-0` is the missing-piece flex hack — without it the
          frame refuses to shrink. */}
      <div
        className="relative w-full flex-1 min-h-0 overflow-hidden rounded-[18px] sm:rounded-[22px]"
        style={{
          backgroundColor:
            project.masthead?.bg ?? project.thumbnail?.bg ?? "#0a0a0a",
        }}
      >
        <VideoMedia project={project} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/10 sm:rounded-[22px]"
        />
      </div>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: kindAccent }}
            />
            {kindLabel}
            <span className="text-white/40">·</span>
            {project.year}
          </span>
          <h2
            id={`videomodal-title-${project.id}`}
            className="mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-white"
          >
            {project.title}
          </h2>
          <p className="mt-1.5 max-w-xl text-[14px] text-white/65 sm:text-[15px]">
            {project.tagline}
          </p>
        </div>

        <button
          type="button"
          onClick={onKnowMore}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-black transition-transform hover:-translate-y-0.5 sm:text-[14px]"
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
    </>
  );
}

// Autoplay the masthead (or thumbnail) video. Modal mounts means the
// user has actively chosen this project — no need for the lazy/in-view
// ceremony we use on the grid; just play.
function VideoMedia({ project }: { project: Project }) {
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
        className="absolute inset-0 h-full w-full object-contain"
      />
    );
  }

  if (media?.type === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt ?? project.title}
        className="absolute inset-0 h-full w-full object-contain"
      />
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-white/[0.04] to-white/[0.08]">
      <span className="text-7xl">{project.emoji}</span>
    </div>
  );
}
