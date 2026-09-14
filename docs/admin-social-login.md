# Owner sign-in with Google and GitHub

The control panel keeps its administrator password and adds optional Google and GitHub sign-in. There is no public registration or automatic creation of administrator accounts. Buttons remain disabled until all required provider settings exist. All values below are server-only Vercel Production environment variables; never put client secrets in Git or chat.

## Google

Create a Web application OAuth client in Google Auth Platform, under a project you own. Use the app name **Julkar Naeem Website Control Panel** and the homepage `https://admin.julkarnaeem.com/`. Request only `openid` and `email`. If the app is in testing, add `julkarnaeem.me@gmail.com` as a test user.

Authorised redirect URI:

`https://admin.julkarnaeem.com/api/admin/oauth/google/callback`

Set `ADMIN_GOOGLE_CLIENT_ID` and `ADMIN_GOOGLE_CLIENT_SECRET` from this client. Set `ADMIN_GOOGLE_EMAIL=julkarnaeem.me@gmail.com`. The verified email must match exactly (case-insensitive); aliases are not automatically admitted. `ADMIN_GOOGLE_SUB` can additionally pin the immutable subject. It is required when allowing a non-Gmail email address.

## GitHub

Create a separate OAuth App in the owner's GitHub Developer settings. Do not reuse the existing Firebase application. Set its homepage to `https://admin.julkarnaeem.com/`, keep wildcard callbacks and device flow disabled, and use this callback:

`https://admin.julkarnaeem.com/api/admin/oauth/github/callback`

Set `ADMIN_GITHUB_CLIENT_ID`, `ADMIN_GITHUB_CLIENT_SECRET`, and `ADMIN_GITHUB_ID=31064056`. The ID was verified from GitHub's public user endpoint for `JulkarNaeem`. It remains stable if the username changes. No repository permissions or private email scopes are requested.

## Activation and verification

Run the idempotent `npm run db:migrate:admin` with the existing production database environment to create the one-time sign-in-state table, then redeploy after setting provider credentials. Use Vercel's secret environment fields or its CLI stdin; never pass secrets in command arguments. Account credentials are never stored by the website.

Visit `https://admin.julkarnaeem.com/` in a signed-out browser and test each configured button with the approved owner account. Verify an unrelated account is denied and password sign-in still works. Real provider login cannot be considered verified until these credential and consent steps are completed.

For development, use separate provider clients with callbacks at `http://localhost:5173/api/admin/oauth/PROVIDER/callback`. Keep values in ignored `.env.local`. Do not put test credentials into Production. Local integration checks use isolated, mocked provider responses and never contact a real account.

## Security behaviour

- Same-origin POST starts sign-in; buttons work without JavaScript.
- Both providers use random state and S256 PKCE. Google also requires a nonce and validates the ID token's issuer, audience, expiry and signature.
- The ten-minute transaction is encrypted in an HttpOnly, SameSite=Lax cookie. Production uses a Secure, host-only cookie. Consumed states are recorded atomically to reject replay.
- Only exact configured owner identities can receive an eight-hour administrator session. Password, session-secret or configured provider-identity changes invalidate existing sessions.
- Provider tokens are used only during the callback, then discarded. They are not placed in browser storage, database records or logs.
- Callbacks have fixed return destinations, private caching and no-referrer headers. Cancelled, expired, denied and unavailable states show concise recovery messages.
- Existing portfolio approval checks and enquiry delivery remain unchanged.
