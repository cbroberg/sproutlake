import Link from "next/link";
import { getCollection } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - SproutLake",
  description:
    "Insights, updates, and technical deep-dives from the SproutLake team.",
};

export default function BlogPage() {
  const posts = getCollection("posts").sort(
    (a, b) =>
      new Date(b.data.date as string).getTime() -
      new Date(a.data.date as string).getTime()
  );

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold">Blog</h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Insights, updates, and technical deep-dives from the SproutLake
            team.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl p-8 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium text-green-500 uppercase tracking-wider bg-green-500/10 px-2.5 py-1 rounded-full">
                  {post.data.category as string}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.data.date as string).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              <h2 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                {post.data.title as string}
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {post.data.excerpt as string}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  By {post.data.author as string}
                </span>
              </div>
              {(post.data.tags as string[])?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(post.data.tags as string[]).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
