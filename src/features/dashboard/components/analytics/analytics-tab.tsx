import { Suspense } from "react";
import { getSubscriptions, getSubscriptionSummary } from "../../server/queries";
import { AnalyticsTabClient } from "./analytics-tab-client";
import { LoadingAnalytics } from "./loading-analytics";

export const AnalyticsTab = async () => {
  const subscriptions = await getSubscriptions();
  const summary = await getSubscriptionSummary();

  return (
    <Suspense fallback={<LoadingAnalytics />}>
      <AnalyticsTabClient subscriptions={subscriptions} summary={summary} />
    </Suspense>
  );
};
