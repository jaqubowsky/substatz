import { Dashboard } from "@/features/dashboard/components/dashboard";
import { getServerAuth } from "@/hooks/get-server-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your subscriptions",
};

export default async function DashboardPage() {
  const session = await getServerAuth();
  if (!session) redirect("/login");

  return <Dashboard />;
}
