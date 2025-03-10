    "use client";

import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
