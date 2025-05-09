import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { Separator } from "@/components/ui/separator";
import { getSubscriptionSummary } from "@/features/dashboard/server/queries";
import { getServerAuth } from "@/hooks/get-server-auth";
import { Currency } from "@prisma/client";
import { PieChart } from "lucide-react";
import { Suspense } from "react";
import { LoadingSummary } from "./loading-summary";
import { MonthlySpendingCard } from "./monthly-spending-card";
import { TopCategoriesList } from "./top-categories-list";
import { UpcomingPaymentsList } from "./upcoming-payments-list";
import { YearlySpendingCard } from "./yearly-spending-card";

const DashboardSummaryContent = async () => {
  const session = await getServerAuth();
  if (!session) throw new Error("User not found");

  const summary = await getSubscriptionSummary();

  const totalMonthly = summary.totalMonthly;
  const totalYearly = summary.totalYearly;
  const upcomingPayments = summary.upcomingPayments;
  const categoriesBreakdown = summary.categoriesBreakdown;
  const defaultCurrency = session.user.defaultCurrency || Currency.USD;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          Summary
        </h2>
      </div>

      <div className="space-y-6">
        <MonthlySpendingCard
          totalMonthly={totalMonthly}
          defaultCurrency={defaultCurrency}
        />

        <YearlySpendingCard
          totalYearly={totalYearly}
          defaultCurrency={defaultCurrency}
        />

        {upcomingPayments.length > 0 && (
          <>
            <Separator />
            <UpcomingPaymentsList
              upcomingPayments={upcomingPayments.slice(0, 3)}
              defaultCurrency={defaultCurrency}
            />
          </>
        )}

        {Object.keys(categoriesBreakdown).length > 0 && (
          <>
            <Separator />
            <TopCategoriesList
              categoriesBreakdown={categoriesBreakdown}
              defaultCurrency={defaultCurrency}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const DashboardSummary = () => {
  return (
    <ErrorBoundaryWrapper componentName="Dashboard Summary">
      <Suspense fallback={<LoadingSummary />}>
        <DashboardSummaryContent />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
};
