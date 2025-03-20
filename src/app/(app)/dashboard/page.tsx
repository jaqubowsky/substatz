import { auth } from "@/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const DashboardComponent = dynamic(
  () => import("@/features/dashboard").then((mod) => mod.Dashboard),
  { ssr: true }
);

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
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardComponent />
    </Suspense>
  );
}
