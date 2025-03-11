import { Dashboard } from "@/features/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your subscriptions",
};

export default function DashboardPage() {
  return <Dashboard />;
}
