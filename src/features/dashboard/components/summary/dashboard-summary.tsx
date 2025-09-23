import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { Separator } from "@/components/ui/separator";
import { getSubscriptionSummary } from "@/features/dashboard/server/queries";
import { formatCurrency } from "@/features/dashboard/lib";
import { getServerAuth } from "@/hooks/get-server-auth";
import { PieChart } from "lucide-react";
import { Suspense } from "react";
import { MonthlySpendingCard } from "./monthly-spending-card";
import { TopCategoriesList } from "./top-categories-list";
import { UpcomingPaymentsList } from "./upcoming-payments-list";
import { YearlySpendingCard } from "./yearly-spending-card";
import { Currency } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSummary = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-5 w-24 mt-4" />
      <Skeleton className="h-7 w-28" />
      <Separator className="my-4" />
      <Skeleton className="h-5 w-32" />
      <div className="space-y-2 mt-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
};

const DashboardSummaryContent = async () => {
  const session = await getServerAuth();
  if (!session) throw new Error("User not found");

  const userId = session.user.id;
  const defaultCurrency = session.user.defaultCurrency || Currency.USD;

  const summary = await getSubscriptionSummary(userId, defaultCurrency);

  const totalMonthly = summary.totalMonthly;
  const totalYearly = summary.totalYearly;
  const upcomingPayments = summary.upcomingPayments;
  const categoriesBreakdown = summary.categoriesBreakdown;

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
          totalSpending={formatCurrency(totalMonthly, defaultCurrency)}
        />

        <YearlySpendingCard
          totalSpending={formatCurrency(totalYearly, defaultCurrency)}
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
