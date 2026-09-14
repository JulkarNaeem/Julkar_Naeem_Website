import { neon } from "@neondatabase/serverless";
import { isAdmin,privateHeaders } from "@/lib/admin-auth";
export async function GET(){
  if(!await isAdmin())return Response.json({error:"Sign in to continue."},{status:401,headers:privateHeaders});
  if(!process.env.DATABASE_URL)return Response.json({error:"Connect the website database to read real enquiries."},{status:503,headers:privateHeaders});
  try{
    const sql=neon(process.env.DATABASE_URL);
    const rows=await sql.query("SELECT id,created_at,name,company,email,country,project_type,details FROM enquiries ORDER BY created_at DESC LIMIT 100");
    return Response.json({enquiries:rows},{headers:privateHeaders});
  }catch{return Response.json({error:"The enquiry inbox is unavailable."},{status:503,headers:privateHeaders})}
}

