# Julkar Naeem website control panel

The control panel is part of this Next.js application and repository. It replaces the external project-database feed. Public pages read only the published content snapshot; drafts and the enquiry inbox require an owner session.

## Addresses

- `/admin` on the website deployment
- `https://admin.julkarnaeem.com/` after connecting that domain to the **same** Vercel project

The hostname rewrite is in `proxy.ts`. The administration pages are excluded from indexing and the public sitemap. APIs check the signed session independently of the routing layer.

## Local access

1. Install dependencies with `npm ci`.
2. Run `npm run admin:setup` once. This creates `.env.local` and `.local-data/admin-access.txt` containing the generated owner password. Both paths are ignored by Git.
3. Run `npm run dev`, then open `http://localhost:5173/admin`.

Local changes persist in `.local-data/website-cms.json`. Previous saves are retained beside it. They affect only this local website. No example enquiries are created.

## Production activation

1. Connect a Neon PostgreSQL database to the existing `julkar_naeem_website` Vercel project. Set its connection string as `DATABASE_URL`. Use the existing enquiries database if one is available; do not replace a populated database.
2. Configure `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` from the generated `.env.local` as encrypted, server-only production environment variables. Do not configure `CMS_LOCAL_STORE` on Vercel. Never commit credentials or use `NEXT_PUBLIC_` for these variables.
3. In a shell with `DATABASE_URL` set, run `npm run db:migrate:admin`. If this is a new database, also run `npm run db:migrate:vercel` to create the existing enquiry table. Both migrations are additive.
4. Deploy this repository to the existing project.
5. Add `admin.julkarnaeem.com` under that project's Domains. Add the exact DNS record Vercel shows in Cloudflare DNS. Keep the public apex and www records unchanged. Wait for domain and certificate verification.
6. Sign in at the admin subdomain. Save a draft and check it before publishing. A change to the password hash or session secret invalidates existing sessions.

The panel remains locked when credentials or durable storage are absent. The public website continues to use its repository content if the content database cannot be read. Set up a database backup policy and retain the encrypted credentials in an owner-controlled password manager.

## Editing and publication

- Add and edit portfolio projects, their facts, narrative sections and Cloudinary gallery. New incomplete projects can be saved privately as drafts.
- Only approved projects marked Published appear publicly. Publishing replaces the public snapshot atomically. Archive a project to remove it from the portfolio while retaining its private record.
- Existing published URLs stay fixed. The sitemap and category filters use the current public project list.
- Approved portfolio images must be `3D-SCREENSHOT` or `3D-DRAWING` URLs in the Julkar Naeem Cloudinary account. Restricted shop, connection, erection and 2D-plan drawing filenames are rejected.
- Mark scope and deliverables verified only when supported by records. Unverified deliverables retain the public qualification.
- Edit homepage copy, service descriptions, verified contact links and existing page SEO copy. Routes, service illustrations and credentials remain controlled by the repository.
- Read the latest 100 genuine enquiries. The panel does not send email or replies and does not change the form's delivery mechanism.

Each save uses a revision check to prevent overwriting another session. A previous draft snapshot is recorded in `website_cms_history`; restores currently require an administrator using the database. Publishing is a deliberate separate action from saving a draft.

## Verification

`npm run lint`, `npm run typecheck`, `npm run test:admin`, `npm run build`.

`node scripts/verify-admin.mjs` runs integration checks against the local server at port 5173. It rejects non-local destinations, uses the generated local owner password, checks draft isolation and validation, and restores the original content snapshot. It never submits a public enquiry.
