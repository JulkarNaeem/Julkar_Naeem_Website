import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import { isAdmin, sameOrigin, privateHeaders } from "@/lib/admin-auth";
import { passwordMatches, passwordHash, signSession, cookieName } from "@/lib/admin-security.mjs";
import { sessionSigningHash } from "@/lib/admin-oauth.mjs";
import { localStoreEnabled } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Use this website to change the password." }, { status: 403, headers: privateHeaders });
  }
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Sign in as administrator to change password." }, { status: 401, headers: privateHeaders });
  }

  try {
    const raw = await request.text();
    if (raw.length > 2048) {
      return NextResponse.json({ error: "Invalid password change request." }, { status: 400, headers: privateHeaders });
    }
    const { currentPassword, newPassword, confirmPassword } = JSON.parse(raw);

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Current and new passwords are required." }, { status: 400, headers: privateHeaders });
    }

    if (!process.env.ADMIN_PASSWORD_HASH || !passwordMatches(currentPassword, process.env.ADMIN_PASSWORD_HASH)) {
      return NextResponse.json({ error: "The current password is incorrect." }, { status: 400, headers: privateHeaders });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long." }, { status: 400, headers: privateHeaders });
    }

    if (newPassword.length > 256) {
      return NextResponse.json({ error: "New password is too long." }, { status: 400, headers: privateHeaders });
    }

    if (newPassword === currentPassword) {
      return NextResponse.json({ error: "The new password must be different from the current password." }, { status: 400, headers: privateHeaders });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New password and confirmation do not match." }, { status: 400, headers: privateHeaders });
    }

    const newHash = passwordHash(newPassword);
    const isLocal = localStoreEnabled();

    if (isLocal) {
      const envPath = path.join(process.cwd(), ".env.local");
      if (existsSync(envPath)) {
        let envContent = await fs.readFile(envPath, "utf8");
        if (/^ADMIN_PASSWORD_HASH=/m.test(envContent)) {
          envContent = envContent.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${newHash}`);
        } else {
          envContent += `\nADMIN_PASSWORD_HASH=${newHash}\n`;
        }
        await fs.writeFile(envPath, envContent, { mode: 0o600 });
      }

      const accessPath = path.join(process.cwd(), ".local-data", "admin-access.txt");
      if (existsSync(accessPath)) {
        let accessContent = await fs.readFile(accessPath, "utf8");
        if (/^Password:\s*.+$/m.test(accessContent)) {
          accessContent = accessContent.replace(/^Password:\s*.+$/m, `Password: ${newPassword}`);
        } else {
          accessContent += `Password: ${newPassword}\n`;
        }
        await fs.writeFile(accessPath, accessContent, { mode: 0o600 });
      }
    }

    process.env.ADMIN_PASSWORD_HASH = newHash;

    const response = NextResponse.json({
      ok: true,
      isLocal,
      newHash,
      message: isLocal
        ? "Password updated successfully and saved to local configuration."
        : "Password updated for this session. Remember to update ADMIN_PASSWORD_HASH in your hosting environment variables."
    }, { headers: privateHeaders });

    if (process.env.ADMIN_SESSION_SECRET) {
      response.cookies.set(
        cookieName,
        signSession(process.env.ADMIN_SESSION_SECRET, sessionSigningHash()),
        {
          httpOnly: true,
          secure: new URL(request.url).protocol === "https:",
          sameSite: "strict",
          path: "/",
          maxAge: 8 * 60 * 60
        }
      );
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to change password. Please try again." }, { status: 500, headers: privateHeaders });
  }
}
