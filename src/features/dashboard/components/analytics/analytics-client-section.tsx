"use client";

import { Currency, Subscription } from "@prisma/client";
import { useState } from "react";
import {
  CategoryBreakdownChart,
  MonthlySpendingChart,
  ProjectedSpendingChart,
  TimeRangeSelector,
} from ".";
import {
  DateRange,
  TimeRange,
  calculateProjectedAnnualSpending,
  filterDataByTimeRange,
  generateMonthlySpendingData,
  groupByCategory,
} from "../../lib/analytics";

export function AnalyticsClientSection({
  subscriptions,
  categoriesBreakdown,
  defaultCurrency,
}: {
  subscriptions: Subscription[];
  categoriesBreakdown: Record<string, number>;
  defaultCurrency: Currency;
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6months");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({});

  const monthlySpendingData = generateMonthlySpendingData(
    subscriptions,
    timeRange === "custom" ? customDateRange : undefined
  );

  const filteredMonthlyData = filterDataByTimeRange(
    monthlySpendingData,
    timeRange,
    timeRange === "custom" ? customDateRange : undefined
  );

  const categoryData = groupByCategory(categoriesBreakdown);

  const projectedSpendingData = calculateProjectedAnnualSpending(
    subscriptions,
    timeRange === "custom" ? customDateRange : undefined
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Subscription Analytics
        </h2>
        <TimeRangeSelector
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlySpendingChart
          data={filteredMonthlyData}
          defaultCurrency={defaultCurrency}
        />
        <CategoryBreakdownChart
          data={categoryData}
          defaultCurrency={defaultCurrency}
        />
      </div>

      <ProjectedSpendingChart
        data={projectedSpendingData}
        defaultCurrency={defaultCurrency}
      />
    </>
  );
}
