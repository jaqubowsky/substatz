"use client";

import { Subscription } from "@prisma/client";
import { useState } from "react";
import {
  CategoryBreakdownChart,
  MonthlySpendingChart,
  ProjectedSpendingChart,
  SubscriptionSummaryCards,
  TimeRangeSelector,
} from ".";
import {
  calculateProjectedAnnualSpending,
  DateRange,
  filterDataByTimeRange,
  generateMonthlySpendingData,
  groupByCategory,
  TimeRange,
} from "../../lib/analytics";
import { SubscriptionSummary } from "../../server/queries";

export const AnalyticsTabClient = ({
  subscriptions,
  summary,
}: {
  subscriptions: Subscription[];
  summary: SubscriptionSummary;
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("6months");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({});

  const { totalMonthly, totalYearly, categoriesBreakdown } = summary;

  const monthlySpendingData = generateMonthlySpendingData(
    subscriptions,
    timeRange === "custom" ? customDateRange : undefined
  );

  const filteredMonthlyData = filterDataByTimeRange(
    monthlySpendingData,
    timeRange,
    timeRange === "custom" ? customDateRange : undefined
  );

  const categoryData = groupByCategory(categoriesBreakdown || {});

  const projectedSpendingData = calculateProjectedAnnualSpending(
    subscriptions,
    timeRange === "custom" ? customDateRange : undefined
  );

  const activeSubscriptions = subscriptions.filter(
    (s) => !s.isCancelled
  ).length;

  return (
    <div className="space-y-8">
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

      <SubscriptionSummaryCards
        activeSubscriptions={activeSubscriptions}
        totalMonthly={totalMonthly}
        totalYearly={totalYearly}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlySpendingChart data={filteredMonthlyData} />
        <CategoryBreakdownChart data={categoryData} />
      </div>

      <ProjectedSpendingChart data={projectedSpendingData} />
    </div>
  );
};
