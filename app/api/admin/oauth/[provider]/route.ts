import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { authConfigured, privateHeaders, sameOrigin } from "@/lib/admin-auth";
import { beginOAuth, oauthCookieName, oauthLifetime, oauthRequestOrigin, providerConfig } from "@/lib/admin-oauth.mjs";
import { loginAttempt, storageReady } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const origin = oauthRequestOrigin(request.url);
  const failure = (code: string) => NextResponse.redirect(new URL(`/admin?signin=${code}`, origin), { status: 303, headers: privateHeaders });
  // Same-origin POST prevents third-party sites or prefetching from initiating sign-in.
  if (!sameOrigin(request) || new URL(request.url).origin !== origin) return failure("invalid");
  const config = providerConfig(provider);
  if (!config || !authConfigured() || !storageReady()) return failure("unavailable");
  try {
    const ip = process.env.VERCEL ? request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown" : "local";
    const key = createHash("sha256").update(`oauth:${ip}:${process.env.ADMIN_SESSION_SECRET}`).digest("hex");
    if (!await loginAttempt(key)) return failure("limited");
    const flow = await beginOAuth(config, origin, process.env.ADMIN_SESSION_SECRET);
    const response = NextResponse.redirect(flow.url, { status: 303, headers: privateHeaders });
    response.cookies.set(oauthCookieName(origin), flow.cookie, {
      httpOnly: true, secure: origin.startsWith("https:"), sameSite: "lax", path: "/", maxAge: oauthLifetime,
    });
    return response;
  } catch { return failure("unavailable"); }
}
