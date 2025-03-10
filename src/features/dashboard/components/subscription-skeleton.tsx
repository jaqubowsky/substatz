"use client";

export const SubscriptionSkeleton = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border animate-pulse">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-6 w-32 bg-muted rounded mb-2"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div className="text-right">
          <div className="h-7 w-20 bg-muted rounded mb-2"></div>
          <div className="h-4 w-16 bg-muted rounded"></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-4 w-24 bg-muted rounded mb-2"></div>
            <div className="h-5 w-28 bg-muted rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-9 w-20 bg-muted rounded"></div>
            <div className="h-9 w-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
