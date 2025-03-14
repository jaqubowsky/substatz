import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SettingsComponent = dynamic(
  () => import("@/features/settings").then((mod) => mod.Settings),
  { ssr: true }
);

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

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsComponent />
    </Suspense>
  );
}
