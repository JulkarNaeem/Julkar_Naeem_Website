import { neon } from "@neondatabase/serverless";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { initialDocument, cmsDocumentSchema, type CMSDocument } from "./cms-model";

export type CMSState={revision:number;draft:CMSDocument;published:CMSDocument;updatedAt:string;publishedAt:string|null};
const localFile=path.join(process.cwd(),".local-data","website-cms.json");
export const localStoreEnabled=()=>process.env.CMS_LOCAL_STORE==="1"&&!process.env.VERCEL;
export const storageReady=()=>Boolean(process.env.DATABASE_URL||localStoreEnabled());
const initialState=():CMSState=>({revision:0,draft:structuredClone(initialDocument),published:structuredClone(initialDocument),updatedAt:"",publishedAt:null});
export class ConflictError extends Error {}
export async function readCMS():Promise<CMSState>{
  if(process.env.DATABASE_URL){
    const sql=neon(process.env.DATABASE_URL);
    const rows=await sql.query("SELECT revision,draft,published,updated_at,published_at FROM website_cms WHERE id=1");
    if(!rows.length)return initialState();
    const r=rows[0];
    return {revision:Number(r.revision),draft:cmsDocumentSchema.parse(JSON.parse(r.draft)),published:cmsDocumentSchema.parse(JSON.parse(r.published)),updatedAt:r.updated_at,publishedAt:r.published_at};
  }
  if(!localStoreEnabled())throw new Error("Website database is not configured.");
  try{return JSON.parse(await fs.readFile(localFile,"utf8")) as CMSState}
  catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return initialState();throw e}
}
let writing=Promise.resolve();
export async function writeCMS(doc:CMSDocument,revision:number,publish:boolean):Promise<CMSState>{
  if(process.env.DATABASE_URL){
    const sql=neon(process.env.DATABASE_URL);
    const defaults=JSON.stringify(initialDocument);
    await sql.query("INSERT INTO website_cms(id,revision,draft,published,updated_at) VALUES(1,0,$1,$1,'') ON CONFLICT(id) DO NOTHING",[defaults]);
    const now=new Date().toISOString(),value=JSON.stringify(doc);
    const rows=await sql.query(`WITH previous AS (
      SELECT * FROM website_cms WHERE id=1 AND revision=$1 FOR UPDATE
    ), updated AS (
      UPDATE website_cms SET draft=$2, published=CASE WHEN $3 THEN $2 ELSE website_cms.published END,
      revision=website_cms.revision+1,updated_at=$4,published_at=CASE WHEN $3 THEN $4 ELSE website_cms.published_at END
      FROM previous WHERE website_cms.id=previous.id RETURNING website_cms.*
    ), history AS (
      INSERT INTO website_cms_history(id,revision,payload,created_at) SELECT $5,revision,draft,$4 FROM previous WHERE EXISTS(SELECT 1 FROM updated)
    ) SELECT * FROM updated`,[revision,value,publish,now,randomUUID()]);
    if(!rows.length)throw new ConflictError("Another session saved changes. Reload before saving.");
    const r=rows[0];
    return {revision:Number(r.revision),draft:doc,published:JSON.parse(r.published),updatedAt:r.updated_at,publishedAt:r.published_at};
  }
  if(!localStoreEnabled())throw new Error("Website database is not configured.");
  let result!:CMSState;
  const job=writing.then(async()=>{
    const current=await readCMS();
    if(current.revision!==revision)throw new ConflictError("Another session saved changes. Reload before saving.");
    const now=new Date().toISOString();
    result={revision:revision+1,draft:doc,published:publish?doc:current.published,updatedAt:now,publishedAt:publish?now:current.publishedAt};
    await fs.mkdir(path.dirname(localFile),{recursive:true});
    if(current.revision>0)await fs.writeFile(localFile+".revision-"+current.revision,JSON.stringify(current));
    const temp=localFile+"."+randomUUID()+".tmp";
    await fs.writeFile(temp,JSON.stringify(result,null,2),{mode:0o600});
    await fs.rename(temp,localFile);
  });
  writing=job.catch(()=>{});
  await job;return result;
}
export async function consumeOAuthState(key:string,expiresAt:number):Promise<boolean>{
  if(!/^[a-f0-9]{64}$/.test(key)||!Number.isFinite(expiresAt)||expiresAt<=Date.now())return false;
  if(process.env.DATABASE_URL){
    const sql=neon(process.env.DATABASE_URL);
    await sql.query("DELETE FROM website_admin_oauth_states WHERE expires_at < $1",[Date.now()]);
    const rows=await sql.query("INSERT INTO website_admin_oauth_states(key,expires_at) VALUES($1,$2) ON CONFLICT(key) DO NOTHING RETURNING key",[key,expiresAt]);
    return rows.length===1;
  }
  if(!localStoreEnabled())return false;
  const folder=path.join(process.cwd(),".local-data","oauth-states");
  await fs.mkdir(folder,{recursive:true});
  try{
    // Exclusive creation also rejects parallel callbacks in local verification.
    await fs.writeFile(path.join(folder,key),String(expiresAt),{flag:"wx",mode:0o600});
    return true;
  }catch(error){if((error as NodeJS.ErrnoException).code==="EEXIST")return false;throw error}
}
export async function loginAttempt(key:string):Promise<boolean>{
  const bucket=Math.floor(Date.now()/900000);
  if(process.env.DATABASE_URL){
    const sql=neon(process.env.DATABASE_URL);
    const rows=await sql.query("INSERT INTO website_admin_attempts(key,bucket,attempts) VALUES($1,$2,1) ON CONFLICT(key) DO UPDATE SET bucket=$2,attempts=CASE WHEN website_admin_attempts.bucket=$2 THEN website_admin_attempts.attempts+1 ELSE 1 END RETURNING attempts",[key,bucket]);
    return Number(rows[0].attempts)<=10;
  }
  if(!localStoreEnabled())return false;
  const attemptsFile=path.join(process.cwd(),".local-data","admin-attempts.json");
  await fs.mkdir(path.dirname(attemptsFile),{recursive:true});
  const data=JSON.parse(await fs.readFile(attemptsFile,"utf8").catch(()=>"{}"));
  const prev=data[key]; data[key]={bucket,count:prev?.bucket===bucket?prev.count+1:1};
  await fs.writeFile(attemptsFile,JSON.stringify(data),{mode:0o600});
  return data[key].count<=10;
}
