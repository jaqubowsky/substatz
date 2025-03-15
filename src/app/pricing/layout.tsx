import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | SubscriptEase",
  description: "Choose the right plan for managing your subscriptions",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
