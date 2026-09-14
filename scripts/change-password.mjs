import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { passwordHash } from "../lib/admin-security.mjs";

const newPassword = process.argv[2] || randomBytes(24).toString("base64url");
if (newPassword.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const newHash = passwordHash(newPassword);

const envPath = ".env.local";
if (existsSync(envPath)) {
  let env = readFileSync(envPath, "utf8");
  if (/^ADMIN_PASSWORD_HASH=/m.test(env)) {
    env = env.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${newHash}`);
  } else {
    env += `\nADMIN_PASSWORD_HASH=${newHash}\n`;
  }
  writeFileSync(envPath, env, { mode: 0o600 });
  console.log("Updated .env.local with new password hash.");
}

const accessPath = ".local-data/admin-access.txt";
if (existsSync(accessPath)) {
  let access = readFileSync(accessPath, "utf8");
  if (/^Password:\s*.+$/m.test(access)) {
    access = access.replace(/^Password:\s*.+$/m, `Password: ${newPassword}`);
  } else {
    access += `Password: ${newPassword}\n`;
  }
  writeFileSync(accessPath, access, { mode: 0o600 });
  console.log("Updated .local-data/admin-access.txt with new password.");
}

console.log("\nAdmin password updated successfully.");
console.log("New password: " + newPassword);
console.log("For production (e.g. Vercel), set ADMIN_PASSWORD_HASH as:");
console.log(newHash + "\n");
