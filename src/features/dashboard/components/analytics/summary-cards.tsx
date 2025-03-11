import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, DollarSign, Layers } from "lucide-react";
import { formatCurrency } from "../../lib/format-currency";

export interface SubscriptionSummaryCardsProps {
  activeSubscriptions: number;
  totalMonthly: number;
  totalYearly: number;
}

export const SubscriptionSummaryCards = ({
  activeSubscriptions,
  totalMonthly,
  totalYearly,
}: SubscriptionSummaryCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
    <Card className="transition-all hover:shadow-md hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Active Subscriptions
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Layers className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeSubscriptions}</div>
        <CardDescription>
          {activeSubscriptions === 1 ? "subscription" : "subscriptions"}{" "}
          currently active
        </CardDescription>
      </CardContent>
    </Card>

    <Card className="transition-all hover:shadow-md hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <CreditCard className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalMonthly)}</div>
        <CardDescription>Average monthly cost</CardDescription>
      </CardContent>
    </Card>

    <Card className="transition-all hover:shadow-md hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Yearly Spending</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalYearly)}</div>
        <CardDescription>Total annual cost</CardDescription>
      </CardContent>
    </Card>
  </div>
);
