import { cache } from "react";
import { getPublishedContent } from "./managed-content";
import { publicProjects } from "./cms-model";
// The website and /admin now read the same content store. No external dashboard feed.
export const getPortfolioProjects=cache(async()=>publicProjects(await getPublishedContent()));
