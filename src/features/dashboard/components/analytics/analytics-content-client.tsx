"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateMonthlySpending,
  filterDataByTimeRange,
  TimeRange,
} from "@/features/dashboard/lib";
import { Currency, Subscription } from "@prisma/client";
import { BarChart3, LineChart } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AdvancedStatsCards } from "./advanced-stats-cards";
import { CategoryBreakdownChart, MonthlySpendingChart } from "./charts";
import { TimeRangeSelector } from "./time-range-selector";

interface AnalyticsContentProps {
  subscriptions: Subscription[];
  categoriesBreakdown: Record<string, number>;
  defaultCurrency: Currency;
  rates: Record<Currency, number>;
}

export function AnalyticsContent({
  subscriptions,
  categoriesBreakdown,
  defaultCurrency,
  rates,
}: AnalyticsContentProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6months");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const monthlySpendingData = calculateMonthlySpending(
    subscriptions,
    defaultCurrency,
    rates,
    timeRange === "custom" ? customDateRange : undefined,
    timeRange
  );

  const filteredMonthlyData = filterDataByTimeRange(
    monthlySpendingData,
    timeRange,
    timeRange === "custom" ? customDateRange : undefined
  );

  const categoryData = Object.entries(categoriesBreakdown).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="px-0 pt-0">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Detailed Stats</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex justify-end mb-6">
        <TimeRangeSelector
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
        />
      </div>

      <TabsContent value="overview" className="mt-0 space-y-6">
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
      </TabsContent>

      <TabsContent value="detailed" className="mt-0">
        <AdvancedStatsCards
          subscriptions={subscriptions}
          defaultCurrency={defaultCurrency}
          rates={rates}
        />
      </TabsContent>
    </Tabs>
  );
}
