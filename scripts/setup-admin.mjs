import { randomBytes } from "node:crypto";
import { existsSync,readFileSync,writeFileSync,mkdirSync } from "node:fs";
import { passwordHash } from "../lib/admin-security.mjs";
const envPath=".env.local";
const previous=existsSync(envPath)?readFileSync(envPath,"utf8"):"";
if(/^ADMIN_PASSWORD_HASH=/m.test(previous))throw new Error("Admin credentials already exist. Rotate them explicitly rather than overwriting.");
const password=randomBytes(24).toString("base64url");
const values="\nCMS_LOCAL_STORE=1\nADMIN_PASSWORD_HASH="+passwordHash(password)+"\nADMIN_SESSION_SECRET="+randomBytes(48).toString("hex")+"\n";
writeFileSync(envPath,previous+values,{mode:0o600});
mkdirSync(".local-data",{recursive:true});
writeFileSync(".local-data/admin-access.txt","Local control panel: http://localhost:5173/admin\nPassword: "+password+"\n\nKeep this file private. For production set ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET from .env.local as encrypted hosting variables. CMS_LOCAL_STORE is local only.\n",{mode:0o600});
console.log("Local admin access created. Password is in .local-data/admin-access.txt. No credential was printed.");

