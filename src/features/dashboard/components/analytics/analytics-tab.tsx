import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { getServerAuth } from "@/server";
import { Currency } from "@prisma/client";
import { Suspense } from "react";
import {
  AnalyticsContent,
  LoadingAnalytics,
  SubscriptionSummaryCards,
} from ".";
import { getSubscriptions, getSubscriptionSummary } from "../../server/queries";

const AnalyticsTabContent = async () => {
  const session = await getServerAuth();
  const defaultCurrency = session?.user?.defaultCurrency || Currency.USD;

  const subscriptions = await getSubscriptions();
  const summary = await getSubscriptionSummary();

  const { totalMonthly, totalYearly } = summary;
  const activeSubscriptions = subscriptions.filter(
    (s) => !s.isCancelled
  ).length;

  return (
    <div className="space-y-6">
      <SubscriptionSummaryCards
        activeSubscriptions={activeSubscriptions}
        totalMonthly={totalMonthly}
        totalYearly={totalYearly}
        defaultCurrency={defaultCurrency}
      />

      <div className="bg-card rounded-lg shadow-sm overflow-hidden p-6">
        <AnalyticsContent
          subscriptions={subscriptions}
          categoriesBreakdown={summary.categoriesBreakdown || {}}
          defaultCurrency={defaultCurrency}
        />
      </div>
    </div>
  );
};

export const AnalyticsTab = async () => {
  return (
    <ErrorBoundaryWrapper componentName="Analytics">
      <Suspense fallback={<LoadingAnalytics />}>
        <AnalyticsTabContent />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
};
