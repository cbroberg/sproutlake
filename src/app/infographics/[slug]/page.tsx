import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getDocument } from "@/lib/content";
import type { Metadata } from "next";

const INFOGRAPHIC_FILES: Record<string, string> = {
  "hybrid-ai-engine": "/interactives/hybrid-ai-engine.html",
  "ai-anomaly-detection": "/interactives/water-consumption-chart.html",
  "statistical-anomaly-detection": "/interactives/statistical-anomaly-detection.html",
  "three-lane-ai-highway": "/interactives/three-lane-ai-highway.html",
  "proactive-health-forecaster": "/interactives/proactive-health-forecaster.html",
};

export async function generateStaticParams() {
  return getCollection("infographics").map((info) => ({ slug: info.slug }));
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

  const htmlFile = INFOGRAPHIC_FILES[slug];

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/infographics"
          className="text-sm text-gray-500 hover:text-green-400 transition-colors mb-8 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Infographics
        </Link>
        <div className="mt-6 mb-8">
          <span className="text-xs font-medium text-green-500 uppercase tracking-wider bg-green-500/10 px-2.5 py-1 rounded-full">
            {info.data.category as string}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mt-6 text-gray-900 dark:text-white">
            {info.data.title as string}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {info.data.description as string}
          </p>
        </div>

        {/* Interactive infographic — full HTML page in iframe via src */}
        {htmlFile && (
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg">
            <iframe
              src={htmlFile}
              className="w-full border-0"
              style={{ minHeight: "1200px" }}
              title={info.data.title as string}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </div>
    </section>
  );
}
