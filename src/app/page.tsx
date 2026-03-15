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
      {/* Hero — centered text like demo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={page.data.heroImage as string || "/images/pigs-outside-1440.jpeg"}
            alt="Farm background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-44">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
              {page.data.heroTitle as string}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
              {page.data.heroSubtitle as string}
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                href={page.data.ctaLink as string}
                className="inline-flex items-center px-10 py-4 rounded-lg bg-green-500 text-black font-bold text-lg hover:bg-green-400 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {page.data.ctaText as string}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="py-20 bg-white dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Are You Missing the Insights That Matter Most?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Managing a modern farm is more complex than ever. You can&apos;t be
              everywhere at once, and small issues can quickly turn into costly
              problems.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem, idx) => {
              const svgIcons = [
                /* Clock */
                <svg key="clock" className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                /* Heart */
                <svg key="heart" className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                /* Lightning */
                <svg key="zap" className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                /* Puzzle / Question */
                <svg key="question" className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              ];
              return (
                <div
                  key={problem.id}
                  className="bg-gray-50 dark:bg-[#141414] rounded-lg p-6 text-center shadow-md dark:shadow-none dark:border dark:border-white/5"
                >
                  <div className="flex justify-center mb-4">
                    {svgIcons[idx] || svgIcons[0]}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {problem.data.title as string}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {problem.data.description as string}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution — image LEFT, text RIGHT */}
      <section id="solution" className="py-20 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={page.data.solutionImage as string || "/images/sproutlake-piglets.png"}
                  alt="Farmer using tablet to monitor farm"
                  width={640}
                  height={480}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                SproutLake: Your Farm, Fully Optimized.
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                We transform your farm into a smart, responsive environment.
                SproutLake bridges the gap between your animals, your equipment,
                and you. Our network of durable sensors monitors your operations
                24/7 and delivers clear, actionable insights directly to your
                phone, tablet, or computer.
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Stop guessing, start knowing.
              </p>
            </div>
          </div>

          {/* 3 mini icons row */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              {/* IoT Sensors */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10 mb-6">
                  <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13a10 10 0 0114 0m-7 5a3 3 0 013-3m-6 0a3 3 0 016 0m-3 3v.01" /></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">IoT Sensors</h3>
                <p className="text-gray-600 dark:text-gray-400">Durable, wireless sensors that withstand tough farm conditions</p>
              </div>
              {/* Real-Time Monitoring */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10 mb-6">
                  <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="14" height="20" x="5" y="2" rx="2" strokeWidth={2} /><path d="M12 18h.01" strokeWidth={2} /></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Real-Time Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-400">Access your data anywhere, anytime from any device</p>
              </div>
              {/* Smart Analytics */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10 mb-6">
                  <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="4" height="12" x="3" y="8" rx="1" strokeWidth={2} /><rect width="4" height="16" x="10" y="4" rx="1" strokeWidth={2} /><rect width="4" height="8" x="17" y="12" rx="1" strokeWidth={2} /></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Smart Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">AI-powered insights that help you make better decisions</p>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold py-3 px-8 rounded-lg text-lg hover:bg-green-400 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                See How It Works
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
            Get Started in Three Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Dashed connector line for desktop */}
            <div className="hidden md:block absolute top-10 left-[16.6%] right-[16.6%] border-t-2 border-dashed border-gray-300 dark:border-gray-700" />

            {/* Step 1 */}
            <div className="relative z-10">
              <div className="bg-green-500 text-white w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Install the Hardware</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our rugged, wireless sensors are built to withstand the toughest
                farm conditions. Installation is simple, getting you up and
                running with minimal disruption.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative z-10">
              <div className="bg-green-500 text-white w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Monitor Your Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Data streams in real-time to your secure dashboard. View
                heatmaps, track activity, and receive instant alerts for events
                that need your attention.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative z-10">
              <div className="bg-green-500 text-white w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Make Smarter Decisions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use powerful analytics to prevent problems and make data-driven
                decisions that improve your farm&apos;s productivity and
                profitability.
              </p>
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
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900 dark:text-white">
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
                className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-green-500/30 transition-colors group shadow-md dark:shadow-none"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-500/20 transition-colors">
                  <Icon
                    name={feature.data.icon as string}
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                  />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-500/70 uppercase tracking-wider">
                  {feature.data.category as string}
                </span>
                <h3 className="text-lg font-semibold mt-1 mb-2 text-gray-900 dark:text-white">
                  {feature.data.title as string}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.data.description as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generative AI Section */}
      <section id="generative-ai" className="py-20 bg-gray-800 dark:bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Powered by Generative AI
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-lg">
              SproutLake integrates the power of advanced AI models to bring you
              cutting-edge, AI-driven insights that were never before possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* AI Card 1 */}
            <div className="bg-gray-700/50 dark:bg-white/5 text-white p-8 rounded-lg shadow-lg flex items-start space-x-6 border border-gray-600/50 dark:border-white/10">
              <div className="bg-green-500 p-3 rounded-full shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Anomaly Detection</h3>
                <p className="text-gray-300">
                  Let SproutLake AI analyze your data streams 24/7. Get
                  predictive alerts for potential health issues or equipment
                  malfunctions <em>before</em> they become critical problems,
                  based on subtle patterns humans can&apos;t see.
                </p>
              </div>
            </div>
            {/* AI Card 2 */}
            <div className="bg-gray-700/50 dark:bg-white/5 text-white p-8 rounded-lg shadow-lg flex items-start space-x-6 border border-gray-600/50 dark:border-white/10">
              <div className="bg-green-500 p-3 rounded-full shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Natural Language Reporting</h3>
                <p className="text-gray-300">
                  Ask your farm questions in plain English. &quot;Summarize the
                  farrowing performance for Barn 3 this month&quot; or
                  &quot;What&apos;s my average daily energy and water
                  consumption?&quot; and get instant, easy-to-understand answers
                  from your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / About Section */}
      <section id="about" className="py-20 bg-gray-900 dark:bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-green-400 mb-4">Our Mission</h3>
          <p className="text-2xl sm:text-3xl max-w-4xl mx-auto mb-10 italic leading-relaxed">
            To empower farmers across the globe with robust, intuitive
            technology, leading to more productive, sustainable, and profitable
            operations for generations to come.
          </p>
          <div className="border-t border-gray-600 max-w-md mx-auto" />
          <h3 className="text-xl font-semibold text-green-400 mt-10 mb-4">About SproutLake</h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-6">
            SproutLake is a proud joint venture between leaders in agricultural
            IoT hardware and enterprise cloud software. We&apos;ve combined
            decades of experience in building durable, reliable farm technology
            with cutting-edge data analytics to create a single, powerful
            platform built for the future of agriculture.
          </p>
          <Link
            href="/about"
            className="inline-block bg-green-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-green-400 transition-colors"
          >
            More
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900 dark:text-white">
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
                      ? "bg-green-50 dark:bg-green-500/5 border-2 border-green-500/40"
                      : "bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5"
                  }`}
                >
                  {highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.data.planName as string}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {plan.data.maxSows as string}
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
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
                        : "bg-gray-200 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/10"
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
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900 dark:text-white">
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
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#141414] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#141414] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
            />
            <textarea
              placeholder="Tell us about your farm"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#141414] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 resize-none"
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
