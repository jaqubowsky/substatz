import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { Button } from "@/components/ui/button";
import { getSubscriptions } from "@/features/dashboard/server/queries";
import { getServerAuth } from "@/hooks/get-server-auth";
import { SubscriptionPlan } from "@prisma/client";
import { Suspense } from "react";
import { AddSubscriptionButtonClient } from "./add-subscription-button-client";

export const AddSubscriptionButtonContent = async () => {
  const session = await getServerAuth();
  if (!session) throw new Error("User not found");

  const subscriptions = await getSubscriptions();

  const isPaid = session.user.plan === SubscriptionPlan.PAID;
  const hasReachedLimit = !isPaid && subscriptions && subscriptions.length >= 1;

  return <AddSubscriptionButtonClient hasReachedLimit={hasReachedLimit} />;
};

export const AddSubscriptionButton = async () => {
  return (
    <ErrorBoundaryWrapper componentName="Add Subscription Button">
      <Suspense fallback={<Button>Add</Button>}>
        <AddSubscriptionButtonContent />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
};
