import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { Button } from "@/components/ui/button";
import { getSubscriptionCountByUserId } from "@/features/dashboard/server/db";
import { getServerAuth } from "@/hooks/get-server-auth";
import { SubscriptionPlan } from "@prisma/client";
import { Suspense } from "react";
import { AddSubscriptionButtonClient } from "./add-subscription-button-client";

export const AddSubscriptionButtonContent = async () => {
  const session = await getServerAuth();
  if (!session) throw new Error("User not found");

  const subscriptionCount = await getSubscriptionCountByUserId(session.user.id);

  const isPaid = session.user.plan === SubscriptionPlan.PAID;
  const hasReachedLimit = !isPaid && subscriptionCount >= 1;

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
