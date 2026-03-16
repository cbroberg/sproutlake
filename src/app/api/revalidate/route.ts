import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const SECRET = process.env.REVALIDATE_SECRET;

/**
 * Pull latest content from GitHub before revalidating.
 * In dev mode this triggers HMR; in production it updates the local checkout.
 */
async function gitPull(): Promise<string[]> {
  try {
    const cwd = process.cwd();
    await exec("git", ["fetch", "origin", "--quiet"], { cwd });
    const { stdout: before } = await exec("git", ["rev-parse", "HEAD"], { cwd });
    const { stdout: remote } = await exec("git", ["rev-parse", "origin/main"], { cwd });

    if (before.trim() === remote.trim()) return []; // Already up to date

    // Get changed files before pulling
    const { stdout: diff } = await exec("git", ["diff", "--name-only", before.trim(), remote.trim()], { cwd });
    await exec("git", ["pull", "--ff-only", "--quiet"], { cwd });

    return diff.trim().split("\n").filter(Boolean);
  } catch (err) {
    console.warn("[revalidate] git pull failed:", err);
    return [];
  }
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

  // Pull latest from GitHub, then revalidate
  const changedFiles = await gitPull();

  for (const path of paths) {
    revalidatePath(path);
  }

  console.log(
    `[revalidate] ${payload.action ?? "unknown"} → ${paths.join(", ")}${changedFiles.length ? ` (pulled ${changedFiles.length} files)` : ""}`
  );

  return NextResponse.json({
    revalidated: true,
    paths,
    pulled: changedFiles.length,
    timestamp: new Date().toISOString(),
  });
}
