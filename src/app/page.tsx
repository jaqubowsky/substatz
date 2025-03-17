import { LandingPage } from "@/features/landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SubStatz - Manage Your Subscriptions Easily",
  description:
    "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment with SubStatz.",
  keywords: [
    "subscription management",
    "subscription tracker",
    "manage subscriptions",
    "subscription organizer",
  ],
  alternates: {
    canonical: "https://substatz.me",
  },
  openGraph: {
    title: "SubStatz - Manage Your Subscriptions Easily",
    description:
      "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment.",
    url: "https://substatz.me",
    siteName: "SubStatz",
    images: [
      {
        url: "https://substatz.me/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SubStatz - Subscription Management Made Easy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubStatz - Manage Your Subscriptions Easily",
    description:
      "Track, manage, and optimize all your subscriptions in one place. Save money and never miss a payment.",
    images: ["https://substatz.me/twitter-image.jpg"],
  },
};

export default function Home() {
  return <LandingPage />;
}
