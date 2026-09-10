# Vercel deployment

This branch runs the website on Next.js and stores new enquiries in Neon Postgres.
The original Sites/Cloudflare version remains in Git history and the existing Sites deployment.

1. Import this GitHub repository into Vercel and deploy the latest `main` commit.
2. Connect a Neon database to the project through Vercel Storage. Keep DATABASE_URL server-side and enable it for the deployment environment.
3. Run `npm run db:migrate:vercel` with DATABASE_URL available in the local environment.
4. Deploy and verify a clearly labelled enquiry, then inspect its row in Neon.

The existing Sites enquiries are not copied automatically. Never commit database URLs or enquiry exports. No notification email has been configured.

Use the domain records returned by the Vercel project when moving julkarnaeem.com. Previous Sites DNS values do not point to Vercel.
