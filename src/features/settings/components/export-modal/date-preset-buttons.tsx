"use client";

import { Button } from "@/components/ui/button";
import { DatePreset } from "@/features/settings/hooks/use-date-presets";

interface DatePresetButtonsProps {
  onPresetClick: (preset: DatePreset) => void;
  disabled?: boolean;
}

const presets: { value: DatePreset; label: string }[] = [
  { value: "last30days", label: "Last 30 days" },
  { value: "last6months", label: "Last 6 months" },
  { value: "thisyear", label: "This year" },
  { value: "alltime", label: "All time" },
];

export function DatePresetButtons({
  onPresetClick,
  disabled = false,
}: DatePresetButtonsProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium leading-none">Date Range</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {presets.map(({ value, label }) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPresetClick(value)}
            disabled={disabled}
            className="text-xs"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

