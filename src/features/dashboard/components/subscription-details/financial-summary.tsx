import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/features/dashboard/lib";
import { BillingCycle, Currency } from "@prisma/client";
import { DollarSign } from "lucide-react";

interface FinancialSummaryProps {
  price: number;
  currency: Currency;
  totalSpent: number;
  averageCostPerMonth: number;
  billingCycle: BillingCycle;
}

export function FinancialSummary({
  price,
  currency,
  totalSpent,
  averageCostPerMonth,
  billingCycle,
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
            {formatCurrency(price, currency)}
            <span className="text-sm font-normal text-accent-foreground ml-1">
              {billingCycle.toLowerCase()}
            </span>
          </p>
        </div>

        <div>
          <p className="text-sm text-accent-foreground">Total Spent</p>
          <p className="text-xl font-bold">
            {formatCurrency(totalSpent, currency)}
          </p>
        </div>

        <div>
          <p className="text-sm text-accent-foreground">Average Monthly Cost</p>
          <p className="text-xl font-bold">
            {formatCurrency(averageCostPerMonth, currency)}
            <span className="text-sm font-normal text-accent-foreground ml-1">
              /month
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
