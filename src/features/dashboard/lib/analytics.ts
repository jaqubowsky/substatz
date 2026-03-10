import type { DateRange } from "react-day-picker";
import type { Currency } from "@/generated/prisma/client";
import { calculateBillingCycles } from "@/lib/billing-utils";
import { formatCurrency } from "./format-currency";
import type { SubscriptionWithFinancials } from "./subscription-utils";

export type TimeRange = "3months" | "6months" | "12months" | "all" | "custom";

export const getMonthName = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
};

export const formatCurrencyValue = (
  value: number,
  defaultCurrency: Currency,
): [string, string] => [formatCurrency(value, defaultCurrency), "Amount"];

export const getMonthYear = (date: Date): string => {
  const month = getMonthName(date);
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export const filterDataByTimeRange = <T extends { month: string }>(
  data: T[],
  timeRange: TimeRange,
  customDateRange?: DateRange,
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

export const calculateTotalPaymentCycles = (
  subscriptions: SubscriptionWithFinancials[],
) => {
  return subscriptions.reduce((sum, sub) => {
    if (sub.isCancelled) return sum;

    const cycles = calculateBillingCycles(sub.startDate, sub.billingCycle);

    return sum + cycles;
  }, 0);
};
