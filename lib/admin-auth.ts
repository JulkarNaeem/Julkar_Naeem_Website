import { cookies } from "next/headers";
import { cookieName,verifySession } from "./admin-security.mjs";
import { sessionSigningHash } from "./admin-oauth.mjs";
export function authConfigured(){
  return Boolean(process.env.ADMIN_PASSWORD_HASH?.match(/^[a-f0-9]+:[a-f0-9]{128}$/i)&&process.env.ADMIN_SESSION_SECRET&&(process.env.ADMIN_SESSION_SECRET.length>=32));
}
export async function isAdmin(){
  const token=(await cookies()).get(cookieName)?.value;
  return authConfigured()&&verifySession(token,process.env.ADMIN_SESSION_SECRET,sessionSigningHash());
}
export function sameOrigin(request:Request){
  const origin=request.headers.get("origin");
  if(!origin)return false;
  try{
    const url=new URL(origin),host=request.headers.get("host")||new URL(request.url).host;
    const allowedHosts=["julkarnaeem.com","www.julkarnaeem.com","admin.julkarnaeem.com",process.env.VERCEL_URL,process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean);
    const permitted=url.protocol==="https:"&&allowedHosts.includes(url.hostname);
    const local=!process.env.VERCEL&&["localhost","127.0.0.1"].includes(url.hostname);
    return (permitted||local)&&url.host===host;
  }catch{return false}
}
export const privateHeaders={"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff"};
