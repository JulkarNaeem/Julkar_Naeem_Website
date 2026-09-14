import { NextRequest,NextResponse } from "next/server";
export function proxy(request:NextRequest){
  const headers=new Headers(request.headers);
  const host=request.nextUrl.hostname.toLowerCase();
  const adminHost=host==="admin.julkarnaeem.com";
  const path=request.nextUrl.pathname;
  const adminPath=path==="/admin"||path.startsWith("/admin/");
  // Overwrite any client-supplied hint; this only selects layout, never authorization.
  headers.set("x-jn-admin",adminHost||adminPath?"1":"0");
  let response:NextResponse;
  if(adminHost&&path==="/"){
    const url=request.nextUrl.clone();url.pathname="/admin";
    response=NextResponse.rewrite(url,{request:{headers}});
  }else if(adminHost&&!adminPath&&!path.startsWith("/api/admin/")&&!/\.[a-z0-9]+$/i.test(path)){
    const url=request.nextUrl.clone();url.pathname="/admin";
    response=NextResponse.redirect(url);
  }else response=NextResponse.next({request:{headers}});
  if(adminHost||adminPath||path.startsWith("/api/admin/")){
    response.headers.set("X-Robots-Tag","noindex, nofollow, noarchive");
    response.headers.set("Cache-Control","private, no-store");
    response.headers.set("X-Frame-Options","DENY");
    response.headers.set("Referrer-Policy","same-origin");
  }
  return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};

