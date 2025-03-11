import { Settings } from "@/features/settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your settings",
};

export default function SettingsPage() {
  return <Settings />;
}
