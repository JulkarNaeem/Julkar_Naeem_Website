import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { beginOAuth, providerConfig } from "../lib/admin-oauth.mjs";

// Run against a local production build with the isolated provider values below.
// No real provider request or enquiry is sent by this script.
const base = "http://localhost:5173", env = parseEnv(readFileSync(".env.local", "utf8"));
assert.equal(env.CMS_LOCAL_STORE, "1"); assert.ok(!env.DATABASE_URL);
const config = providerConfig("github", { ADMIN_GITHUB_CLIENT_ID: "isolated-github-client", ADMIN_GITHUB_CLIENT_SECRET: "isolated-github-secret", ADMIN_GITHUB_ID: "123456" });
let checks = 0;
const check = (actual, expected, name) => { assert.equal(actual, expected, name); checks++; console.log("PASS " + name); };
const post = (provider, origin = base) => fetch(`${base}/api/admin/oauth/${provider}`, { method: "POST", headers: { Origin: origin }, redirect: "manual" });
const callback = (query, cookie) => fetch(`${base}/api/admin/oauth/github/callback?${query}`, { headers: cookie ? { Cookie: cookie } : {}, redirect: "manual" });
const failure = response => new URL(response.headers.get("location")).searchParams.get("signin");

check((await fetch(base + "/api/admin/oauth/github", { redirect: "manual" })).status, 405, "GET cannot initiate OAuth");
check(failure(await post("github", "https://untrusted.example")), "invalid", "cross-origin OAuth initiation rejected");
check(failure(await post("unknown")), "unavailable", "unknown provider fails closed");
for (const provider of ["google", "github"]) {
  const response = await post(provider), destination = new URL(response.headers.get("location"));
  check(response.status, 303, provider + " uses a POST-to-GET redirect");
  check(destination.hostname, provider === "google" ? "accounts.google.com" : "github.com", provider + " uses only its official endpoint");
  check(destination.searchParams.get("code_challenge_method"), "S256", provider + " uses PKCE");
  const cookie = response.headers.get("set-cookie"); assert.match(cookie, /HttpOnly/i); assert.match(cookie, /SameSite=lax/i);
  assert.ok(!cookie.includes("isolated-github-secret")); assert.ok(!destination.searchParams.has("client_secret"));
  assert.match(response.headers.get("cache-control"), /no-store/);
}
check(failure(await callback("code=test&state=test")), "expired", "callback without transaction cookie rejected");
const flow = await beginOAuth(config, base, env.ADMIN_SESSION_SECRET);
const state = new URL(flow.url).searchParams.get("state"), cookie = `jn_admin_oauth=${flow.cookie}`;
check(failure(await callback("code=test&state=wrong", cookie)), "expired", "mismatched state rejected");
const responses = await Promise.all([callback(`error=access_denied&state=${state}`, cookie), callback(`error=access_denied&state=${state}`, cookie)]);
check(responses.map(failure).sort().join(","), "cancelled,expired", "concurrent replay rejected atomically");
for (const response of responses) {
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
  assert.ok(!response.headers.get("set-cookie").includes("jn_admin_session="));
}
check(failure(await callback(`error=access_denied&state=${state}`, cookie)), "expired", "used callback cannot be reused");
const expired = await beginOAuth(config, base, env.ADMIN_SESSION_SECRET, Date.now() - 601000);
check(failure(await callback(`error=access_denied&state=${new URL(expired.url).searchParams.get("state")}`, `jn_admin_oauth=${expired.cookie}`)), "expired", "expired transaction rejected");
const html = await (await fetch(base + "/admin?signin=cancelled")).text();
check(html.includes("Sign-in was cancelled."), true, "cancellation recovery message rendered");
check(html.includes('method="post"'), true, "provider buttons use native forms");
check((await fetch(base + "/api/admin/content")).status, 401, "failed social login leaves content private");
console.log(`${checks} OAuth integration checks passed. No real provider or enquiry was contacted.`);
