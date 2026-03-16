import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { LiveRefresh } from "@/components/live-refresh";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SproutLake - Optimizing Productive Farms",
  description:
    "SproutLake is the all-in-one IoT platform that gives you real-time visibility and control over your most critical farm operations.",
  icons: {
    icon: "/images/sproutlake.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <LiveRefresh />
        </ThemeProvider>
      </body>
    </html>
  );
}
