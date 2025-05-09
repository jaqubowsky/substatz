import {
  CYCLE_TO_MONTHS,
  calculateBillingCycles,
  calculateMonthsDifference,
} from "@/lib/billing-utils";
import { Currency, Subscription } from "@prisma/client";
import { DateRange } from "react-day-picker";
import {formatCurrency } from "./format-currency";
import { convertCurrency } from "./convert-currency";

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

export const calculateMonthlySpending = (
  subscriptions: Subscription[],
  defaultCurrency: Currency,
  rates: Record<Currency, number>,
  customDateRange?: DateRange,
  timeRange: TimeRange = "12months"
): { month: string; amount: number }[] => {
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

  if (timeRange === "all") {
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
  } else {
    const startDate = customDateRange?.from || now;

    const monthsToShow =
      timeRange === "3months" ? 3 : timeRange === "6months" ? 6 : 12;

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() - i);
      const monthYear = getMonthYear(date);
      monthlyData[monthYear] = 0;
    }
  }

  activeSubscriptions.forEach((subscription) => {
    const {
      startDate: subscriptionStartDate,
      billingCycle,
      price,
      currency,
    } = subscription;

    const convertedPrice = convertCurrency(price, currency, defaultCurrency, rates);
    const periodInMonths = CYCLE_TO_MONTHS[billingCycle];
    const subStartDate = new Date(subscriptionStartDate);

    Object.keys(monthlyData).forEach((monthYear) => {
      const [month, year] = monthYear.split(" ");
      const currentDate = new Date(`${month} 1, ${year}`);

      if (currentDate < subStartDate) return;

      const monthsSinceStart = calculateMonthsDifference(
        subStartDate,
        currentDate
      );

      if (monthsSinceStart % periodInMonths === 0) {
        monthlyData[monthYear] += convertedPrice;
      }
    });
  });

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

export const calculateTotalPaymentCycles = (subscriptions: Subscription[]) => {
  return subscriptions.reduce((sum, sub) => {
    if (sub.isCancelled) return sum;

    const cycles = calculateBillingCycles(sub.startDate, sub.billingCycle);

    return sum + cycles;
  }, 0);
};

export const calculateTotalStatistics = (
  subscriptions: Subscription[],
  defaultCurrency: Currency,
  rates: Record<Currency, number>
): {
  totalSpentFromStart: number;
  totalRenewals: number;
  averageSubscriptionLifetime: number;
  mostExpensiveCategory: { name: string; amount: number } | null;
  longestActiveSubscription: { name: string; days: number } | null;
} => {
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

  activeSubscriptions.forEach((subscription) => {
    const startDate = new Date(subscription.startDate);
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

    const renewalCount = calculateBillingCycles(
      startDate,
      subscription.billingCycle
    );

    totalRenewals += renewalCount;

    const convertedPrice = convertCurrency(
      subscription.price,
      subscription.currency,
      defaultCurrency,
      rates
    );

    const totalSpent = renewalCount * convertedPrice;
    totalSpentFromStart += totalSpent;

    if (categoryTotals[subscription.category]) {
      categoryTotals[subscription.category] += convertedPrice;
    } else {
      categoryTotals[subscription.category] = convertedPrice;
    }
  });

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
