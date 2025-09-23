import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { Paywall } from "@/components/paywall";
import {
  getSubscriptions,
  getSubscriptionSummary,
} from "@/features/dashboard/server/queries";
import { getLatestExchangeRates } from "@/features/dashboard/server/queries/rates";
import { getServerAuth } from "@/hooks/get-server-auth";
import { Currency, SubscriptionPlan } from "@prisma/client";
import { Suspense } from "react";
import { AnalyticsContent } from "./analytics-content.client";
import { LoadingAnalytics } from "./loading-analytics";
import { SubscriptionSummaryCards } from "./summary-cards";
import { Card, CardContent } from "@/components/ui/card";
import { AdvancedStatsCards } from "./advanced-stats-cards";

const PlaceholderSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg shadow-sm p-6 h-32" />
        ))}
      </div>
      <div className="bg-card rounded-lg shadow-sm p-6 h-[400px]" />
    </div>
  );
};

const AnalyticsTabContent = async () => {
  const session = await getServerAuth();
  if (!session) throw new Error("User not found");

  const userPlan = session.user.plan;
  const defaultCurrency = session.user.defaultCurrency || Currency.USD;

  if (userPlan !== SubscriptionPlan.PAID) {
    return (
      <Paywall>
        <PlaceholderSkeleton />
      </Paywall>
    );
  }

  const [subscriptions, summary, rates] = await Promise.all([
    getSubscriptions(),
    getSubscriptionSummary(),
    getLatestExchangeRates(),
  ]);

  const { totalMonthly, totalYearly, categoriesBreakdown } = summary;

  const activeSubscriptions = subscriptions.filter(
    (s) => !s.isCancelled
  ).length;

  return (
    <Card>
      <CardContent className="pt-6">
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
              categoriesBreakdown={categoriesBreakdown}
              defaultCurrency={defaultCurrency}
              rates={rates}
            >
              <AdvancedStatsCards
                subscriptions={subscriptions}
                defaultCurrency={defaultCurrency}
                rates={rates}
              />
            </AnalyticsContent>
          </div>
        </div>
      </CardContent>
    </Card>
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
