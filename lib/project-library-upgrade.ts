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
  const previousHero = document.settings.heroLead === "Fabrication-ready steel detailing for teams that need"
    && document.settings.heroAccent === "clear, coordinated deliverables.";
  const settings = previousHero
    ? { ...document.settings, heroLead: initialDocument.settings.heroLead, heroAccent: initialDocument.settings.heroAccent }
    : document.settings;
  return changed || previousHero ? { ...document, projects, settings } : document;
}
