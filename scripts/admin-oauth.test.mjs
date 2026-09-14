import test from "node:test";
import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { allowedIdentity, beginOAuth, finishOAuth, oauthAvailability, oauthCookieName, oauthRequestOrigin, providerConfig, readOAuthTransaction, sessionSigningHash } from "../lib/admin-oauth.mjs";
import { signSession, verifySession } from "../lib/admin-security.mjs";

const secret = "isolated-test-secret-at-least-32-characters";
const origin = "https://admin.julkarnaeem.com";
const env = { ADMIN_GOOGLE_CLIENT_ID: "google-test-client", ADMIN_GOOGLE_CLIENT_SECRET: "google-test-secret", ADMIN_GOOGLE_EMAIL: "owner@gmail.com",
  ADMIN_GITHUB_CLIENT_ID: "github-test-client", ADMIN_GITHUB_CLIENT_SECRET: "github-test-secret", ADMIN_GITHUB_ID: "123456", ADMIN_PASSWORD_HASH: "test-hash" };
const google = providerConfig("google", env), github = providerConfig("github", env);
const json = body => new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } });

test("providers fail closed when credentials or approved owner are missing", () => {
  assert.deepEqual(oauthAvailability({}), { google: false, github: false });
  assert.deepEqual(oauthAvailability(env), { google: true, github: true });
  assert.equal(providerConfig("github", { ...env, ADMIN_GITHUB_ID: "username" }), null);
  assert.equal(providerConfig("google", { ...env, ADMIN_GOOGLE_EMAIL: "owner@example.com" }), null);
  assert.ok(providerConfig("google", { ...env, ADMIN_GOOGLE_EMAIL: "owner@example.com", ADMIN_GOOGLE_SUB: "pinned-subject" }));
  assert.equal(providerConfig("google", { ...env, ADMIN_GOOGLE_CLIENT_SECRET: "" }), null);
  assert.equal(providerConfig("constructor", env), null);
});

test("owner checks reject different accounts, aliases, unverified emails and renamed impostors", () => {
  const identity = { sub: "google-owner-subject", email: "OWNER@gmail.com", email_verified: true };
  assert.equal(allowedIdentity(google, identity), true);
  for (const bad of [{ ...identity, email: "someone@gmail.com" }, { ...identity, email_verified: false }, { ...identity, email_verified: "true" },
    { ...identity, email: "owner+alias@gmail.com" }, { ...identity, sub: "" }, null]) assert.equal(allowedIdentity(google, bad), false);
  assert.equal(allowedIdentity({ ...google, subject: "other-subject" }, identity), false);
  assert.equal(allowedIdentity(github, { id: 123456, login: "renamed-owner" }), true);
  assert.equal(allowedIdentity(github, { id: 999999, login: "JulkarNaeem" }), false);
  assert.equal(allowedIdentity(github, { id: "123456" }), false);
});

test("production callbacks cannot be changed by a hostile host or preview URL", () => {
  for (const url of ["https://evil.example/", "https://preview.vercel.app/", "http://localhost:5173/"]) {
    assert.equal(oauthRequestOrigin(url, { VERCEL: "1" }), origin);
  }
  assert.equal(oauthRequestOrigin("http://localhost:5173/", {}), "http://localhost:5173");
  assert.equal(oauthCookieName(origin), "__Host-jn_admin_oauth");
});

test("authorization uses per-request state, PKCE and minimal permissions", async () => {
  for (const config of [google, github]) {
    const flow = await beginOAuth(config, origin, secret), url = new URL(flow.url);
    const tx = readOAuthTransaction(flow.cookie, config.provider, origin, secret, url.searchParams);
    assert.ok(tx);
    assert.equal(url.searchParams.get("code_challenge_method"), "S256");
    assert.equal(url.searchParams.get("code_challenge"), createHash("sha256").update(tx.verifier).digest("base64url"));
    assert.equal(url.searchParams.get("scope"), config.provider === "google" ? "openid email" : "");
    assert.equal(url.searchParams.has("client_secret"), false);
    assert.equal(Buffer.from(flow.cookie, "base64url").toString().includes(tx.verifier), false);
    const second = new URL((await beginOAuth(config, origin, secret)).url);
    assert.notEqual(url.searchParams.get("state"), second.searchParams.get("state"));
  }
});

test("encrypted transaction rejects tampering, expiry, state substitution and provider mix-up", async () => {
  const now = Date.now(), flow = await beginOAuth(google, origin, secret, now), params = new URL(flow.url).searchParams;
  const read = (cookie = flow.cookie, provider = "google", destination = origin, key = secret, query = params, at = now) => readOAuthTransaction(cookie, provider, destination, key, query, at);
  assert.ok(read());
  assert.equal(read(undefined, "github"), null);
  assert.equal(read(flow.cookie, "google", "https://other.example"), null);
  assert.equal(read(flow.cookie, "google", origin, secret + "rotated"), null);
  assert.equal(read(flow.cookie, "google", origin, secret, params, now + 600000), null);
  const changed = Buffer.from(flow.cookie, "base64url"); changed[40] ^= 1;
  assert.equal(read(changed.toString("base64url")), null);
  assert.equal(read(""), null);
  assert.equal(read("x".repeat(3001)), null);
  const duplicate = new URLSearchParams(params); duplicate.append("state", params.get("state"));
  assert.equal(read(flow.cookie, "google", origin, secret, duplicate), null);
  assert.equal(read(flow.cookie, "google", origin, secret, new URLSearchParams("state=wrong")), null);
});

