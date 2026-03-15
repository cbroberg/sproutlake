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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div
          className="prose dark:prose-invert max-w-none prose-gray"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(post.data.content as string),
          }}
        />
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
