import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/components/ConvexProviderWithClerk";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEO Reports Generator - Powered by Bright Data & AI",
  description: "Generate beautiful, comprehensive SEO reports in seconds using Bright Data's SERP Perplexity Scraper. Chat with your reports using AI. Start free today!",
  keywords: "SEO reports, SERP analysis, Bright Data, AI chat, keyword research, competitor analysis",
  authors: [{ name: "SEO SaaS" }],
  openGraph: {
    title: "SEO Reports Generator - Powered by Bright Data & AI",
    description: "Generate beautiful, comprehensive SEO reports in seconds using Bright Data's SERP Perplexity Scraper. Chat with your reports using AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
