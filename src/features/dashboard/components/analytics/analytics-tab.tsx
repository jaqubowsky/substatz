import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { getSubscriptions, getSubscriptionSummary } from "../../server/queries";
import { AnalyticsTabClient } from "./analytics-tab-client";

const AnalyticsTabContent = async () => {
  const subscriptions = await getSubscriptions();
  const summary = await getSubscriptionSummary();

  return <AnalyticsTabClient subscriptions={subscriptions} summary={summary} />;
};

export const AnalyticsTab = async () => {
  return (
    <ErrorBoundaryWrapper componentName="Analytics">
      <AnalyticsTabContent />
    </ErrorBoundaryWrapper>
  );
};
