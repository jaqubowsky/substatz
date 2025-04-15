import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateTotalStatistics,
  formatCurrency,
} from "@/features/dashboard/lib";
import { Currency, Subscription } from "@prisma/client";
import {
  CalendarDays,
  Clock,
  CreditCard,
  LineChart,
  TrendingUp,
} from "lucide-react";

interface AdvancedStatsCardsProps {
  subscriptions: Subscription[];
  defaultCurrency: Currency;
  rates: Record<Currency, number>;
}

export function AdvancedStatsCards({
  subscriptions,
  defaultCurrency,
  rates,
}: AdvancedStatsCardsProps) {
  const {
    totalSpentFromStart,
    totalRenewals,
    averageSubscriptionLifetime,
    mostExpensiveCategory,
    longestActiveSubscription,
  } = calculateTotalStatistics(subscriptions, defaultCurrency, rates);

  const formatDuration = (days: number) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    if (years > 0) {
      return `${years}y ${months}m`;
    } else if (months > 0) {
      return `${months}m ${remainingDays}d`;
    }
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="transition-all hover:shadow-md hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpentFromStart, defaultCurrency)}
            </div>
            <CardDescription>Total spent since you started</CardDescription>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Renewals
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRenewals}</div>
            <CardDescription>Billing cycles completed</CardDescription>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Lifetime
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(Math.round(averageSubscriptionLifetime))}
            </div>
            <CardDescription>Average subscription lifetime</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mostExpensiveCategory && (
          <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Spending Category
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostExpensiveCategory.name}
              </div>
              <CardDescription>
                {formatCurrency(mostExpensiveCategory.amount, defaultCurrency)}{" "}
                per billing cycle
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {longestActiveSubscription && (
          <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Longest Active Subscription
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <LineChart className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {longestActiveSubscription.name}
              </div>
              <CardDescription>
                Active for {formatDuration(longestActiveSubscription.days)}
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
