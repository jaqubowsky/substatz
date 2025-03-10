"use client";

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
    <div className="bg-secondary/50 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">Active Subscriptions</p>
      <p className="text-2xl font-bold mt-1">{activeSubscriptions}</p>
    </div>

    <div className="bg-secondary/50 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">Monthly Spending</p>
      <p className="text-2xl font-bold mt-1">{formatCurrency(totalMonthly)}</p>
    </div>

    <div className="bg-secondary/50 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">Yearly Spending</p>
      <p className="text-2xl font-bold mt-1">{formatCurrency(totalYearly)}</p>
    </div>
  </div>
);
