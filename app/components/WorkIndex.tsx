"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "../data/projects";
import { CaseOverlay } from "./CaseOverlay";

/* Hand-interleaved so product and visual work alternate — every case
   carries the same weight in one continuous index. */
const INDEX_ORDER = [
  "sidetake",
  "street-football",
  "sidetalk",
  "zepto-turns-5",
  "boomerang",
  "healthy-high-five",
  "jexlin",
  "asia-cup-2025",
  "crater",
  "halloween-zomato",
  "sid-voice-host",
  "onam",
  "independence-day-banner",
  "raksha-bandhan",
  "goat-offers-bumrah",
  "durga-puja-pandal",
  "zomato-plus-identity",
] as const;

const ordered: Project[] = INDEX_ORDER.map((id) =>
  projects.find((p) => p.id === id),
).filter((p): p is Project => Boolean(p));

export function fieldLabel(p: Project): string {
  return p.kind === "ground" ? "product" : "visual · motion";
}

export function WorkIndex() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openIndex = ordered.findIndex((p) => p.id === openId);
  const openProject = openIndex >= 0 ? ordered[openIndex] : null;

  // Deep link: /?case=<id> opens that case on load; opening/closing
  // keeps the URL in sync without touching the router.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("case");
    if (id && ordered.some((p) => p.id === id)) setOpenId(id);
  }, []);

  const syncUrl = useCallback((id: string | null) => {
    const url = id ? `${window.location.pathname}?case=${id}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, []);

  const open = useCallback(
    (id: string) => {
      setOpenId(id);
      syncUrl(id);
    },
    [syncUrl],
  );

  const close = useCallback(() => {
    setOpenId(null);
    syncUrl(null);
  }, [syncUrl]);

  return (
    <section id="index" aria-labelledby="index-heading" className="relative">
      <header className="flex items-end justify-between gap-4 border-b border-[var(--line)] px-4 pb-4 pt-20 sm:px-6 sm:pt-24">
        <div>
          <p className="hud-label text-[var(--ink-faint)]">02 — the index</p>
          <h2
            id="index-heading"
            className="mt-2 text-[clamp(1.8rem,4.5vw,3.4rem)] font-extrabold uppercase leading-none tracking-[-0.03em]"
          >
            All work, equal weight
          </h2>
        </div>
        <p className="hud-label hidden pb-1 text-[var(--ink-faint)] sm:block">
          {String(ordered.length).padStart(2, "0")} cases · 2025—26
        </p>
      </header>

      {/* column key — desktop only */}
      <div
        aria-hidden
        className="hidden grid-cols-[56px_1fr_72px_48px] gap-4 border-b border-[var(--line)] px-4 py-2 md:grid lg:grid-cols-[72px_1fr_170px_120px_64px_48px] lg:px-6"
      >
        <span className="hud-label text-[var(--ink-mute)]">no.</span>
        <span className="hud-label text-[var(--ink-mute)]">case</span>
        <span className="hud-label hidden text-[var(--ink-mute)] lg:block">field</span>
        <span className="hud-label hidden text-[var(--ink-mute)] lg:block">client</span>
        <span className="hud-label text-[var(--ink-mute)]">year</span>
        <span />
      </div>

      <ol className="relative">
        {ordered.map((p, i) => (
          <IndexRow key={p.id} project={p} index={i} onOpen={() => open(p.id)} />
        ))}
      </ol>

      <HoverPreview />

      <CaseOverlay
        project={openProject}
        caseNumber={openIndex + 1}
        caseCount={ordered.length}
        onClose={close}
        onJump={(id) => open(id)}
        prev={openIndex > 0 ? ordered[openIndex - 1] : null}
        next={openIndex >= 0 && openIndex < ordered.length - 1 ? ordered[openIndex + 1] : null}
      />
    </section>
  );
}

/* ── Row ─────────────────────────────────────────────────────────── */

function IndexRow({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const no = String(index + 1).padStart(2, "0");
  const poster =
    project.thumbnail?.type === "video" ? project.thumbnail.poster : undefined;
  const video =
    project.thumbnail?.type === "video" ? project.thumbnail.src : undefined;

  const announce = (active: boolean) => {
    const detail = active
      ? { id: project.id, poster, video, no, bg: project.thumbnail?.bg }
      : null;
    window.dispatchEvent(new CustomEvent("index-preview", { detail }));
  };

  return (
    <li className="index-row border-b border-[var(--line)]">
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") announce(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") announce(false);
        }}
        className="block w-full text-left"
        aria-label={`Open case ${no}: ${project.title}`}
      >
        {/* amber hover tick */}
        <span
          aria-hidden
          className="row-tick absolute bottom-0 left-0 top-0 w-[3px] bg-[var(--amber)]"
        />

        {/* desktop row */}
        <span className="hidden grid-cols-[56px_1fr_72px_48px] items-center gap-4 px-4 py-6 md:grid lg:grid-cols-[72px_1fr_170px_120px_64px_48px] lg:px-6">
          <span className="font-mono text-[13px] text-[var(--ink-faint)]">{no}</span>
          <span className="min-w-0">
            <span className="row-title block text-[clamp(1.6rem,3.2vw,2.6rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
              {project.title}
            </span>
            <span className="mt-1 block truncate text-[13px] text-[var(--ink-soft)]">
              {project.tagline}
            </span>
          </span>
          <span className="hud-label hidden text-[var(--ink-base)] lg:block">
            {fieldLabel(project)}
          </span>
          <span className="hud-label hidden truncate text-[var(--ink-soft)] lg:block">
            {project.client ?? "independent"}
          </span>
          <span className="font-mono text-[13px] text-[var(--ink-soft)]">{project.year}</span>
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center border border-[var(--line)] text-[var(--ink-soft)] transition-colors group-hover:border-[var(--amber)]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 9.5 L9.5 2.5 M9.5 2.5 H4 M9.5 2.5 V8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>

        {/* mobile row — poster inline since there's no hover */}
        <span className="flex flex-col gap-3 px-4 py-6 md:hidden">
          <span className="flex items-center justify-between">
            <span className="font-mono text-[12px] text-[var(--ink-faint)]">
              {no} / {fieldLabel(project)}
            </span>
            <span className="font-mono text-[12px] text-[var(--ink-soft)]">
              {project.year}
            </span>
          </span>
          {poster && (
            <span
              className="relative block aspect-video w-full overflow-hidden"
              style={{ background: project.thumbnail?.bg ?? "var(--surface)" }}
            >
              <img
                src={poster}
                alt=""
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--line)]" />
            </span>
          )}
          <span className="block text-[1.7rem] font-extrabold uppercase leading-[1.02] tracking-[-0.03em]">
            {project.title}
          </span>
          <span className="block text-[13px] leading-snug text-[var(--ink-soft)]">
            {project.tagline}
          </span>
        </span>
      </button>
    </li>
  );
}

/* ── Floating hover preview ──────────────────────────────────────── */

type PreviewDetail = {
  id: string;
  poster?: string;
  video?: string;
  no: string;
  bg?: string;
} | null;

function HoverPreview() {
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detail, setDetail] = useState<PreviewDetail>(null);

  // Follow the cursor — transform-only writes on rAF.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const el = panelRef.current;
          if (el) {
            const px = Math.min(x + 28, window.innerWidth - 340);
            const py = Math.min(Math.max(y - 90, 60), window.innerHeight - 260);
            el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
          }
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onPreview = (e: Event) => {
      setDetail((e as CustomEvent<PreviewDetail>).detail);
    };
    // pointerleave never fires when the page scrolls out from under
    // the cursor, so a scroll also dismisses the panel.
    const onScroll = () => setDetail(null);
    window.addEventListener("index-preview", onPreview);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("index-preview", onPreview);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Play/pause the clip only while a row is hovered.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (detail?.video) {
      v.src = detail.video;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.removeAttribute("src");
      v.load();
    }
  }, [detail?.video, detail?.id]);

  return (
    <div
      ref={panelRef}
      aria-hidden
      className="index-preview hidden md:block"
      style={{ opacity: detail ? 1 : 0 }}
    >
      <div className="w-[312px] border border-[var(--line-strong)] bg-[var(--surface)] p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
        <div
          className="relative aspect-video w-full overflow-hidden"
          style={{ background: detail?.bg ?? "#101012" }}
        >
          {detail?.poster && (
            <img
              src={detail.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-between px-1.5 py-1">
          <span className="hud-label text-[var(--amber-ink)]">case {detail?.no ?? "—"}</span>
          <span className="hud-label text-[var(--ink-faint)]">click to open</span>
        </div>
      </div>
    </div>
  );
}
