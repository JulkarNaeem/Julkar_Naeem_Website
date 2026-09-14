import { neon } from "@neondatabase/serverless";
if(!process.env.DATABASE_URL)throw new Error("Set DATABASE_URL to the website database before running the admin migration.");
const sql=neon(process.env.DATABASE_URL);
await sql.query("CREATE TABLE IF NOT EXISTS website_cms(id integer PRIMARY KEY CHECK(id=1),revision integer NOT NULL DEFAULT 0,draft text NOT NULL,published text NOT NULL,updated_at text NOT NULL,published_at text)");
await sql.query("CREATE TABLE IF NOT EXISTS website_cms_history(id text PRIMARY KEY,revision integer NOT NULL,payload text NOT NULL,created_at text NOT NULL)");
await sql.query("CREATE TABLE IF NOT EXISTS website_admin_attempts(key text PRIMARY KEY,bucket bigint NOT NULL,attempts integer NOT NULL)");
console.log("Website control-panel tables are ready. Existing enquiries were not modified.");

