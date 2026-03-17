"use client";

import Link from "next/link";
import { useTheme } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { theme } = useTheme();
  const logo = theme === "dark" ? "/images/sproutlake-white.svg" : "/images/sproutlake.svg";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 dark:bg-[#0a0a0a]/90 bg-white/90 backdrop-blur-md border-b border-white/5 dark:border-white/5 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-32">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="SproutLake"
              className="h-10 md:h-[100px] w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="/blog" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/infographics" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Infographics
            </Link>
            <Link href="/podcasts" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Podcasts
            </Link>
            <Link href="/#pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Pricing
            </Link>
            <ThemeToggle />
            <Link
              href="/#contact"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition-colors"
            >
              Request Demo
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu() {
  return (
    <details className="group relative">
      <summary className="list-none cursor-pointer text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-4 flex flex-col gap-3">
        <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1">Home</Link>
        <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1">About</Link>
        <Link href="/blog" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1">Blog</Link>
        <Link href="/infographics" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1">Infographics</Link>
        <Link href="/podcasts" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1">Podcasts</Link>
        <Link href="/#pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1">Pricing</Link>
        <Link href="/#contact" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition-colors">
          Request Demo
        </Link>
      </div>
    </details>
  );
}
