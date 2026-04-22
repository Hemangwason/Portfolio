"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import type { Project } from "../data/projects";

type Props = {
  projects: Project[];
  className?: string;
};

export function ProjectGrid({ projects, className }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = openId
    ? (projects.find((p) => p.id === openId) ?? null)
    : null;

  return (
    <>
      <div
        className={
          className ??
          "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        }
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onOpen={() => setOpenId(project.id)}
          />
        ))}
      </div>
      <ProjectModal project={openProject} onClose={() => setOpenId(null)} />
    </>
  );
}
