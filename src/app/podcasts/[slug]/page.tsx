import { getDocument, getCollection } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCollection("podcasts").map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ep = getDocument("podcasts", slug);
  if (!ep) return { title: "Not Found" };
  return {
    title: `${ep.data.title} - SproutLake Podcasts`,
    description: ep.data.description as string,
  };
}

export default async function PodcastPage({ params }: Props) {
  const { slug } = await params;
  const ep = getDocument("podcasts", slug);
  if (!ep) notFound();

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/podcasts" className="text-sm text-green-500 hover:text-green-400 mb-8 inline-block">
          &larr; Back to Podcasts
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          {ep.data.title as string}
        </h1>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {ep.data.description as string}
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span>{ep.data.duration as string}</span>
          <span>{ep.data.date as string}</span>
        </div>

        {/* Audio player */}
        {(ep.data.audioFile as string) && (
          <div className="mt-8 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl p-6">
            <audio
              controls
              src={ep.data.audioFile as string}
              className="w-full"
              preload="metadata"
            />
          </div>
        )}

        {/* Tags */}
        {(ep.data.tags as string[])?.length > 0 && (
          <div className="mt-6 flex gap-2 flex-wrap">
            {(ep.data.tags as string[]).map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Transcript */}
        {(ep.data.transcript as string) && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transcript</h2>
            <div
              className="prose dark:prose-invert max-w-none prose-gray"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(ep.data.transcript as string),
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
