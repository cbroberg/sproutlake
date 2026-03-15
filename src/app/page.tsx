import Image from "next/image";
import Link from "next/link";
import { getCollection, getDocument } from "@/lib/content";
import { Icon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SproutLake - From Data to Decisions",
  description:
    "SproutLake is the all-in-one IoT platform that gives you real-time visibility and control over your most critical farm operations.",
};

export default function HomePage() {
  const page = getDocument("pages", "home");
  const problems = getCollection("problems").sort(
    (a, b) => (a.data.sortOrder as number) - (b.data.sortOrder as number)
  );
  const features = getCollection("features").sort(
    (a, b) => (a.data.sortOrder as number) - (b.data.sortOrder as number)
  );
  const pricing = getCollection("pricing").sort((a, b) => {
    const order = { Starter: 1, Professional: 2, Enterprise: 3 };
    return (
      (order[a.data.planName as keyof typeof order] || 99) -
      (order[b.data.planName as keyof typeof order] || 99)
    );
  });

  if (!page) return <div>Page not found</div>;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/pigs-outside-1440.jpeg"
            alt="Farm background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-44">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              {page.data.heroTitle as string}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              {page.data.heroSubtitle as string}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={page.data.ctaLink as string}
                className="inline-flex items-center px-8 py-3.5 rounded-lg bg-green-500 text-black font-semibold text-lg hover:bg-green-400 transition-colors"
              >
                {page.data.ctaText as string}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-3.5 rounded-lg border border-white/20 text-white font-semibold text-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="py-24 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              The Challenges You Face
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Modern farming is more complex than ever. These are the problems
              we solve.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                  <Icon
                    name={problem.data.icon as string}
                    className="w-6 h-6 text-red-400"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {problem.data.title as string}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {problem.data.description as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 bg-white dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">
                The Solution
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                Your Farm, Fully Optimized.
              </h2>
              <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                We transform your farm into a smart, responsive environment.
                SproutLake bridges the gap between your animals, your equipment,
                and you. Our network of durable sensors monitors your operations
                24/7 and delivers clear, actionable insights directly to your
                phone, tablet, or computer.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Install rugged, wireless sensors with minimal disruption",
                  "Monitor real-time data on your secure dashboard",
                  "Make smarter, data-driven decisions",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-green-400 text-sm font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5">
                <Image
                  src="/images/sproutlake-piglets.png"
                  alt="SproutLake piglet monitoring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Everything You Need to Run a Smarter Farm
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              From IoT sensors to AI-powered insights, SproutLake delivers a
              complete platform for modern agriculture.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-green-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Icon
                    name={feature.data.icon as string}
                    className="w-6 h-6 text-green-400"
                  />
                </div>
                <span className="text-xs font-medium text-green-500/70 uppercase tracking-wider">
                  {feature.data.category as string}
                </span>
                <h3 className="text-lg font-semibold mt-1 mb-2">
                  {feature.data.title as string}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.data.description as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Plans for Every Farm Size
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Start small and scale as you grow. All plans include our core
              hardware and software platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan) => {
              const highlighted = plan.data.highlighted as boolean;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 ${
                    highlighted
                      ? "bg-green-500/5 border-2 border-green-500/40"
                      : "bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/5"
                  }`}
                >
                  {highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold">
                    {plan.data.planName as string}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {plan.data.maxSows as string}
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold">
                      {plan.data.priceAnnual as string}
                    </span>
                    {(plan.data.priceAnnual as string) !== "Contact us" && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        {plan.data.currency as string}/year
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    {plan.data.description as string}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {(plan.data.featuresIncluded as string[]).map(
                      (feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                          <svg
                            className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feat}
                        </li>
                      )
                    )}
                  </ul>
                  {(plan.data.addons as Array<{ name: string; price: string }>)
                    ?.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Add-ons
                      </p>
                      {(
                        plan.data.addons as Array<{
                          name: string;
                          price: string;
                        }>
                      ).map((addon, i) => (
                        <p key={i} className="text-sm text-gray-500 dark:text-gray-400">
                          {addon.name} — {addon.price}
                        </p>
                      ))}
                    </div>
                  )}
                  <Link
                    href="#contact"
                    className={`mt-8 block text-center py-3 rounded-lg font-semibold transition-colors ${
                      highlighted
                        ? "bg-green-500 text-black hover:bg-green-400"
                        : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {(plan.data.priceAnnual as string) === "Contact us"
                      ? "Contact Sales"
                      : "Get Started"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Ready to See the Difference Data Can Make?
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Schedule a free, no-obligation demo with a SproutLake specialist.
            We&apos;ll walk you through the platform and discuss how we can
            tailor a solution to your specific operational goals.
          </p>
          <form className="mt-10 max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
            />
            <textarea
              placeholder="Tell us about your farm"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors"
            >
              Request a Free Demo
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
