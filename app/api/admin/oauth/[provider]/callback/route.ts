import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { authConfigured, privateHeaders } from "@/lib/admin-auth";
import { cookieName, signSession } from "@/lib/admin-security.mjs";
import { finishOAuth, oauthCookieName, oauthRequestOrigin, providerConfig, readOAuthTransaction, sessionSigningHash } from "@/lib/admin-oauth.mjs";
import { consumeOAuthState, storageReady } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const url = new URL(request.url), origin = oauthRequestOrigin(request.url);
  const transactionCookie = oauthCookieName(origin);
  const redirect = (error?: string) => {
    const response = NextResponse.redirect(new URL(error ? `/admin?signin=${error}` : "/admin", origin), { status: 303, headers: privateHeaders });
    response.headers.set("Referrer-Policy", "no-referrer");
    response.cookies.set(transactionCookie, "", { httpOnly: true, secure: origin.startsWith("https:"), sameSite: "lax", path: "/", maxAge: 0 });
    return response;
  };
  const config = providerConfig(provider);
  if (!config || !authConfigured() || !storageReady()) return redirect("unavailable");
  if (url.origin !== origin) return redirect("invalid");
  const tx = readOAuthTransaction((await cookies()).get(transactionCookie)?.value, provider, origin, process.env.ADMIN_SESSION_SECRET, url.searchParams);
  if (!tx) return redirect("expired");
  try {
    // Atomic consumption prevents replay, including simultaneous callback requests.
    if (!await consumeOAuthState(createHash("sha256").update(tx.state).digest("hex"), tx.exp)) return redirect("expired");
    if (url.searchParams.has("error")) return redirect(url.searchParams.get("error") === "access_denied" ? "cancelled" : "unavailable");
    if (!await finishOAuth(config, tx, url)) return redirect("denied");
    const response = redirect();
    response.cookies.set(cookieName, signSession(process.env.ADMIN_SESSION_SECRET, sessionSigningHash()), {
      // Lax permits the landing navigation from the provider; mutations still require sameOrigin.
      httpOnly: true, secure: origin.startsWith("https:"), sameSite: "lax", path: "/", maxAge: 8 * 60 * 60,
    });
    return response;
  } catch {
    // Never log authorization codes, provider tokens, identity data or raw provider errors.
    return redirect("unavailable");
  }
}
