import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Settings } from "@/features/settings";
import { getServerAuth } from "@/hooks/get-server-auth";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your settings",
};

export default async function SettingsPage() {
  const session = await getServerAuth();
  if (!session) redirect("/login");

  return <Settings />;
}
