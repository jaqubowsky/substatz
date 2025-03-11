import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { Subscription } from "@prisma/client";
import { SubscriptionSummary } from "../../server/queries";
import { AnalyticsTabClient } from "./analytics-tab-client";

export const AnalyticsTab = ({
  subscriptions,
  summary,
}: {
  subscriptions: Subscription[];
  summary: SubscriptionSummary;
}) => {
  return (
    <ErrorBoundaryWrapper componentName="Analytics">
      <AnalyticsTabClient subscriptions={subscriptions} summary={summary} />
    </ErrorBoundaryWrapper>
  );
};
