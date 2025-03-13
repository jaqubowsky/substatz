import "@/app/globals.css";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SubscriptEase - Dashboard",
  description: "Track and manage all your subscriptions in one place",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col bg-secondary/30">{children}</main>
      <AppFooter />
    </div>
  );
}
