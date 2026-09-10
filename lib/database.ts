import {neon} from '@neondatabase/serverless';

// Server-side only. DATABASE_URL is supplied by the Vercel Neon integration.
export function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Enquiry database is not configured');
  const sql = neon(url);
  return {
    prepare(statement: string) {
      let index = 0;
      const query = statement.replace(/\?/g, () => `$${++index}`);
      return {
        bind(...values: unknown[]) {
          return {
            async first<T>() {
              const rows = await sql.query(query, values);
              return (rows[0] as T | undefined) ?? null;
            },
            async run() { await sql.query(query, values); }
          };
        }
      };
    }
  };
}
