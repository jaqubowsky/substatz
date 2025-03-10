"use client";

import { DateRangePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DateRange, TimeRange } from "../../lib/analytics";

export interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
  customDateRange?: DateRange;
  setCustomDateRange?: (range: DateRange) => void;
}

export const TimeRangeSelector = ({
  timeRange,
  setTimeRange,
  customDateRange,
  setCustomDateRange,
}: TimeRangeSelectorProps) => {
  const [isCustom, setIsCustom] = useState(timeRange === "custom");

  const handleTimeRangeChange = (value: string) => {
    const newTimeRange = value as TimeRange;
    setTimeRange(newTimeRange);
    setIsCustom(newTimeRange === "custom");
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range && setCustomDateRange) {
      setCustomDateRange(range);

      if (timeRange !== "custom") {
        setTimeRange("custom");
        setIsCustom(true);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 items-end">
      <Select value={timeRange} onValueChange={handleTimeRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3months">Last 3 months</SelectItem>
          <SelectItem value="6months">Last 6 months</SelectItem>
          <SelectItem value="12months">Last 12 months</SelectItem>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {isCustom && (
        <div className="w-full md:w-auto">
          <DateRangePicker
            from={customDateRange?.from}
            to={customDateRange?.to}
            onSelect={handleDateRangeChange}
          />
        </div>
      )}
    </div>
  );
};
