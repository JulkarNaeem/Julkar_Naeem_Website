import previousProjects from "./project-library-previous.json";
import { initialDocument, type CMSDocument } from "./cms-model";

type Project = CMSDocument["projects"][number];
const previousByCode = new Map(previousProjects.map(project => [project.code, project]));
const updatedByCode = new Map(initialDocument.projects.map(project => [project.code, project]));
const contentFields = ["title", "type", "category", "summary", "overview", "glance", "challenge", "approach", "checks", "takeaway", "facts", "scopeVerified"] as const;

// Upgrade only fields still equal to the previous repository defaults. Owner edits stay intact.
export function upgradeProjectLibrary(document: CMSDocument): CMSDocument {
  let changed = false;
  const projects = document.projects.map(project => {
    const previous = previousByCode.get(project.code);
    const updated = updatedByCode.get(project.code);
    if (!previous || !updated) return project;

    const next: Project = structuredClone(project);
    for (const field of contentFields) {
      if (JSON.stringify(project[field]) === JSON.stringify(previous[field])) {
        (next as unknown as Record<string, unknown>)[field] = structuredClone(updated[field]);
      }
    }

    const replacements = new Map(previous.images.flatMap(oldMedia => {
      const newMedia = updated.images.find(media => media.name === oldMedia.name);
      return newMedia ? [[oldMedia.url, newMedia.url] as const] : [];
    }));
    next.images = project.images.map(media => ({ ...media, url: replacements.get(media.url) ?? media.url }));
    next.cover = replacements.get(project.cover) ?? project.cover;

    if (JSON.stringify(next) !== JSON.stringify(project)) changed = true;
    return next;
  });
  const missingNewProject = !projects.some(project => project.code === "006");
  if (missingNewProject) {
    const newProject = updatedByCode.get("006");
    if (newProject) projects.push(structuredClone(newProject));
  }
  const previousHero = document.settings.heroLead === "Fabrication-ready steel detailing for teams that need"
    && document.settings.heroAccent === "clear, coordinated deliverables.";
  const previousPortfolioDescription = "Explore five structural-steel modelling case studies: PEB framing, multi-storey structures, industrial steel and maintenance walkways.";
  const settings = {
    ...document.settings,
    ...(previousHero ? {heroLead:initialDocument.settings.heroLead,heroAccent:initialDocument.settings.heroAccent} : {}),
    ...(missingNewProject && document.settings.featuredProjectCode === "002" ? {featuredProjectCode:"006"} : {}),
    ...(document.settings.pageInfo.portfolio.description === previousPortfolioDescription ? {
      pageInfo:{...document.settings.pageInfo,portfolio:initialDocument.settings.pageInfo.portfolio}
    } : {})
  };
  return changed || missingNewProject || JSON.stringify(settings) !== JSON.stringify(document.settings)
    ? { ...document, projects, settings } : document;
}
