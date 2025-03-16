import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { Subscription } from "@prisma/client";
import { Suspense } from "react";
import { SubscriptionDetailsButton } from "./subscription-details/subscription-details-button";
import { SubscriptionDetailsContent } from "./subscription-details/subscription-details-content";
import { SubscriptionDetailsLoading } from "./subscription-details/subscription-details-loading";

interface SubscriptionDetailsProps {
  subscription: Subscription;
}

export function SubscriptionDetails({
  subscription,
}: SubscriptionDetailsProps) {
  return (
    <ErrorBoundaryWrapper componentName="SubscriptionDetails">
      <Suspense fallback={<SubscriptionDetailsLoading />}>
        <SubscriptionDetailsButton>
          <SubscriptionDetailsContent subscription={subscription} />
        </SubscriptionDetailsButton>
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}
