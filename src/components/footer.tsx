import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Image
              src="/images/sproutlake-white.svg"
              alt="SproutLake"
              width={160}
              height={36}
            />
            <p className="mt-4 text-gray-400 text-sm max-w-md leading-relaxed">
              SproutLake is the all-in-one IoT platform that gives you
              real-time visibility and control over your most critical farm
              operations.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/infographics"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Infographics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SproutLake. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
