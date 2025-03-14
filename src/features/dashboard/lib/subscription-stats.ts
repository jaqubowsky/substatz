import { SavingsOpportunity } from "@/components/savings-opportunity-card";
import { calculateBillingCycles, formatDuration } from "@/lib/billing-utils";
import { BillingCycle, Subscription } from "@prisma/client";
import { differenceInDays, differenceInMonths } from "date-fns";
import { calculateNextPaymentDate } from "./calculate-next-payment-date";

export interface SubscriptionStats {
  totalSpent: number;
  activeFor: {
    days: number;
    months: number;
    years: number;
    formatted: string;
  };
  renewalCount: number;
  averageCostPerMonth: number;
  nextPaymentDate: Date;
  savingsOpportunities: SavingsOpportunity[];
}

export function calculateSubscriptionStats(
  subscription: Subscription
): SubscriptionStats {
  const today = new Date();
  const startDate = new Date(subscription.startDate);

  const totalDays = differenceInDays(today, startDate);
  const totalMonths = differenceInMonths(today, startDate);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const formattedDuration = formatDuration(totalDays, months, years);

  const renewalCount = calculateBillingCycles(
    startDate,
    subscription.billingCycle as BillingCycle
  );

  const price = subscription.price;

  const totalSpent = renewalCount * price;

  const averageCostPerMonth =
    totalMonths > 0 ? totalSpent / totalMonths : price;

  const nextPaymentDate = calculateNextPaymentDate(
    startDate,
    subscription.billingCycle as BillingCycle
  );

  const savingsOpportunities: SavingsOpportunity[] = [];

  if (subscription.billingCycle === "MONTHLY") {
    savingsOpportunities.push({
      type: "annual_discount",
      title: "Switch to annual billing",
      description:
        "Save up to 20% by switching to annual billing for this subscription.",
      potentialSavings: price * 12 * 0.2,
    });
  }

  savingsOpportunities.push({
    type: "alternative_service",
    title: "Consider alternatives",
    description: `There might be cheaper alternatives to ${subscription.name} with similar features.`,
    potentialSavings: null,
  });

  savingsOpportunities.push({
    type: "usage_analysis",
    title: "Analyze your usage",
    description:
      "Check if you're fully utilizing this service or if a cheaper plan would suffice.",
    potentialSavings: null,
  });

  return {
    totalSpent,
    activeFor: {
      days: totalDays,
      months: totalMonths,
      years,
      formatted: formattedDuration,
    },
    renewalCount,
    averageCostPerMonth,
    nextPaymentDate,
    savingsOpportunities,
  };
}
