import Link from "next/link";
import { getCollection } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infographics - SproutLake",
  description:
    "Visual deep-dives into SproutLake's AI technology, architecture, and features.",
};

export default function InfographicsPage() {
  const infographics = getCollection("infographics");

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold">Infographics</h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Visual deep-dives into SproutLake&apos;s AI technology,
            architecture, and features.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infographics.map((info) => (
            <Link
              key={info.id}
              href={`/infographics/${info.slug}`}
              className="group bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl p-8 hover:border-green-500/30 transition-colors flex flex-col"
            >
              <span className="text-xs font-medium text-green-500 uppercase tracking-wider bg-green-500/10 px-2.5 py-1 rounded-full self-start mb-4">
                {info.data.category as string}
              </span>
              <h2 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                {info.data.title as string}
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">
                {info.data.description as string}
              </p>
              <div className="mt-6 text-green-500 text-sm font-medium group-hover:text-green-400 transition-colors flex items-center gap-1">
                Read more
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
