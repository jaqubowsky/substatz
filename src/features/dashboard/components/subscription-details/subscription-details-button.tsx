"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { ReactNode, Suspense, useState } from "react";

interface SubscriptionDetailsButtonProps {
  children: ReactNode;
}

const DetailsLoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export function SubscriptionDetailsButton({
  children,
}: SubscriptionDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          <Info className="h-3.5 w-3.5" />
          Details
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <Suspense fallback={<DetailsLoadingSkeleton />}>{children}</Suspense>
        </DialogContent>
      )}
    </Dialog>
  );
}
