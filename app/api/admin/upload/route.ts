import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isAdmin, sameOrigin, privateHeaders } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Use this website to upload media." }, { status: 403, headers: privateHeaders });
  }
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Sign in as administrator to upload media." }, { status: 401, headers: privateHeaders });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const allFiles = files.length ? files : (singleFile ? [singleFile] : []);

    if (!allFiles.length) {
      return NextResponse.json({ error: "No files provided." }, { status: 400, headers: privateHeaders });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const results = [];

    for (const file of allFiles) {
      if (typeof file.arrayBuffer !== "function") continue;

      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json({ error: `File ${file.name} is too large. Maximum size is 100MB.` }, { status: 400, headers: privateHeaders });
      }

      const originalExt = path.extname(file.name).toLowerCase();
      const base = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
      const safeName = `${Date.now()}_${base}${originalExt || ".bin"}`;
      const filePath = path.join(uploadDir, safeName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      results.push({
        url: `/uploads/${safeName}`,
        name: file.name
      });
    }

    return NextResponse.json({
      ok: true,
      files: results,
      url: results[0]?.url,
      name: results[0]?.name
    }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Failed to upload file. Please try again." }, { status: 500, headers: privateHeaders });
  }
}
