import { LandingPage } from "@/features/landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SubscriptEase - Manage Your Subscriptions Easily",
  description:
    "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment with SubscriptEase.",
  keywords: [
    "subscription management",
    "subscription tracker",
    "manage subscriptions",
    "subscription organizer",
  ],
  alternates: {
    canonical: "https://subscriptease.com",
  },
  openGraph: {
    title: "SubscriptEase - Manage Your Subscriptions Easily",
    description:
      "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment.",
    url: "https://subscriptease.com",
    siteName: "SubscriptEase",
    images: [
      {
        url: "https://subscriptease.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SubscriptEase - Subscription Management Made Easy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubscriptEase - Manage Your Subscriptions Easily",
    description:
      "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment.",
    images: ["https://subscriptease.com/twitter-image.jpg"],
  },
};

export default function Home() {
  return <LandingPage />;
}
