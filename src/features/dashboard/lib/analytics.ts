import {
  CYCLE_TO_MONTHS,
  calculateBillingCycles,
  calculateMonthsDifference,
} from "@/lib/billing-utils";
import { Currency, Subscription } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { formatCurrency } from "./format-currency";
import { convertCurrency } from "./convert-currency";
import { prisma } from "@/lib/prisma";
import { differenceInMonths } from "date-fns";
import { SubscriptionWithFinancials } from "./subscription-utils";

export type TimeRange = "3months" | "6months" | "12months" | "all" | "custom";

export const getMonthName = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
};

export const formatCurrencyValue = (
  value: number,
  defaultCurrency: Currency
): [string, string] => [formatCurrency(value, defaultCurrency), "Amount"];

export const getMonthYear = (date: Date): string => {
  const month = getMonthName(date);
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export const filterDataByTimeRange = <T extends { month: string }>(
  data: T[],
  timeRange: TimeRange,
  customDateRange?: DateRange
): T[] => {
  if (timeRange === "all") return data;

  const now = new Date();
  const cutoffDate = new Date();

  if (timeRange === "custom" && customDateRange?.from) {
    return data.filter((item) => {
      const [month, year] = item.month.split(" ");
      const itemDate = new Date(`${month} 1, ${year}`);

      if (customDateRange.from && customDateRange.to) {
        return (
          itemDate >= customDateRange.from && itemDate <= customDateRange.to
        );
      }

      return customDateRange.from ? itemDate >= customDateRange.from : true;
    });
  }

  let monthsToSubtract = 6;
  if (timeRange === "3months") monthsToSubtract = 3;
  if (timeRange === "12months") monthsToSubtract = 12;

  cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

  return data.filter((item) => {
    const [month, year] = item.month.split(" ");
    const itemDate = new Date(`${month} 1, ${year}`);
    return itemDate >= cutoffDate;
  });
};

export const calculateMonthlySpendingWithHistory = async (
  subscriptions: Subscription[],
  defaultCurrency: Currency,
  rates: Record<Currency, number>
): Promise<{ month: string; amount: number }[]> => {
  const now = new Date();
  const monthlyData: Record<string, number> = {};

  const activeSubscriptions = subscriptions.filter((sub) => !sub.isCancelled);

  if (activeSubscriptions.length === 0) {
    return [];
  }

  let earliestStartDate = new Date();
  activeSubscriptions.forEach((sub) => {
    const startDate = new Date(sub.startDate);
    if (startDate < earliestStartDate) {
      earliestStartDate = startDate;
    }
  });

  const startYear = earliestStartDate.getFullYear();
  const startMonth = earliestStartDate.getMonth();
  const endYear = now.getFullYear();
  const endMonth = now.getMonth();

  for (let year = startYear; year <= endYear; year++) {
    const monthStart = year === startYear ? startMonth : 0;
    const monthEnd = year === endYear ? endMonth : 11;

    for (let month = monthStart; month <= monthEnd; month++) {
      const date = new Date(year, month, 1);
      const monthYear = getMonthYear(date);
      monthlyData[monthYear] = 0;
    }
  }

  for (const subscription of activeSubscriptions) {
    const allHistoryPeriods = await prisma.subscriptionHistory.findMany({
      where: { subscriptionId: subscription.id },
      orderBy: { effectiveFrom: "asc" },
    });

    for (const period of allHistoryPeriods) {
      const periodStart = new Date(period.effectiveFrom);
      const periodEnd = period.effectiveTo ? new Date(period.effectiveTo) : now;

      const convertedPrice = convertCurrency(
        period.price,
        period.currency,
        defaultCurrency,
        rates
      );
      const periodInMonths = CYCLE_TO_MONTHS[period.billingCycle];

      Object.keys(monthlyData).forEach((monthYear) => {
        const [month, year] = monthYear.split(" ");
        const currentDate = new Date(`${month} 1, ${year}`);

        if (currentDate < periodStart || currentDate > periodEnd) return;

        const monthsSinceStart = calculateMonthsDifference(
          periodStart,
          currentDate
        );

        if (monthsSinceStart % periodInMonths === 0) {
          monthlyData[monthYear] += convertedPrice;
        }
      });
    }
  }

  return Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(" ");
      const [bMonth, bYear] = b.month.split(" ");
      return (
        new Date(`${aMonth} 1, ${aYear}`).getTime() -
        new Date(`${bMonth} 1, ${bYear}`).getTime()
      );
    });
};

