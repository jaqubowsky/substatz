import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SubscriptEase",
    default: "SubscriptEase - Manage All Your Subscriptions in One Place",
  },
  description:
    "SubscriptEase helps you track all your subscriptions in one place, with timely reminders and detailed insights on your spending.",
  keywords: [
    "subscription management",
    "subscription tracker",
    "manage subscriptions",
    "subscription reminder",
  ],
  authors: [{ name: "SubscriptEase Team" }],
  creator: "SubscriptEase",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://subscriptease.com",
    title: "SubscriptEase - Manage All Your Subscriptions in One Place",
    description:
      "SubscriptEase helps you track all your subscriptions in one place, with timely reminders and detailed insights on your spending.",
    siteName: "SubscriptEase",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubscriptEase - Manage All Your Subscriptions in One Place",
    description:
      "SubscriptEase helps you track all your subscriptions in one place, with timely reminders and detailed insights on your spending.",
    creator: "@subscriptease",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
