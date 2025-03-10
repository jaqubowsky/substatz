"use client";

import { PlusCircle } from "lucide-react";
import { useSubscriptions } from "../hooks/use-subscriptions";
import { Subscription } from "../schemas/subscription";
import { SubscriptionCard } from "./subscription-card";
import { SubscriptionSkeleton } from "./subscription-skeleton";

export const SubscriptionList = () => {
  const { subscriptions, isLoading, error } = useSubscriptions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SubscriptionSkeleton />
        <SubscriptionSkeleton />
        <SubscriptionSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
        <p className="font-medium">Failed to load subscriptions</p>
        <p className="text-sm mt-1">
          Please try again later or contact support.
        </p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-accent rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <PlusCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No subscriptions yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Add your first subscription to start tracking your expenses and get
            insights about your spending.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {subscriptions.map((subscription: Subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
};
