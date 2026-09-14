import { isAdmin,sameOrigin,privateHeaders } from "@/lib/admin-auth";
import { readCMS,writeCMS,ConflictError } from "@/lib/cms-store";
import { cmsDocumentSchema } from "@/lib/cms-model";
import { revalidatePath } from "next/cache";
export const runtime="nodejs";
export async function GET(){
  if(!await isAdmin())return Response.json({error:"Sign in to continue."},{status:401,headers:privateHeaders});
  try{return Response.json(await readCMS(),{headers:privateHeaders})}
  catch{return Response.json({error:"Content storage is unavailable. Check the database configuration and migration."},{status:503,headers:privateHeaders})}
}
export async function PUT(request:Request){
  if(!sameOrigin(request)||!await isAdmin())return Response.json({error:"Sign in on this website to save."},{status:403,headers:privateHeaders});
  try{
    const raw=await request.text();
    if(raw.length>2000000)return Response.json({error:"Content is too large."},{status:413,headers:privateHeaders});
    const body=JSON.parse(raw),parsed=cmsDocumentSchema.safeParse(body.document);
    if(!parsed.success||!Number.isSafeInteger(body.revision)||body.revision<0||typeof body.publish!=="boolean")return Response.json({error:parsed.success?"Invalid revision.":parsed.error.issues[0].message},{status:400,headers:privateHeaders});
    const old=await readCMS();
    for(const project of old.published.projects.filter(p=>p.visibility!=="draft")){
      const edited=parsed.data.projects.find(p=>p.code===project.code);
      if(edited&&edited.slug!==project.slug)return Response.json({error:"Existing project URLs are permanent. Create a new project for a different URL."},{status:400,headers:privateHeaders});
      if(!edited)return Response.json({error:"Archive projects instead of deleting them."},{status:400,headers:privateHeaders});
    }
    const state=await writeCMS(parsed.data,body.revision,body.publish);
    if(body.publish)revalidatePath("/","layout");
    return Response.json(state,{headers:privateHeaders});
  }catch(error){return Response.json({error:error instanceof SyntaxError?"Invalid JSON request.":error instanceof ConflictError?error.message:"Your changes could not be saved. They remain in the editor."},{status:error instanceof SyntaxError?400:error instanceof ConflictError?409:503,headers:privateHeaders})}
}
