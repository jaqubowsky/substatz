import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { getSubscriptions } from "@/features/dashboard/server/queries";
import { SubscriptionPlan } from "@prisma/client";
import { Suspense } from "react";
import { AddSubscriptionButtonClient } from "./add-subscription-button-client";

export const AddSubscriptionButtonContent = async () => {
  const session = await auth();

  const subscriptions = await getSubscriptions();

  const isPaid = session?.user?.plan === SubscriptionPlan.PAID;
  const hasReachedLimit = !isPaid && subscriptions && subscriptions.length >= 1;

  return (
    <AddSubscriptionButtonClient
      isPaid={isPaid}
      hasReachedLimit={hasReachedLimit}
    />
  );
};

export const AddSubscriptionButton = async () => {
  return (
    <Suspense fallback={<Button>Add</Button>}>
      <AddSubscriptionButtonContent />
    </Suspense>
  );
};
