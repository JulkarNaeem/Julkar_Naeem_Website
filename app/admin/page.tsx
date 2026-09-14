import { isAdmin,authConfigured } from "@/lib/admin-auth";
import { storageReady } from "@/lib/cms-store";
import { AdminConsole,AdminLogin } from "@/components/admin-console";
import "./admin.css";
export const dynamic="force-dynamic";
export const metadata={title:"Website Control Panel | Julkar Naeem",description:"Private administration for julkarnaeem.com.",robots:{index:false,follow:false},alternates:{canonical:"https://admin.julkarnaeem.com/"}};
export default async function AdminPage(){
  if(!await isAdmin())return <AdminLogin configured={authConfigured()&&storageReady()}/>;
  return <AdminConsole local={process.env.CMS_LOCAL_STORE==="1"&&!process.env.VERCEL}/>;
}

