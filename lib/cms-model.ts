import { z } from "zod";
import { config, projects, services, pageInfo, type PortfolioProject } from "./content";

export const isVideoUrl = (value: string) => {
  if (!value || typeof value !== "string") return false;
  return /\.(mp4|webm|mov|ogg|m4v|mkv)(\?.*)?$/i.test(value) || /\/video\/upload\//i.test(value);
};

export const approvedMediaUrl = (value: string) => {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const u = new URL(trimmed);
    return (u.protocol === "https:" || u.protocol === "http:") && !u.username && !u.password;
  } catch { return false; }
};
const text = z.string().trim().max(8000);
const short = z.string().trim().max(200);
const pair = z.tuple([short.min(1), short.min(1)]);
const image = z.object({name:short.min(1),url:z.string().max(2000).refine(approvedMediaUrl,"Use a valid image or video URL.")});
export const cmsProjectSchema = z.object({
  code:z.string().regex(/^\d{3,6}$/,"Use a numeric project code, e.g. 006."),
  slug:z.string().max(120).regex(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/),
  title:short,type:short,category:short,
  summary:text,overview:text,challenge:text,approach:text,checks:text,takeaway:text,
  glance:z.array(pair).max(20),facts:z.array(pair).max(20),
  deliverables:z.array(short.min(1)).max(30),
  hero:short,images:z.array(image).max(40),cover:z.string().max(2000),
  approved:z.boolean(),visibility:z.enum(["draft","published","archived"]),
  scopeVerified:z.boolean(),deliverablesVerified:z.boolean()
}).superRefine((p,ctx)=>{
  if(p.visibility==="published" && [p.slug,p.title,p.type,p.category,p.summary,p.overview].some(v=>!v)){
    ctx.addIssue({code:"custom",message:"Published projects need a title, URL, type, category, summary and overview."});
  }
  if(p.visibility==="published" && (!p.approved||!p.images.length||!approvedMediaUrl(p.cover)||!p.images.some(x=>x.url===p.cover))){
    ctx.addIssue({code:"custom",path:["approved"],message:"Publishing requires approval and a cover selected from the gallery."});
  }
});
const social=(domain:string)=>z.string().max(1000).refine(v=>!v||(()=>{try{const u=new URL(v);return u.protocol==="https:"&&(u.hostname===domain||u.hostname==="www."+domain)&&!u.username&&!u.password}catch{return false}})(),"Use the correct HTTPS profile URL.");
export const cmsSettingsSchema=z.object({
  heroLead:text.min(1),heroAccent:text.min(1),heroIntro:text.min(1),
  aboutIntro:text.min(1),ctaTitle:text.min(1),
  professionalEmails:z.array(z.string().email()).max(3),
  whatsappNumber:z.string().regex(/^(\+[1-9]\d{7,14})?$/,"Use an international number, e.g. +880…"),
  linkedInUrl:social("linkedin.com"),upworkUrl:social("upwork.com"),instagramUrl:social("instagram.com"),
  services:z.array(z.object({id:short,title:short.min(1),text:text.min(1),image:short})).length(6),
  pageInfo:z.record(z.object({title:short.min(1),description:z.string().trim().min(1).max(350)}))
});
export const cmsDocumentSchema=z.object({projects:z.array(cmsProjectSchema).max(200),settings:cmsSettingsSchema}).superRefine((d,ctx)=>{
  for(const key of ["code","slug"] as const){const values=d.projects.map(p=>p[key]).filter(Boolean);if(new Set(values).size!==values.length)ctx.addIssue({code:"custom",path:["projects"],message:"Project codes and URLs must be unique."});}
  if(d.settings.services.some((s,i)=>s.id!==services[i].id||s.image!==services[i].image))ctx.addIssue({code:"custom",message:"Service routes and illustration references cannot change."});
  if(Object.keys(d.settings.pageInfo).sort().join()!==Object.keys(pageInfo).sort().join())ctx.addIssue({code:"custom",message:"Keep the existing page routes."});
});
export type CMSProject=z.infer<typeof cmsProjectSchema>;
export type CMSDocument=z.infer<typeof cmsDocumentSchema>;
export const initialDocument:CMSDocument={
  projects:projects.map(p=>({...p,glance:p.glance.map(([a,b]):[string,string]=>[a,b]),facts:p.facts.map(([a,b]):[string,string]=>[a,b]),approved:true,visibility:"published",scopeVerified:p.code==="001",deliverablesVerified:p.code==="001"})),
  settings:{
    heroLead:"Fabrication-ready steel detailing for teams that need",
    heroAccent:"clear, coordinated deliverables.",
    heroIntro:"I support steel fabricators, engineering teams and contractors with coordinated Tekla models, shop drawings, erection drawings, connection detailing and material reports.",
    aboutIntro:"Based in Dhaka, Bangladesh, I bring around nine years across steel, construction, production, QA and operations, including more than four years focused on structural-steel detailing.",
    ctaTitle:"Need reliable detailing capacity for an upcoming steel project?",
    professionalEmails:config.professionalEmails,whatsappNumber:config.whatsappNumber,
    linkedInUrl:config.linkedInUrl,upworkUrl:config.upworkUrl,instagramUrl:config.instagramUrl,
    services,pageInfo
  }
};
export function publicProjects(doc:CMSDocument):PortfolioProject[]{
  return doc.projects.filter(p=>p.visibility==="published"&&p.approved&&p.images.length&&approvedMediaUrl(p.cover))
    .map(p=>({...p,facts:p.facts.length?p.facts:[["Structure",p.category]],glance:p.glance.length?p.glance:[["Structure",p.category]]}));
}
export function contactConfig(settings:CMSDocument["settings"]){
  return {...config,...settings,professionalEmail:settings.professionalEmails[0]||"",email:settings.professionalEmails[0]||"",
    socials:[{name:"LinkedIn",url:settings.linkedInUrl},{name:"Upwork",url:settings.upworkUrl},{name:"Instagram",url:settings.instagramUrl}].filter(s=>s.url),
    whatsapp:settings.whatsappNumber?"https://wa.me/"+settings.whatsappNumber.replace(/\D/g,""):""};
}
