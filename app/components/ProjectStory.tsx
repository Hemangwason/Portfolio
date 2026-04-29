"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { Project } from "../data/projects";
import { ProjectModal } from "./ProjectModal";

type Props = {
  projects: Project[];
};

// One full-bleed color per project — chosen as the dominant tone OF that
// project (Sidetake's indigo, Jexlin's wheat, Crater's slate, Bumrah's
// rose, etc.). Each chapter section paints with this color edge to edge,
// then gradients into the NEXT chapter's color over the bottom 25% so the
// scroll reads as a continuous color river instead of stacked cards.
//
// Tones are picked moderate-light enough that the existing dark text and
// black "Read the story" pill stay readable on every chapter — saves us
// from per-chapter contrast inversions.
const CHAPTER_BG: Record<string, string> = {
  sidetake: "#D7CFF0",                // soft violet (dark indigo IRL)
  sidetalk: "#E0E6F1",                // soft cloud blue
  boomerang: "#D9D2EF",               // lavender
  jexlin: "#EEDDC0",                  // warm wheat
  crater: "#CDD3DB",                  // cool slate
  "sid-voice-host": "#D6DEF1",        // periwinkle
  "healthy-high-five": "#CBE4B5",     // soft sage
  "independence-day-banner": "#B5DDED", // bright sky
  "asia-cup-2025": "#C4CBE6",         // cornflower mist
  "goat-offers-bumrah": "#F0C8CD",    // blush rose
  "durga-puja-pandal": "#F6CC8E",     // marigold
  "zomato-plus-identity": "#DCD5C7",  // warm taupe
};

// Fallback palette for any project that doesn't have a curated bg.
const CHAPTER_BG_FALLBACK = [
  "#D7CFF0",
  "#E0E6F1",
  "#D9D2EF",
  "#EEDDC0",
  "#CDD3DB",
  "#D6DEF1",
  "#CBE4B5",
  "#B5DDED",
  "#C4CBE6",
  "#F0C8CD",
  "#F6CC8E",
  "#DCD5C7",
];

function bgForProject(p: Project, index: number): string {
  return (
    CHAPTER_BG[p.id] ??
    CHAPTER_BG_FALLBACK[index % CHAPTER_BG_FALLBACK.length]
  );
}

// Fade bookend = the adjacent chapter color with 0 alpha. CSS interpolates
// the gradient stop from "first-chapter color, fully transparent" to
// "first-chapter color, fully opaque" — the hue stays steady while alpha
// ramps, so the body's bg shows through the top/bottom of the river
// instead of a hard white slab. Eliminates the seam between the story's
// gradient and the surrounding sections.
function fadeBookend(hex: string): string {
  const h = hex.replace("#", "");
  return `#${h}00`;
}

// One project per viewport. Each section is a "chapter" — big media stage on
// one side, story copy on the other, with a huge chapter-number watermark in
// the negative space. Layout flips every other chapter so the eye is forced
// to re-engage with each scroll instead of pattern-matching down the page.
export function ProjectStory({ projects }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = openId
    ? (projects.find((p) => p.id === openId) ?? null)
    : null;

  const colors = projects.map((p, i) => bgForProject(p, i));

  // ONE continuous gradient covering the entire story container, with each
  // chapter's color pinned to its own center. CSS interpolates linearly
  // between adjacent stops, so the bg is literally one uninterrupted
  // gradient — no section has its own background, no seams to mismatch,
  // no hard edges anywhere. Bookends fade the same hue to alpha 0 so the
  // body bg shows through the top/bottom edges with no hard color step.
  const stops = [`${fadeBookend(colors[0])} 0%`];
  colors.forEach((c, i) => {
    const pct = ((i + 0.5) / colors.length) * 100;
    stops.push(`${c} ${pct.toFixed(2)}%`);
  });
  stops.push(`${fadeBookend(colors[colors.length - 1])} 100%`);
  const riverGradient = `linear-gradient(to bottom, ${stops.join(", ")})`;

  return (
    <>
      <div
        className="relative"
        style={{ backgroundImage: riverGradient }}
      >
        {projects.map((p, i) => (
          <ProjectChapter
            key={p.id}
            project={p}
            index={i}
            total={projects.length}
            onOpen={() => setOpenId(p.id)}
          />
        ))}
      </div>
      <ChapterRail projects={projects} tints={colors} />
      <ProjectModal project={openProject} onClose={() => setOpenId(null)} />
    </>
  );
}

