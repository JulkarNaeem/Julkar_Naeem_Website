import {neon} from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before running the enquiry migration');
const sql = neon(process.env.DATABASE_URL);
await sql.query(`CREATE TABLE IF NOT EXISTS enquiries (
  id text PRIMARY KEY, created_at text NOT NULL, name text NOT NULL,
  company text NOT NULL, email text NOT NULL, country text NOT NULL,
  project_type text NOT NULL, details text NOT NULL,
  consent_at text NOT NULL, request_hash text NOT NULL
)`);
await sql.query('CREATE INDEX IF NOT EXISTS idx_enquiries_request_time ON enquiries(request_hash,created_at)');
console.log('Enquiry database schema is ready.');
