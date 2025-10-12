import { formatDuration } from "@/lib/billing-utils";
import { Subscription, BillingCycle } from "@prisma/client";
import { differenceInDays, differenceInMonths, addMonths } from "date-fns";
import { calculateNextPaymentDate } from "./calculate-next-payment-date";
import { prisma } from "@/lib/prisma";

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

function calculateCyclesInPeriod(
  periodStart: Date,
  periodEnd: Date,
  billingCycle: BillingCycle
): number {
  const cycleMonths =
    billingCycle === "MONTHLY"
      ? 1
      : billingCycle === "QUARTERLY"
      ? 3
      : billingCycle === "BIANNUALLY"
      ? 6
      : 12;

  const monthsInPeriod = differenceInMonths(periodEnd, periodStart);
  const cycles = Math.floor(monthsInPeriod / cycleMonths);

  return Math.max(0, cycles);
}

export async function calculateSubscriptionStats(
  subscription: Subscription
): Promise<SubscriptionStats> {
  const today = new Date();

  const allHistoryPeriods = await prisma.subscriptionHistory.findMany({
    where: { subscriptionId: subscription.id },
    orderBy: { effectiveFrom: "asc" },
  });

  if (allHistoryPeriods.length === 0) {
    throw new Error(`Subscription ${subscription.id} has no history periods`);
  }

  const actualStartDate = new Date(allHistoryPeriods[0].effectiveFrom);
  const startDate =
    actualStartDate < new Date(subscription.startDate)
      ? actualStartDate
      : new Date(subscription.startDate);

  const totalDays = differenceInDays(today, startDate);
  const totalMonths = differenceInMonths(today, startDate);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const formattedDuration = formatDuration(totalDays, months, years);

  const historyPeriods = allHistoryPeriods;

  let totalSpent = 0;
  let totalRenewals = 0;

  for (const period of historyPeriods) {
    const periodStart = new Date(period.effectiveFrom);
    const periodEnd = period.effectiveTo ? new Date(period.effectiveTo) : today;

    const cyclesInPeriod = calculateCyclesInPeriod(
      periodStart,
      periodEnd,
      period.billingCycle
    );

    totalRenewals += cyclesInPeriod;
    totalSpent += cyclesInPeriod * period.price;
  }

  const averageCostPerMonth = totalMonths > 0 ? totalSpent / totalMonths : 0;

  const currentPeriod = historyPeriods.find((p) => !p.effectiveTo);
  const currentBillingCycle = currentPeriod?.billingCycle || "MONTHLY";

  const nextPaymentDate = calculateNextPaymentDate(
    startDate,
    currentBillingCycle
  );

  return {
    totalSpent,
    activeFor: {
      days: totalDays,
      months: totalMonths,
      years,
      formatted: formattedDuration,
    },
    renewalCount: totalRenewals,
    averageCostPerMonth,
    nextPaymentDate,
  };
}
