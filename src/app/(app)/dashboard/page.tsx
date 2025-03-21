import { Skeleton } from "@/components/ui/skeleton";
import { Dashboard } from "@/features/dashboard/components/dashboard";
import { getServerAuth } from "@/hooks/get-server-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your subscriptions",
};

function DashboardSkeleton() {
  return (
    <div className="container px-4 py-8 mx-auto space-y-6">
      <Skeleton className="h-12 w-48 mb-6" />
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-lg mt-8" />
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerAuth();
  if (!session) redirect("/login");

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
