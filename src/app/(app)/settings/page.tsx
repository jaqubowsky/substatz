import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "@/features/settings";
import { getServerAuth } from "@/hooks/get-server-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your settings",
};

function SettingsSkeleton() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <Skeleton className="h-10 w-40 mb-8" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SettingsPage() {
  const session = await getServerAuth();
  if (!session) redirect("/login");

  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <Settings />
    </Suspense>
  );
}
