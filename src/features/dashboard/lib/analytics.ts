import { Currency, Subscription } from "@prisma/client";
import { BillingCycle } from "../schemas/subscription";
import { calculateNextPaymentDate } from "./calculate-next-payment-date";
import { formatCurrency } from "./format-currency";

export const getMonthName = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
};

export const getMonthYear = (date: Date): string => {
  return `${getMonthName(date)} ${date.getFullYear()}`;
};

export const formatCurrencyValue = (
  value: number,
  defaultCurrency: Currency
): [string, string] => [formatCurrency(value, defaultCurrency), "Amount"];

export type TimeRange = "3months" | "6months" | "12months" | "all" | "custom";

export interface DateRange {
  from?: Date;
  to?: Date;
}

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

export const generateMonthlySpendingData = (
  subscriptions: Subscription[],
  customDateRange?: DateRange
) => {
  const monthlyData: Record<string, number> = {};
  const now = new Date();

  // If we have a custom date range, generate data for those months
  if (customDateRange?.from && customDateRange?.to) {
    const startDate = new Date(customDateRange.from);
    const endDate = new Date(customDateRange.to);

    // Set startDate to the first day of its month
    startDate.setDate(1);

    // Set endDate to the last day of its month
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    // Generate monthly data for the custom range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthYear = getMonthYear(currentDate);
      monthlyData[monthYear] = 0;
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  } else {
    // Default to last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthYear = getMonthYear(date);
      monthlyData[monthYear] = 0;
    }
  }

  subscriptions.forEach((subscription) => {
    if (subscription.isCancelled) return;

    const startDate = new Date(subscription.startDate);
    const price = subscription.price;

    const paymentDates: Date[] = [];
    const currentDate = new Date(startDate);

    // End date is either the custom end date or now
    const endDate = customDateRange?.to || now;

    while (currentDate <= endDate) {
      paymentDates.push(new Date(currentDate));

      switch (subscription.billingCycle) {
        case "MONTHLY":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "QUARTERLY":
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case "BIANNUALLY":
          currentDate.setMonth(currentDate.getMonth() + 6);
          break;
        case "ANNUALLY":
          currentDate.setMonth(currentDate.getMonth() + 12);
          break;
      }
    }

    paymentDates.forEach((date) => {
      const monthYear = getMonthYear(date);
      if (monthYear in monthlyData) {
        monthlyData[monthYear] += price;
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

export const groupByCategory = (
  categoriesBreakdown: Record<string, number>
) => {
  return Object.entries(categoriesBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));
};

export const calculateProjectedAnnualSpending = (
  subscriptions: Subscription[],
  customDateRange?: DateRange
) => {
  const now = new Date();
  const monthlyData: Record<string, number> = {};

  // If we have a custom date range with a from date, use that as the starting point
  const startDate = customDateRange?.from || now;

  // Generate data for 12 months from the start date
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    const monthYear = getMonthYear(date);
    monthlyData[monthYear] = 0;
  }

  subscriptions.forEach((subscription) => {
    if (subscription.isCancelled) return;

    // Calculate the next payment date based on start date and billing cycle
    const nextPaymentDate = calculateNextPaymentDate(
      new Date(subscription.startDate),
      subscription.billingCycle as BillingCycle
    );

    const price = subscription.price;

    const currentDate = new Date(nextPaymentDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 12);

    while (currentDate <= endDate) {
      const monthYear = getMonthYear(currentDate);
      if (monthYear in monthlyData) {
        monthlyData[monthYear] += price;
      }

      switch (subscription.billingCycle) {
        case "MONTHLY":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "QUARTERLY":
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case "BIANNUALLY":
          currentDate.setMonth(currentDate.getMonth() + 6);
          break;
        case "ANNUALLY":
          currentDate.setMonth(currentDate.getMonth() + 12);
          break;
      }
    }
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

    const startDate = new Date(sub.startDate);
    const now = new Date();
    const monthsDiff =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());

    let cycles = 0;
    switch (sub.billingCycle) {
      case "MONTHLY":
        cycles = monthsDiff;
        break;
      case "QUARTERLY":
        cycles = Math.floor(monthsDiff / 3);
        break;
      case "BIANNUALLY":
        cycles = Math.floor(monthsDiff / 6);
        break;
      case "ANNUALLY":
        cycles = Math.floor(monthsDiff / 12);
        break;
    }

    return sum + cycles;
  }, 0);
};
