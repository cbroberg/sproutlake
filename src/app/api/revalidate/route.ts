import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { notifyContentChange } from "@/lib/content-stream";

const SECRET = process.env.REVALIDATE_SECRET;

/**
 * Write or delete a content file on disk.
 * CMS pushes the full document JSON — no git pull needed.
 */
async function writeContent(
  collection: string,
  slug: string,
  action: string,
  document: Record<string, unknown> | null,
): Promise<"written" | "deleted" | "skipped"> {
  const contentDir = path.join(process.cwd(), "content", collection);
  const filePath = path.join(contentDir, `${slug}.json`);

  // Delete actions: remove file from disk
  if (action === "deleted" || action === "unpublished") {
    try {
      await fs.unlink(filePath);
      return "deleted";
    } catch {
      return "skipped"; // File didn't exist
    }
  }

  // No document in payload (test ping or legacy) — skip
  if (!document) return "skipped";

  // Write document to disk
  await fs.mkdir(contentDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(document, null, 2));
  return "written";
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-cms-signature");
  const body = await request.text();

  // Verify HMAC if secret is configured
  if (SECRET) {
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }
    const expected =
      "sha256=" +
      crypto.createHmac("sha256", SECRET).update(body).digest("hex");
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const payload = JSON.parse(body);
  const paths: string[] = payload.paths ?? ["/"];

  // Content push: write document to disk (or delete it)
  let contentResult: "written" | "deleted" | "skipped" = "skipped";
  if (payload.collection && payload.slug && payload.collection !== "_test") {
    contentResult = await writeContent(
      payload.collection,
      payload.slug,
      payload.action,
      payload.document ?? null,
    );
  }

  for (const p of paths) {
    revalidatePath(p);
  }

  // Notify connected browsers to refresh
  notifyContentChange(paths);

  console.log(
    `[revalidate] ${payload.action ?? "unknown"} → ${paths.join(", ")} (${contentResult})`
  );

  return NextResponse.json({
    revalidated: true,
    paths,
    contentResult,
    timestamp: new Date().toISOString(),
  });
}