// Sticky right-edge progress rail. One small mark per chapter; the active
// one expands and adopts the chapter's tint. Hover any mark to peek the
// project name; click to scroll the chapter into view. Hidden under lg
// breakpoints so it never crowds the mobile reading column.
function ChapterRail({
  projects,
  tints,
}: {
  projects: Project[];
  tints: string[];
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    // One observer per chapter; rootMargin shrinks the trigger band to the
    // middle 40% of the viewport so "active" only flips when a chapter is
    // genuinely centered, not just peeking in.
    const observers = projects.map((p, i) => {
      const el = document.querySelector(
        `section[aria-labelledby="chapter-title-${p.id}"]`,
      );
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActive(i);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [projects]);

  const onJump = (id: string) => {
    const el = document.querySelector(
      `section[aria-labelledby="chapter-title-${id}"]`,
    );
    if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Chapter navigation"
      className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
    >
      <span className="pointer-events-none mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
        {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
      </span>
      {projects.map((p, i) => {
        const isActive = active === i;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onJump(p.id)}
            aria-label={`Chapter ${i + 1}: ${p.title}`}
            aria-current={isActive ? "true" : undefined}
            className="pointer-events-auto group relative flex items-center justify-end gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          >
            <span className="pointer-events-none whitespace-nowrap rounded-full bg-black/85 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100">
              {p.title}
            </span>
            <span
              className="block rounded-full transition-all duration-300 ease-out"
              style={
                isActive
                  ? {
                      height: "22px",
                      width: "3px",
                      background: tints[i],
                    }
                  : {
                      height: "5px",
                      width: "5px",
                      background: "rgba(10,10,10,0.22)",
                    }
              }
            />
          </button>
        );
      })}
    </nav>
  );
}

function ProjectChapter({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const flipped = index % 2 === 1;

  const chapterNum = String(index + 1).padStart(2, "0");
  const totalNum = String(total).padStart(2, "0");
  const kindLabel = project.kind === "play" ? "VISUALS" : "PRODUCT";
  const kindAccent =
    project.kind === "play" ? "var(--accent)" : "var(--brand)";

  // Lighter parallax — translateY only. The previous setup ran translate
  // + scale + rotate per chapter (5 useTransforms × 12 chapters = 60
  // animated values per scroll frame), which thrashed paint on slower
  // devices. translateY alone composites cheaply on the GPU layer and
  // still sells the depth cue when paired with the watermark drift.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const stageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [60, -60],
  );
  const watermarkY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [120, -120],
  );
  const watermarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    reduce ? [0.04, 0.04, 0.04, 0.04] : [0, 0.045, 0.045, 0],
  );

  // No per-section background. The parent container paints one
  // continuous gradient that runs through every chapter — sections are
  // transparent so that gradient shows through uninterrupted, with zero
  // seams between chapters.
  return (
    <section
      ref={sectionRef}
      aria-labelledby={`chapter-title-${project.id}`}
      // content-visibility:auto + reserved size lets the browser skip
      // layout/paint for chapters not currently in (or near) the viewport.
      // With 12 chapters that's a real win on long scrolls.
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 720px" }}
      className="relative flex min-h-[88svh] w-full items-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16"
    >
      {/* Massive chapter-number watermark — graphic anchor, not text.
         Opacity is scroll-mapped so the number quietly fades in when the
         chapter approaches center and fades out as it leaves. */}
      <motion.span
        aria-hidden
        style={{ y: watermarkY, opacity: watermarkOpacity, color: "#000" }}
        className={`pointer-events-none absolute select-none font-mono font-bold leading-none tracking-tighter ${
          flipped
            ? "right-[-2vw] top-[8vh]"
            : "left-[-2vw] top-[8vh]"
        }`}
      >
        <span className="block text-[clamp(11rem,26vw,24rem)]">
          {chapterNum}
        </span>
      </motion.span>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-14">
          {/* Media stage */}
          <motion.div
            className={`md:col-span-7 ${flipped ? "md:order-2" : "md:order-1"}`}
            style={{ y: stageY, willChange: "transform" }}
          >
            <motion.div
              role="button"
              tabIndex={0}
              aria-label={`Open ${project.title}`}
              onClick={onOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen();
                }
              }}
              initial={{
                opacity: 0,
                y: 60,
                // Media slides in from the side it lives on — left chapters
                // arrive from slightly left, right chapters from slightly
                // right. Subtle, but turns each scroll into a real transition.
                x: reduce ? 0 : flipped ? 30 : -30,
              }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as const }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="glass-strong group relative cursor-pointer overflow-hidden rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
            >
              <div
                className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px]"
                style={{
                  backgroundColor: project.thumbnail?.bg ?? "rgba(0,0,0,0.04)",
                }}
              >
                <ChapterMedia project={project} />

                {/* meta chip */}
                <span className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/80 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-black/75 backdrop-blur-md">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: kindAccent }}
                  />
                  {kindLabel}
                  <span className="text-black/30">·</span>
                  {project.year}
                </span>

                {/* hover-only open glyph */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-black/80 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
                >
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M3 9 L9 3 M9 3 L4.5 3 M9 3 L9 7.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/40"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Story copy */}
          <div
            className={`md:col-span-5 ${flipped ? "md:order-1" : "md:order-2"}`}
          >
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.15 },
                },
              }}
              className="flex flex-col gap-5"
            >
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-black/45"
              >
                <span className="text-black/80">{chapterNum}</span>
                <span
                  aria-hidden
                  className="inline-block h-px w-8 bg-black/20"
                />
                <span>chapter {chapterNum} / {totalNum}</span>
              </motion.div>

              <motion.h3
                id={`chapter-title-${project.id}`}
                variants={titleStagger}
                className="text-[clamp(2.4rem,5.4vw,3.8rem)] font-semibold leading-[0.95] tracking-tight text-black"
              >
                {/* Word-by-word reveal — each word slides up + fades in
                   on its own delay so the title arrives as a phrase, not
                   a single block. The whitespace between words is kept
                   inline so the line wraps naturally. */}
                {project.title.split(" ").map((word, i, arr) => (
                  <span
                    key={`${word}-${i}`}
                    className="inline-block overflow-hidden align-baseline"
                  >
                    <motion.span
                      variants={titleWord}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                    {i < arr.length - 1 && (
                      <span className="inline-block">&nbsp;</span>
                    )}
                  </span>
                ))}
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="text-[clamp(1.05rem,1.6vw,1.25rem)] font-medium leading-snug text-black/55"
              >
                {project.tagline}
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-[15px] leading-relaxed text-black/70 md:text-base"
              >
                {project.blurb}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-1.5"
              >
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/8 bg-white/60 px-2.5 py-0.5 text-[11px] font-medium text-black/60 backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={onOpen}
                  className="inline-flex items-center gap-2 self-start rounded-full bg-black px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Read the story
                  <span aria-hidden>→</span>
                </button>
                {(project.role || project.client) && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                    {[project.role, project.client]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// The title acts as a stagger parent over its own words. delayChildren
// hands the parent's reveal moment off to the first word; staggerChildren
// makes each subsequent word arrive a beat after the previous one.
const titleStagger = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const titleWord = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};


// Same lazy-video pattern as ProjectCard — poster-first, only mount the
// <video> when within 200px of the viewport, only play when 30%+ visible.
// Keeps a 13-chapter scroll cheap on phones.
function ChapterMedia({ project }: { project: Project }) {
  const media = project.thumbnail;
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
        setInView(
          entry.isIntersecting && entry.intersectionRatio >= 0.3,
        );
      },
      { threshold: [0, 0.3], rootMargin: "200px" },
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

  if (!media) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-black/[0.04] to-black/[0.08]">
        <span className="text-7xl">{project.emoji}</span>
      </div>
    );
  }

  if (media.type === "image") {
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
    <div ref={wrapRef} className="absolute inset-0 h-full w-full">
      {media.poster && !shouldMount && (
        <img
          src={media.poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {shouldMount && (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
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
