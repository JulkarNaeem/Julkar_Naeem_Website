import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { cookieName,passwordMatches,signSession } from "@/lib/admin-security.mjs";
import { authConfigured,sameOrigin,privateHeaders } from "@/lib/admin-auth";
import { loginAttempt,storageReady } from "@/lib/cms-store";
import { sessionSigningHash } from "@/lib/admin-oauth.mjs";
export const runtime="nodejs";
export async function POST(request:Request){
  if(!sameOrigin(request))return NextResponse.json({error:"Use this website to sign in."},{status:403,headers:privateHeaders});
  if(!authConfigured()||!storageReady())return NextResponse.json({error:"Administrator access is not configured yet."},{status:503,headers:privateHeaders});
  try{
    const raw=await request.text();
    if(raw.length>1024)return NextResponse.json({error:"Invalid sign-in request."},{status:400,headers:privateHeaders});
    const {password}=JSON.parse(raw);
    const ip=process.env.VERCEL?request.headers.get("x-forwarded-for")?.split(",")[0]||"unknown":"local";
    const key=createHash("sha256").update(ip+process.env.ADMIN_SESSION_SECRET).digest("hex");
    if(!await loginAttempt(key))return NextResponse.json({error:"Too many attempts. Try again in 15 minutes."},{status:429,headers:privateHeaders});
    if(!passwordMatches(password,process.env.ADMIN_PASSWORD_HASH))return NextResponse.json({error:"The password is incorrect."},{status:401,headers:privateHeaders});
    const response=NextResponse.json({ok:true},{headers:privateHeaders});
    response.cookies.set(cookieName,signSession(process.env.ADMIN_SESSION_SECRET,sessionSigningHash()),{httpOnly:true,secure:new URL(request.url).protocol==="https:",sameSite:"strict",path:"/",maxAge:8*60*60});
    return response;
  }catch{return NextResponse.json({error:"Sign-in is temporarily unavailable."},{status:503,headers:privateHeaders})}
}
export async function DELETE(request:Request){
  if(!sameOrigin(request))return NextResponse.json({error:"Invalid origin."},{status:403,headers:privateHeaders});
  const response=NextResponse.json({ok:true},{headers:privateHeaders});
  response.cookies.set(cookieName,"",{path:"/",maxAge:0,httpOnly:true,secure:new URL(request.url).protocol==="https:",sameSite:"strict"});
  return response;
}
