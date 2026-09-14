import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import * as oauth from "oauth4webapi";

export const oauthProviders = ["google", "github"];
export const oauthLifetime = 10 * 60;
export const adminOrigin = "https://admin.julkarnaeem.com";

// Never accept provider endpoints, return URLs or owner identities from a browser.
const servers = {
  google: {
    issuer: "https://accounts.google.com",
    authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    token_endpoint: "https://oauth2.googleapis.com/token",
    jwks_uri: "https://www.googleapis.com/oauth2/v3/certs",
    id_token_signing_alg_values_supported: ["RS256"],
  },
  github: {
    issuer: "https://github.com",
    authorization_endpoint: "https://github.com/login/oauth/authorize",
    token_endpoint: "https://github.com/login/oauth/access_token",
  },
};

export function providerConfig(provider, env = process.env) {
  if (!oauthProviders.includes(provider)) return null;
  const prefix = `ADMIN_${provider.toUpperCase()}`;
  const clientId = env[`${prefix}_CLIENT_ID`]?.trim();
  const clientSecret = env[`${prefix}_CLIENT_SECRET`]?.trim();
  const owner = (provider === "google" ? env.ADMIN_GOOGLE_EMAIL : env.ADMIN_GITHUB_ID)?.trim();
  // Other email domains require a pinned Google subject; Gmail identities are authoritative.
  const subject = env.ADMIN_GOOGLE_SUB?.trim();
  const validOwner = provider === "github"
    ? /^[1-9]\d*$/.test(owner || "")
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner || "") && (owner?.toLowerCase().endsWith("@gmail.com") || Boolean(subject));
  if (!clientId || !clientSecret || !owner || !validOwner) return null;
  return { provider, clientId, clientSecret, owner: owner.toLowerCase(), subject };
}

export function oauthAvailability(env = process.env) {
  return { google: Boolean(providerConfig("google", env)), github: Boolean(providerConfig("github", env)) };
}

export function sessionSigningHash(env = process.env) {
  // Removing an owner or rotating a provider credential also revokes active sessions.
  const config = oauthProviders.map(provider => providerConfig(provider, env));
  return `${env.ADMIN_PASSWORD_HASH}|${createHash("sha256").update(JSON.stringify(config)).digest("hex")}`;
}

export function oauthRequestOrigin(requestUrl, env = process.env) {
  const url = new URL(requestUrl);
  if (!env.VERCEL && ["localhost", "127.0.0.1"].includes(url.hostname) && ["http:", "https:"].includes(url.protocol)) return url.origin;
  return adminOrigin;
}

export function oauthCookieName(origin) {
  // __Host- prevents another subdomain from injecting an OAuth cookie.
  return `${origin.startsWith("https:") ? "__Host-" : ""}jn_admin_oauth`;
}

function encryptionKey(secret) {
  if (!secret || secret.length < 32) throw new Error("OAuth session secret is not configured.");
  return createHash("sha256").update(`jn-admin-oauth-v1:${secret}`).digest();
}

export async function beginOAuth(config, origin, secret, now = Date.now()) {
  const verifier = oauth.generateRandomCodeVerifier(), state = oauth.generateRandomState(), nonce = oauth.generateRandomNonce();
  const redirectUri = `${origin}/api/admin/oauth/${config.provider}/callback`;
  const transaction = { provider: config.provider, state, nonce, verifier, redirectUri, exp: now + oauthLifetime * 1000 };
  const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(transaction), "utf8"), cipher.final()]);
  const cookie = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
  const url = new URL(servers[config.provider].authorization_endpoint);
  url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: redirectUri, response_type: "code", state,
    code_challenge: await oauth.calculatePKCECodeChallenge(verifier), code_challenge_method: "S256" }).toString();
  if (config.provider === "google") {
    url.searchParams.set("scope", "openid email");
    url.searchParams.set("nonce", nonce);
    url.searchParams.set("prompt", "select_account");
  } else {
    // Empty scopes only expose public identity, never repositories or private email.
    url.searchParams.set("scope", "");
    url.searchParams.set("allow_signup", "false");
    url.searchParams.set("prompt", "select_account");
  }
  return { url: url.href, cookie };
}

export function readOAuthTransaction(cookie, provider, origin, secret, params, now = Date.now()) {
  try {
    if (typeof cookie !== "string" || cookie.length > 3000 || !oauthProviders.includes(provider)) return null;
    const value = Buffer.from(cookie, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(secret), value.subarray(0, 12));
    decipher.setAuthTag(value.subarray(12, 28));
    const tx = JSON.parse(Buffer.concat([decipher.update(value.subarray(28)), decipher.final()]).toString("utf8"));
    const states = params.getAll("state");
    if (states.length !== 1 || typeof tx.state !== "string") return null;
    const actual = Buffer.from(states[0]), expected = Buffer.from(tx.state);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    if (tx.provider !== provider || tx.redirectUri !== `${origin}/api/admin/oauth/${provider}/callback`) return null;
    if (!Number.isFinite(tx.exp) || tx.exp <= now || tx.exp > now + oauthLifetime * 1000) return null;
    if (typeof tx.verifier !== "string" || tx.verifier.length < 43 || typeof tx.nonce !== "string" || tx.nonce.length < 32) return null;
    return tx;
  } catch { return null; }
}

export function allowedIdentity(config, identity) {
  if (!identity || !config) return false;
  if (config.provider === "github") return Number.isSafeInteger(identity.id) && String(identity.id) === config.owner;
  return typeof identity.sub === "string" && identity.sub.length > 0 && identity.email_verified === true
    && typeof identity.email === "string" && identity.email.toLowerCase() === config.owner
    && (!config.subject || identity.sub === config.subject);
}

// Injectable fetch is only for isolated protocol tests; requests and env cannot override it.
export async function finishOAuth(config, transaction, callbackUrl, transport = fetch) {
  const server = servers[config.provider], client = { client_id: config.clientId };
  const options = { [oauth.customFetch]: transport, signal: () => AbortSignal.timeout(10000) };
  const params = oauth.validateAuthResponse(server, client, callbackUrl, transaction.state);
  const response = await oauth.authorizationCodeGrantRequest(server, client, oauth.ClientSecretPost(config.clientSecret),
    params, transaction.redirectUri, transaction.verifier, options);
  const result = await oauth.processAuthorizationCodeResponse(server, client, response,
    config.provider === "google" ? { expectedNonce: transaction.nonce, requireIdToken: true } : {});
  let identity;
  if (config.provider === "google") {
    await oauth.validateApplicationLevelSignature(server, response, options);
    identity = oauth.getValidatedIdTokenClaims(result);
  } else {
    const profile = await oauth.protectedResourceRequest(result.access_token, "GET", new URL("https://api.github.com/user"),
      { Accept: "application/vnd.github+json", "User-Agent": "Julkar-Naeem-Website-Control-Panel" }, null, options);
    if (!profile.ok) throw new Error("Provider identity unavailable.");
    identity = await profile.json();
  }
  // Provider tokens remain in this server request. Never save them or send them to the browser.
  return allowedIdentity(config, identity);
}
