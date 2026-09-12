import {pageInfo,config} from '@/lib/content';
import {getPortfolioProjects} from '@/lib/portfolio-feed';
export default async function sitemap(){const portfolioProjects=await getPortfolioProjects();return ['/',...Object.keys(pageInfo).map(x=>'/'+x),...portfolioProjects.map(x=>'/portfolio/'+x.slug)].map(path=>({url:config.origin+path,changeFrequency:'monthly' as const,priority:path==='/'?1:path==='/portfolio'?.9:.7}))}
