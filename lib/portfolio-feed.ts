import { cache } from "react";
import { projects as fallbackProjects, type PortfolioProject } from "@/lib/content";

const defaultFeedUrl = "https://julkar-project-database.julkarnaeem.chatgpt.site/api/portfolio";

type FeedProject = {
  projectCode: string;
  title: string;
  slug: string;
  projectType: string;
  structureCategory: string;
  location: string;
  scope: string;
  software: string;
  areaSqm: string;
  tonnage: string;
  projectSummary: string;
  challenge: string;
  detailingApproach: string;
  fabricationChecks: string;
  deliverables: string[];
  images: string[];
};

const codeFrom = (value: string) => value.replace(/^JN-PRJ-/i, "").padStart(3, "0");
const imageName = (url: string) => decodeURIComponent(url.split("/").pop() || "3D-SCREENSHOT").replace(/\.[a-z0-9]+$/i, "");

function toPortfolioProject(project: FeedProject): PortfolioProject | null {
  if (!project.projectCode || !project.title || !project.slug || project.images.length === 0) return null;
  const code = codeFrom(project.projectCode);
  const glance = [
    project.projectType && ["Visible structure", project.projectType],
    project.structureCategory && ["Structure category", project.structureCategory],
    project.location && ["Location", project.location],
    project.areaSqm && ["Area", project.areaSqm],
    project.tonnage && ["Steel quantity", project.tonnage],
    project.software && ["Model environment", project.software],
    project.scope && ["Scope", project.scope],
  ].filter(Boolean) as string[][];
  const summary = project.projectSummary || `Selected approved model views for ${project.title}.`;
  const images = project.images.map((url) => ({ name: imageName(url), url }));

  return {
    code,
    slug: project.slug,
    title: project.title,
    type: project.projectType || "Structural steel",
    category: project.structureCategory || "Project experience",
    summary,
    overview: summary,
    glance: glance.length ? glance : [["Visible structure", project.title]],
    challenge: project.challenge || "The approved project record does not include a public challenge statement.",
    approach: project.detailingApproach || "The approved project record does not include a public detailing-approach statement.",
    checks: project.fabricationChecks || "Fabrication and constructability checks are recorded only when approved for public use.",
    deliverables: project.deliverables,
    takeaway: project.detailingApproach || project.fabricationChecks || "The public record is limited to approved project information and selected model views.",
    facts: glance.length ? glance : [["Visible structure", project.title]],
    hero: images[0].name,
    images,
    cover: images[0].url,
  };
}

export const getPortfolioProjects = cache(async (): Promise<PortfolioProject[]> => {
  const feedUrl = process.env.PORTFOLIO_FEED_URL?.trim() || defaultFeedUrl;
  try {
    const response = await fetch(feedUrl, { next: { revalidate: 60 } });
    if (!response.ok) return fallbackProjects;
    const data = await response.json() as { projects?: FeedProject[] };
    const managed = (data.projects || []).map(toPortfolioProject).filter((project): project is PortfolioProject => Boolean(project));
    if (managed.length === 0) return fallbackProjects;
    const byCode = new Map(fallbackProjects.map((project) => [project.code, project]));
    managed.forEach((project) => byCode.set(project.code, project));
    return Array.from(byCode.values());
  } catch {
    return fallbackProjects;
  }
});
