import { isAdmin,authConfigured } from "@/lib/admin-auth";
import { storageReady } from "@/lib/cms-store";
import { AdminConsole } from "@/components/admin-console";
import { AdminLogin } from "@/components/admin-login";
import { oauthAvailability } from "@/lib/admin-oauth.mjs";
import "./admin.css";
export const dynamic="force-dynamic";
export const metadata={title:"Website Control Panel | Julkar Naeem",description:"Private administration for julkarnaeem.com.",robots:{index:false,follow:false},alternates:{canonical:"https://admin.julkarnaeem.com/"}};
export default async function AdminPage({searchParams}:{searchParams:Promise<{signin?:string}>}){
  if(!await isAdmin())return <AdminLogin configured={authConfigured()&&storageReady()} providers={oauthAvailability()} signin={(await searchParams).signin}/>;
  return <AdminConsole local={process.env.CMS_LOCAL_STORE==="1"&&!process.env.VERCEL}/>;
}