export const calculateTotalPaymentCycles = (
  subscriptions: SubscriptionWithFinancials[]
) => {
  return subscriptions.reduce((sum, sub) => {
    if (sub.isCancelled) return sum;

    const cycles = calculateBillingCycles(sub.startDate, sub.billingCycle);

    return sum + cycles;
  }, 0);
};

export const calculateTotalStatistics = async (
  subscriptions: Subscription[],
  defaultCurrency: Currency,
  rates: Record<Currency, number>
): Promise<{
  totalSpentFromStart: number;
  totalRenewals: number;
  averageSubscriptionLifetime: number;
  mostExpensiveCategory: { name: string; amount: number } | null;
  longestActiveSubscription: { name: string; days: number } | null;
}> => {
  let totalSpentFromStart = 0;
  let totalRenewals = 0;
  let totalDays = 0;
  const categoryTotals: Record<string, number> = {};
  let longestActiveSubscription: { name: string; days: number } | null = null;

  const today = new Date();
  const activeSubscriptions = subscriptions.filter((sub) => !sub.isCancelled);

  if (activeSubscriptions.length === 0) {
    return {
      totalSpentFromStart: 0,
      totalRenewals: 0,
      averageSubscriptionLifetime: 0,
      mostExpensiveCategory: null,
      longestActiveSubscription: null,
    };
  }

  for (const subscription of activeSubscriptions) {
    const allHistoryPeriods = await prisma.subscriptionHistory.findMany({
      where: { subscriptionId: subscription.id },
      orderBy: { effectiveFrom: "asc" },
    });

    if (allHistoryPeriods.length === 0) continue;

    const actualStartDate = new Date(allHistoryPeriods[0].effectiveFrom);
    const startDate =
      actualStartDate < new Date(subscription.startDate)
        ? actualStartDate
        : new Date(subscription.startDate);

    const daysActive = Math.max(
      1,
      Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    if (
      !longestActiveSubscription ||
      daysActive > longestActiveSubscription.days
    ) {
      longestActiveSubscription = {
        name: subscription.name,
        days: daysActive,
      };
    }

    totalDays += daysActive;

    for (const period of allHistoryPeriods) {
      const periodStart = new Date(period.effectiveFrom);
      const periodEnd = period.effectiveTo
        ? new Date(period.effectiveTo)
        : today;

      const cycleMonths =
        period.billingCycle === "MONTHLY"
          ? 1
          : period.billingCycle === "QUARTERLY"
          ? 3
          : period.billingCycle === "BIANNUALLY"
          ? 6
          : 12;

      const monthsInPeriod = differenceInMonths(periodEnd, periodStart);
      const cyclesInPeriod = Math.max(
        0,
        Math.floor(monthsInPeriod / cycleMonths)
      );

      totalRenewals += cyclesInPeriod;

      const convertedPrice = convertCurrency(
        period.price,
        period.currency,
        defaultCurrency,
        rates
      );

      const totalSpentInPeriod = cyclesInPeriod * convertedPrice;
      totalSpentFromStart += totalSpentInPeriod;

      if (categoryTotals[period.category]) {
        categoryTotals[period.category] += totalSpentInPeriod;
      } else {
        categoryTotals[period.category] = totalSpentInPeriod;
      }
    }
  }

  let mostExpensiveCategory: { name: string; amount: number } | null = null;
  Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (!mostExpensiveCategory || amount > mostExpensiveCategory.amount) {
      mostExpensiveCategory = { name: category, amount };
    }
  });

  const averageSubscriptionLifetime = totalDays / activeSubscriptions.length;

  return {
    totalSpentFromStart,
    totalRenewals,
    averageSubscriptionLifetime,
    mostExpensiveCategory,
    longestActiveSubscription,
  };
};
