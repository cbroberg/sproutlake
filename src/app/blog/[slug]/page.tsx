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
            {(post.data.sections as Record<string, unknown>[]).map((block, i) => {
              switch (block._block) {
                case "text":
                  return (
                    <div
                      key={i}
                      className="prose dark:prose-invert max-w-none prose-gray"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(block.body as string || "") }}
                    />
                  );
                case "interactive":
                  return (
                    <div key={i} className="my-8">
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
                    <figure key={i} className="my-8">
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
                      key={i}
                      href={block.src as string}
                      download
                      className="cms-file-attachment flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-green-500 transition-colors no-underline my-4"
                    >
                      <span className="text-2xl">📎</span>
                      <span className="text-sm font-medium">{block.filename as string || (block.src as string).split("/").pop()}</span>
                    </a>
                  );
                default:
                  return null;
              }
            })}
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
