import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Experience } from "../../components/experience/Experience";
import { showcase, stillFor } from "../../data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return showcase.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = showcase.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.title} — Hemang Wason`,
    description: project.blurb,
    openGraph: { images: [stillFor(project.id).src] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!showcase.some((p) => p.id === id)) notFound();
  return <Experience initialView="project" initialProject={id} />;
}
