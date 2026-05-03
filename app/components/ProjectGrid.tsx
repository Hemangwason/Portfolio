"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import type { Project } from "../data/projects";

type Props = {
  projects: Project[];
  /** Kept for backward compat — ignored by the staggered layout. */
  className?: string;
};

// Brucira-style staggered 2-column display:
// - Left column: even-indexed projects (0, 2, 4…)
// - Right column: odd-indexed projects (1, 3, 5…), offset down so the
//   columns interlock instead of marching in lockstep.
// Mobile collapses to a single chronological column.
export function ProjectGrid({ projects }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = openId
    ? (projects.find((p) => p.id === openId) ?? null)
    : null;

  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  return (
    <>
      {/* Mobile: single column, chronological order. */}
      <div className="flex flex-col gap-14 lg:hidden">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onOpen={() => setOpenId(project.id)}
          />
        ))}
      </div>

      {/* Desktop: staggered 2-col. */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-x-10 xl:gap-x-14">
        <div className="flex flex-col gap-24 xl:gap-28">
          {left.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i * 2}
              onOpen={() => setOpenId(project.id)}
            />
          ))}
        </div>
        <div className="mt-32 flex flex-col gap-24 xl:gap-28">
          {right.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i * 2 + 1}
              onOpen={() => setOpenId(project.id)}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={openProject} onClose={() => setOpenId(null)} />
    </>
  );
}
