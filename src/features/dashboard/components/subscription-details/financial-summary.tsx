import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, SubscriptionStats } from "@/features/dashboard/lib";
import { Subscription } from "@prisma/client";
import { DollarSign } from "lucide-react";

interface FinancialSummaryProps {
  subscription: Subscription;
  stats: SubscriptionStats;
}

export function FinancialSummary({
  subscription,
  stats,
}: FinancialSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-accent-foreground">Current Price</p>
          <p className="text-xl font-bold">
            {formatCurrency(subscription.price, subscription.currency)}
            <span className="text-sm font-normal text-accent-foreground ml-1">
              {subscription.billingCycle.toLowerCase()}
            </span>
          </p>
        </div>

        <div>
          <p className="text-sm text-accent-foreground">Total Spent</p>
          <p className="text-xl font-bold">
            {formatCurrency(stats.totalSpent, subscription.currency)}
          </p>
        </div>

        <div>
          <p className="text-sm text-accent-foreground">Average Monthly Cost</p>
          <p className="text-xl font-bold">
            {formatCurrency(stats.averageCostPerMonth, subscription.currency)}
            <span className="text-sm font-normal text-accent-foreground ml-1">
              /month
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
