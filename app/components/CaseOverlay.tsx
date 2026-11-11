"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project, ProjectScreen } from "../data/projects";
import { ProjectProcessOverlay } from "./ProjectProcessOverlay";

type Props = {
  project: Project | null;
  caseNumber: number;
  caseCount: number;
  onClose: () => void;
  onJump: (id: string) => void;
  prev: Project | null;
  next: Project | null;
};

/**
 * Full-screen case file. The index stays mounted beneath; this owns
 * the viewport while open — its own scroll, its own HUD header, and
 * a next/previous handoff so cases flow into each other.
 */
export function CaseOverlay({
  project,
  caseNumber,
  caseCount,
  onClose,
  onJump,
  prev,
  next,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showProcess, setShowProcess] = useState(false);

  // Body scroll lock + ESC. The process overlay owns ESC while open.
  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showProcess) onClose();
    };
    window.addEventListener("keydown", onKey);
    queueMicrotask(() => scrollRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose, showProcess]);

  // New case → back to the top of the file, overlays collapsed.
  useEffect(() => {
    setShowProcess(false);
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [project?.id]);

  if (typeof document === "undefined") return null;
  if (!project) return null;

  const no = String(caseNumber).padStart(2, "0");
  const media = project.masthead ?? project.thumbnail;

  return createPortal(
    <>
      <div
        className="case-overlay fixed inset-0 z-[100] bg-[var(--background)]"
        data-open="true"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`case-title-${project.id}`}
      >
        {/* case HUD header */}
        <header className="hud-bar absolute inset-x-0 top-0 z-20 border-b border-[var(--line)]">
          <div className="flex h-[48px] items-center justify-between gap-3 px-4 sm:px-6">
            <p className="hud-label flex items-center gap-2.5 text-[var(--ink-soft)]">
              <span className="text-[var(--amber-ink)]">case {no}/{caseCount}</span>
              <span className="hidden text-[var(--ink-mute)] sm:inline">·</span>
              <span className="hidden truncate sm:inline">{project.title}</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="hud-label flex items-center gap-2 border border-[var(--line)] px-3 py-1.5 text-[var(--ink)] transition-colors hover:border-[var(--amber)] hover:text-[var(--amber-ink)]"
            >
              close
              <span className="hidden text-[var(--ink-mute)] sm:inline">[esc]</span>
            </button>
          </div>
        </header>

        {/* scrollable file */}
        <div
          ref={scrollRef}
          tabIndex={-1}
          data-scroll-momentum
          className="h-full overflow-y-auto overscroll-contain outline-none"
          style={{ paddingTop: "48px" }}
        >
          {/* masthead */}
          <div
            className="relative w-full"
            style={{ background: media?.bg ?? "var(--surface)" }}
          >
            <div className="mx-auto max-w-5xl">
              <div className="relative aspect-video w-full">
                {media?.type === "video" ? (
                  <video
                    key={project.id}
                    src={media.src}
                    poster={media.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : media?.type === "image" ? (
                  <img
                    src={media.src}
                    alt={media.alt ?? project.title}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : null}
              </div>
            </div>
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[var(--line)]" />
          </div>

          <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
            {/* title block */}
            <header className="border-b border-[var(--line)] py-8 sm:py-10">
              <p className="hud-label text-[var(--ink-faint)]">
                {project.kind === "ground" ? "product" : "visual · motion"} · {project.year}
              </p>
              <h2
                id={`case-title-${project.id}`}
                className="mt-3 text-[clamp(2.4rem,7vw,5.2rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.035em]"
              >
                {project.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[var(--ink-base)] sm:text-[18px]">
                {project.tagline}
              </p>
            </header>

            {/* meta grid */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-[var(--line)] py-6 sm:grid-cols-4">
              {project.role && <Meta label="role" value={project.role} />}
              {project.client && (
                <Meta label={(project.clientLabel ?? "client").toLowerCase()} value={project.client} />
              )}
              {project.team && <Meta label="team" value={project.team} />}
              <Meta label="year" value={project.year} />
              <div className="col-span-2 sm:col-span-4">
                <dt className="hud-label text-[var(--ink-faint)]">field</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="hud-label border border-[var(--tag-border)] bg-[var(--tag-bg)] px-2 py-1 text-[var(--ink-base)]"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            {/* writeup */}
            <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-[170px_1fr]">
              <p className="hud-label text-[var(--ink-faint)]">the case</p>
              <div className="max-w-[68ch] space-y-5">
                {project.writeup.map((para, i) => (
                  <p key={i} className="text-[15px] leading-[1.75] text-[var(--ink)] sm:text-[16px]">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* process board CTA */}
            {project.process && (
              <button
                type="button"
                onClick={() => setShowProcess(true)}
                className="group mb-10 flex w-full items-stretch gap-4 border border-[var(--line)] bg-[var(--card)] p-3 text-left transition-colors hover:border-[var(--amber)] sm:p-4"
                aria-label={`Open the design board behind ${project.title}`}
              >
                <span
                  aria-hidden
                  className="relative block h-[72px] w-[104px] shrink-0 overflow-hidden"
                  style={{ background: project.process.bg ?? "#0e0e0e" }}
                >
                  <img
                    src={project.process.poster ?? project.process.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.05]"
                    draggable={false}
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <span className="hud-label text-[var(--amber-ink)]">
                    {project.process.label ?? "the flow"}
                  </span>
                  <span className="text-[15px] font-bold uppercase tracking-[-0.01em] text-[var(--foreground)]">
                    Open the design board
                  </span>
                  <span className="text-[12.5px] text-[var(--ink-soft)]">
                    Explorations, naming, and the screens that landed.
                  </span>
                </span>
                <span
                  aria-hidden
                  className="grid w-10 shrink-0 place-items-center border-l border-[var(--line)] text-[var(--ink-soft)] transition-colors group-hover:text-[var(--amber)]"
                >
                  →
                </span>
              </button>
            )}

            {/* screens */}
            {project.screens && project.screens.length > 0 && (
              <ScreenDossier screens={project.screens} />
            )}

            {/* external link */}
            {project.link && (
              <a
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-label mt-2 inline-flex items-center gap-2 border border-[var(--line-strong)] px-4 py-2.5 text-[var(--foreground)] transition-colors hover:border-[var(--amber)] hover:text-[var(--amber-ink)]"
              >
                {project.link.label} ↗
              </a>
            )}

            {/* flow into the next case */}
            <nav
              aria-label="More cases"
              className="mt-14 grid grid-cols-1 gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2"
            >
              {[
                { p: prev, label: "previous case", dir: "←" },
                { p: next, label: "next case", dir: "→" },
              ].map(({ p, label, dir }) =>
                p ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onJump(p.id)}
                    className="group flex flex-col gap-2 bg-[var(--background)] p-5 text-left transition-colors hover:bg-[var(--surface)] sm:p-6"
                  >
                    <span className="hud-label text-[var(--ink-faint)]">
                      {label} {dir}
                    </span>
                    <span className="text-[clamp(1.3rem,3vw,2rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-[var(--ink-base)] transition-colors group-hover:text-[var(--foreground)]">
                      {p.title}
                    </span>
                  </button>
                ) : (
                  <span key={label} className="hidden bg-[var(--background)] p-6 sm:block" aria-hidden />
                ),
              )}
            </nav>
          </div>
        </div>
      </div>

      <ProjectProcessOverlay
        project={showProcess ? project : null}
        onClose={() => setShowProcess(false)}
      />
    </>,
    document.body,
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="hud-label text-[var(--ink-faint)]">{label}</dt>
      <dd className="mt-1.5 text-[14px] font-medium text-[var(--ink-strong)]">{value}</dd>
    </div>
  );
}

function ScreenDossier({ screens }: { screens: ProjectScreen[] }) {
  return (
    <div className="mb-10 border-t border-[var(--line)] pt-8">
      <p className="hud-label text-[var(--ink-faint)]">screens — problem / rationale</p>
      <div className="mt-6 space-y-10">
        {screens.map((screen, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr] sm:gap-8"
          >
            <img
              src={screen.src}
              alt={screen.title}
              loading="lazy"
              decoding="async"
              className="mx-auto w-[160px] shrink-0 border border-[var(--line)] sm:mx-0 sm:w-[180px]"
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[12px] text-[var(--amber-ink)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="text-[15px] font-bold uppercase tracking-[-0.01em]">
                  {screen.title}
                </h4>
              </div>
              <div className="border border-[var(--line)] p-3.5">
                <p className="hud-label text-[var(--ink-faint)]">problem</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink)]">
                  {screen.problem}
                </p>
              </div>
              <div className="border border-[var(--line)] p-3.5">
                <p className="hud-label text-[var(--ink-faint)]">why this way</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink)]">
                  {screen.rationale}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