test("provider removal and owner changes revoke signed admin sessions", () => {
  const hash = sessionSigningHash(env), token = signSession(secret, hash);
  assert.equal(verifySession(token, secret, hash), true);
  for (const changed of [{ ...env, ADMIN_GITHUB_ID: "999" }, { ...env, ADMIN_GOOGLE_CLIENT_SECRET: "" }, { ...env, ADMIN_PASSWORD_HASH: "rotated" }]) {
    assert.equal(verifySession(token, secret, sessionSigningHash(changed)), false);
  }
});

async function transaction(config) {
  const flow = await beginOAuth(config, origin, secret), authorization = new URL(flow.url);
  const tx = readOAuthTransaction(flow.cookie, config.provider, origin, secret, authorization.searchParams);
  return { tx, callback: new URL(`${tx.redirectUri}?code=isolated-code&state=${tx.state}`) };
}

test("GitHub exchanges the code server-side and authenticates the immutable account ID", async () => {
  const { tx, callback } = await transaction(github);
  let calls = 0;
  const transport = async (url, init) => {
    calls++;
    if (String(url) === "https://github.com/login/oauth/access_token") {
      const body = new URLSearchParams(init.body);
      assert.equal(body.get("client_secret"), github.clientSecret);
      assert.equal(body.get("code_verifier"), tx.verifier);
      assert.equal(body.get("redirect_uri"), tx.redirectUri);
      return json({ access_token: "test-token", token_type: "bearer", scope: "" });
    }
    assert.equal(String(url), "https://api.github.com/user");
    assert.equal(new Headers(init.headers).get("authorization"), "Bearer test-token");
    return json({ id: 123456, login: "owner" });
  };
  assert.equal(await finishOAuth(github, tx, callback, transport), true);
  assert.equal(calls, 2);
  assert.equal(await finishOAuth(github, tx, callback, async url => String(url).includes("access_token")
    ? json({ access_token: "test-token", token_type: "bearer" }) : json({ id: 999 })), false);
  await assert.rejects(finishOAuth(github, tx, callback, async () => { throw new Error("offline"); }));
});

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "oauth-isolated-test-key", alg: "RS256", use: "sig" };
function idToken(claims) {
  const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
  const payload = `${encode({ alg: "RS256", kid: jwk.kid })}.${encode(claims)}`;
  return `${payload}.${sign("RSA-SHA256", Buffer.from(payload), privateKey).toString("base64url")}`;
}

test("Google validates signed issuer, audience, nonce, expiry and verified owner email", async () => {
  const { tx, callback } = await transaction(google);
  const now = Math.floor(Date.now() / 1000);
  const valid = { iss: "https://accounts.google.com", aud: google.clientId, sub: "google-owner", iat: now, exp: now + 300,
    nonce: tx.nonce, email: "owner@gmail.com", email_verified: true };
  const transport = claims => async url => String(url) === "https://www.googleapis.com/oauth2/v3/certs"
    ? json({ keys: [jwk] }) : json({ access_token: "test-token", token_type: "Bearer", id_token: idToken(claims) });
  assert.equal(await finishOAuth(google, tx, callback, transport(valid)), true);
  assert.equal(await finishOAuth(google, tx, callback, transport({ ...valid, email: "other@gmail.com" })), false);
  assert.equal(await finishOAuth(google, tx, callback, transport({ ...valid, email_verified: false })), false);
  for (const changed of [{ iss: "https://evil.example" }, { aud: "other-client" }, { nonce: "wrong" }, { exp: now - 600 }]) {
    await assert.rejects(finishOAuth(google, tx, callback, transport({ ...valid, ...changed })));
  }
  const signed = idToken(valid), parts = signed.split(".");
  const signature = Buffer.from(parts[2], "base64url"); signature[0] ^= 1; parts[2] = signature.toString("base64url");
  await assert.rejects(finishOAuth(google, tx, callback, async url => String(url).includes("certs")
    ? json({ keys: [jwk] }) : json({ access_token: "test-token", token_type: "Bearer", id_token: parts.join(".") })));
});

test("callback errors and duplicate code parameters never authenticate", async () => {
  const { tx, callback } = await transaction(github);
  const noNetwork = async () => { assert.fail("Invalid callback must not reach a provider"); };
  await assert.rejects(finishOAuth(github, tx, new URL(`${tx.redirectUri}?error=access_denied&state=${tx.state}`), noNetwork));
  callback.searchParams.append("code", "second-code");
  await assert.rejects(finishOAuth(github, tx, callback, noNetwork));
});
