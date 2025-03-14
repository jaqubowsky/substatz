import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSummary = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-5 w-24 mt-4" />
      <Skeleton className="h-7 w-28" />
      <Separator className="my-4" />
      <Skeleton className="h-5 w-32" />
      <div className="space-y-2 mt-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
};
