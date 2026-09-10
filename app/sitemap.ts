import {projects,pageInfo,config} from '@/lib/content';
export default function sitemap(){return ['/',...Object.keys(pageInfo).map(x=>'/'+x),...projects.map(x=>'/portfolio/'+x.slug)].map(path=>({url:config.origin+path,changeFrequency:'monthly' as const,priority:path==='/'?1:path==='/portfolio'?.9:.7}))}
