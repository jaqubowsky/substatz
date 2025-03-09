import { LandingPage } from "@/features/landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SubscriptEase - Manage All Your Subscriptions in One Place",
  description:
    "SubscriptEase helps you track all your subscriptions in one place, with timely reminders and detailed insights on your spending.",
};

export default function Home() {
  return <LandingPage />;
}
