import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getDocument } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { HtmlRenderer } from "@/components/html-renderer";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const infographics = getCollection("infographics");
  return infographics.map((info) => ({ slug: info.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = getDocument("infographics", slug);
  if (!info) return { title: "Not Found" };
  return {
    title: `${info.data.title} - SproutLake Infographics`,
    description: info.data.description as string,
  };
}

export default async function InfographicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = getDocument("infographics", slug);
  if (!info) notFound();

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/infographics"
          className="text-sm text-gray-500 hover:text-green-400 transition-colors mb-8 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Infographics
        </Link>
        <div className="mt-6 mb-10">
          <span className="text-xs font-medium text-green-500 uppercase tracking-wider bg-green-500/10 px-2.5 py-1 rounded-full">
            {info.data.category as string}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-6 text-gray-900 dark:text-white">
            {info.data.title as string}
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {info.data.description as string}
          </p>
        </div>

        {/* Interactive HTML infographic — scripts execute properly */}
        {info.data.htmlContent && (
          <HtmlRenderer html={info.data.htmlContent as string} />
        )}

        {/* Markdown content — only show if no interactive HTML */}
        {!info.data.htmlContent && info.data.content && (
          <div
            className="prose dark:prose-invert max-w-none prose-gray mt-10"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(info.data.content as string),
            }}
          />
        )}
      </div>
    </section>
  );
}
