"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  CreditCard,
  DollarSign,
  HelpCircle,
  PieChart,
  Tag,
} from "lucide-react";
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          Summary
        </h2>
      </div>

      <div className="space-y-6">
        <Card className="bg-primary/10 border-none">
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center text-muted-foreground">
              <CreditCard className="h-4 w-4 mr-1 text-primary" />
              Monthly Spending
              <HoverCard>
                <HoverCardTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 ml-1 cursor-help text-muted-foreground/70" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80" side="top">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Monthly Spending</h4>
                    <p className="text-sm">
                      The total amount you spend on subscriptions each month.
                      This includes monthly subscriptions and prorated amounts
                      for quarterly, biannual, and annual subscriptions.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {formatCurrency(totalMonthly)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-primary/5 border-none">
          <CardHeader className="pb-2 pt-4">
            <CardDescription className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1" />
              Yearly Spending
              <HoverCard>
                <HoverCardTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 ml-1 cursor-help text-muted-foreground/70" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80" side="top">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Yearly Spending</h4>
                    <p className="text-sm">
                      The total amount you spend on subscriptions each year.
                      This is calculated based on your current subscriptions and
                      their billing cycles.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {formatCurrency(totalYearly)}
            </CardTitle>
          </CardHeader>
        </Card>

        {upcomingPayments.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Upcoming Payments
              </h3>
              <ul className="space-y-3">
                {upcomingPayments
                  .slice(0, 3)
                  .map((payment: UpcomingPayment) => (
                    <Card
                      key={payment.id}
                      className="bg-secondary/50 border-none"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-foreground">
                              {payment.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(
                                payment.nextPaymentDate.toISOString()
                              )}
                            </p>
                          </div>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(payment.price)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </ul>
            </div>
          </>
        )}

        {Object.keys(categoriesBreakdown).length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Top Categories
              </h3>
              <ul className="space-y-2">
                {Object.entries(categoriesBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([category, amount]) => (
                    <li
                      key={category}
                      className="flex justify-between p-2 rounded hover:bg-secondary/50"
                    >
                      <span className="text-foreground">{category}</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(amount as number)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
