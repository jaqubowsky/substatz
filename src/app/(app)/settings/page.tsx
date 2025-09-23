import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerAuth } from "@/hooks/get-server-auth";
import { Settings } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your settings",
};

export default async function SettingsPage() {
  const session = await getServerAuth();
  if (!session) redirect("/login");

  return <Settings />;
}
