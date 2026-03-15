import Link from "next/link";
import { getCollection } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcasts - SproutLake",
  description: "Listen to SproutLake's podcast series about AI-powered farm management, anomaly detection, and the future of agriculture.",
};

export default function PodcastsPage() {
  const podcasts = getCollection("podcasts");

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">Podcasts</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900 dark:text-white">
            Listen & Learn
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Deep dives into AI-powered farm management, anomaly detection, and the future of agriculture.
          </p>
        </div>

        <div className="space-y-6">
          {podcasts.map((ep) => (
            <Link
              key={ep.slug}
              href={`/podcasts/${ep.slug}`}
              className="block bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-xl p-6 hover:border-green-500/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
                    {ep.data.title as string}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {ep.data.description as string}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>{ep.data.duration as string}</span>
                    <span>{ep.data.date as string}</span>
                    {(ep.data.tags as string[])?.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
