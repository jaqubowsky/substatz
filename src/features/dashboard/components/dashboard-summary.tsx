"use client";

import { Calendar, CreditCard, DollarSign, PieChart, Tag } from "lucide-react";
import { useSubscriptionSummary } from "../hooks/use-subscription-summary";
import { formatCurrency } from "../lib/format-currency";
import { formatDate } from "../lib/format-date";
import { UpcomingPayment } from "../schemas/subscription";

export const DashboardSummary = () => {
  const {
    totalMonthly,
    totalYearly,
    upcomingPayments,
    categoriesBreakdown,
    isLoading,
    error,
  } = useSubscriptionSummary();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2"></div>
          <div className="h-8 w-32 bg-muted rounded"></div>
        </div>
        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2"></div>
          <div className="h-7 w-28 bg-muted rounded"></div>
        </div>
        <div className="pt-4 border-t border-border">
          <div className="h-5 w-32 bg-muted rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-6 w-full bg-muted rounded"></div>
            <div className="h-6 w-full bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
        Failed to load summary. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-foreground flex items-center">
        <PieChart className="h-5 w-5 mr-2 text-primary" />
        Summary
      </h2>

      <div className="space-y-6">
        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <CreditCard className="h-4 w-4 mr-1 text-primary" />
            Monthly Spending
          </h3>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(totalMonthly)}
          </p>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Yearly Spending
          </h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totalYearly)}
          </p>
        </div>

        {upcomingPayments.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Upcoming Payments
            </h3>
            <ul className="space-y-3">
              {upcomingPayments.slice(0, 3).map((payment: UpcomingPayment) => (
                <li key={payment.id} className="bg-secondary/50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">
                        {payment.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(
                          typeof payment.nextPaymentDate === "string"
                            ? payment.nextPaymentDate
                            : payment.nextPaymentDate.toISOString()
                        )}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(payment.price)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(categoriesBreakdown).length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              Top Categories
            </h3>
            <ul className="space-y-2">
              {Object.entries(categoriesBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([category, amount]) => (
                  <li key={category} className="flex justify-between">
                    <span className="text-foreground">{category}</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(amount as number)}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
