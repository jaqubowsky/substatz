import "@/app/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Providers } from "@/app/providers";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: {
    default: "SubStatz - Subscription Management Made Easy",
    template: "%s | SubStatz",
  },
  description:
    "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment with SubStatz.",
  generator: "Next.js",
  applicationName: "SubStatz",
  referrer: "origin-when-cross-origin",
  keywords: [
    "subscription management",
    "subscription tracker",
    "manage subscriptions",
    "subscription organizer",
    "track subscriptions",
    "subscription analytics",
    "save money on subscriptions",
  ],
  authors: [{ name: "SubStatz Team" }],
  category: "Finance",
  creator: "SubStatz Team",
  publisher: "SubStatz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(env.BASE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "SubStatz - Subscription Management Made Easy",
    description:
      "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment.",
    url: env.BASE_URL,
    siteName: "SubStatz",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SubStatz - Subscription Management Made Easy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "SubStatz - Subscription Management Made Easy",
    description:
      "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment.",
    creator: "@SubStatz",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background font-sans antialiased`}
        style={{ scrollBehavior: "smooth" }}
      >
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
