import fs from "fs";
import path from "path";

export interface Document {
  id: string;
  slug: string;
  collection: string;
  status: string;
  data: Record<string, unknown>;
  _fieldMeta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export function getCollection(name: string): Document[] {
  const dir = path.join(process.cwd(), "content", name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")))
    .filter((doc: Document) => doc.status === "published")
    .sort(
      (a: Document, b: Document) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export function getDocument(
  collection: string,
  slug: string
): Document | null {
  const file = path.join(
    process.cwd(),
    "content",
    collection,
    `${slug}.json`
  );
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}
