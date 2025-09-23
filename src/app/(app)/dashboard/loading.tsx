import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
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
