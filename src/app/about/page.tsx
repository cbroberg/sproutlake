import Link from "next/link";
import { getDocument } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - SproutLake",
  description:
    "Rooted in Data, Grown for Farmers. Learn about SproutLake's mission to empower farmers with intelligent technology.",
};

export default function AboutPage() {
  const page = getDocument("pages", "about");
  if (!page) return <div>Page not found</div>;

  return (
    <>
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold">
              {page.data.heroTitle as string}
            </h1>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              {page.data.heroSubtitle as string}
            </p>
          </div>
          <div
            className="prose dark:prose-invert max-w-none prose-gray"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(page.data.content as string),
            }}
          />
          <div className="mt-12">
            <Link
              href={page.data.ctaLink as string}
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-green-500 text-black font-semibold text-lg hover:bg-green-400 transition-colors"
            >
              {page.data.ctaText as string}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
