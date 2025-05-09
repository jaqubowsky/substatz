import { calculateBillingCycles, formatDuration } from "@/lib/billing-utils";
import { Subscription } from "@prisma/client";
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
    subscription.billingCycle
  );

  const price = subscription.price;

  const totalSpent = renewalCount * price;

  const averageCostPerMonth =
    totalMonths > 0 ? totalSpent / totalMonths : price;

  const nextPaymentDate = calculateNextPaymentDate(
    startDate,
    subscription.billingCycle
  );

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
  };
}
