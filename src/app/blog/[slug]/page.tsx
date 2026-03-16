import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getDocument } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getCollection("posts");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getDocument("posts", slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.data.title} - SproutLake Blog`,
    description: post.data.excerpt as string,
  };
}

const COLUMNS_GRID: Record<string, string> = {
  "1-1": "1fr 1fr",
  "2-1": "2fr 1fr",
  "1-2": "1fr 2fr",
  "1-1-1": "1fr 1fr 1fr",
  "1-1-1-1": "repeat(4, 1fr)",
};

function renderBlock(block: Record<string, unknown>, index: number) {
  switch (block._block) {
    case "text":
      return (
        <div
          key={index}
          className="prose dark:prose-invert max-w-none prose-gray"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(block.body as string || "") }}
        />
      );
    case "interactive":
      return (
        <div key={index} className="my-8">
          <iframe
            src={`/interactives/${block.interactiveId}.html`}
            title={block.caption as string || "Interactive"}
            style={{ width: "100%", minHeight: "600px", border: "none", borderRadius: "0.75rem" }}
            sandbox="allow-scripts allow-same-origin"
          />
          {block.caption && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{block.caption as string}</p>
          )}
        </div>
      );
    case "image":
      return (
        <figure key={index} className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src as string}
            alt={block.alt as string || ""}
            className="w-full rounded-lg"
          />
          {block.caption && (
            <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{block.caption as string}</figcaption>
          )}
        </figure>
      );
    case "file":
      return (
        <a
          key={index}
          href={block.src as string}
          download
          className="cms-file-attachment flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-green-500 transition-colors no-underline my-4"
        >
          <span className="text-2xl">📎</span>
          <span className="text-sm font-medium">{block.filename as string || (block.src as string).split("/").pop()}</span>
        </a>
      );
    case "video": {
      const videoUrl = block.src as string || "";
      let embedSrc: string | null = null;
      try {
        const u = new URL(videoUrl);
        if (u.hostname.includes("youtube.com")) {
          const id = u.searchParams.get("v");
          if (id) embedSrc = `https://www.youtube.com/embed/${id}`;
        } else if (u.hostname === "youtu.be") {
          embedSrc = `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
        } else if (u.hostname.includes("vimeo.com")) {
          embedSrc = `https://player.vimeo.com/video/${u.pathname.slice(1).split("/")[0]}`;
        }
      } catch {}
      return (
        <div key={index} className="my-8">
          {embedSrc ? (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "0.75rem", overflow: "hidden" }}>
              <iframe
                src={embedSrc}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={block.caption as string || "Video"}
              />
            </div>
          ) : videoUrl ? (
            <video controls src={videoUrl} className="w-full rounded-lg" preload="metadata" />
          ) : null}
          {block.caption && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{block.caption as string}</p>
          )}
        </div>
      );
    }
    case "audio": {
      const audioUrl = block.src as string || "";
      return (
        <div key={index} className="my-8">
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full" preload="metadata" />
          )}
          {block.caption && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{block.caption as string}</p>
          )}
        </div>
      );
    }
    case "columns": {
      const layout = (block.layout as string) || "1-1";
      const gridCols = COLUMNS_GRID[layout] || "1fr 1fr";
      const cols = Array.isArray(block.columns) ? (block.columns as Record<string, unknown>[][]) : [];
      return (
        <div
          key={index}
          className="cms-columns"
          style={{ display: "grid", gridTemplateColumns: gridCols, gap: "2rem" }}
        >
          {cols.map((col, colIdx) => (
            <div key={colIdx}>
              {col.map((child, childIdx) => renderBlock(child, childIdx))}
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getDocument("posts", slug);
  if (!post) notFound();

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-green-400 transition-colors mb-8 inline-flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium text-green-500 uppercase tracking-wider bg-green-500/10 px-2.5 py-1 rounded-full">
              {post.data.category as string}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(post.data.date as string).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-sm text-gray-500">
              &middot; {post.data.author as string}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {post.data.title as string}
          </h1>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
            {post.data.excerpt as string}
          </p>
        </div>
        <hr className="border-gray-200 dark:border-white/10 my-10" />

        {/* Render sections (blocks) if available, fallback to legacy content */}
        {Array.isArray(post.data.sections) && (post.data.sections as Record<string, unknown>[]).length > 0 ? (
          <div className="space-y-8">
            {(post.data.sections as Record<string, unknown>[]).map((block, i) => renderBlock(block, i))}
          </div>
        ) : (
          <div
            className="prose dark:prose-invert max-w-none prose-gray"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(post.data.content as string),
            }}
          />
        )}
        {(post.data.tags as string[])?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
            <div className="flex flex-wrap gap-2">
              {(post.data.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-gray-500 dark:text-gray-400 bg-white/5 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
