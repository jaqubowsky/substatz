"use client";

import { useState, useCallback } from "react";

export type DatePreset = "last30days" | "last6months" | "thisyear" | "alltime";

export function useDatePresets() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const applyPreset = useCallback((preset: DatePreset) => {
    const today = new Date();
    const from = new Date();

    switch (preset) {
      case "last30days":
        from.setDate(today.getDate() - 30);
        setDateFrom(from);
        setDateTo(today);
        break;
      case "last6months":
        from.setMonth(today.getMonth() - 6);
        setDateFrom(from);
        setDateTo(today);
        break;
      case "thisyear":
        from.setMonth(0, 1);
        setDateFrom(from);
        setDateTo(today);
        break;
      case "alltime":
        setDateFrom(undefined);
        setDateTo(undefined);
        break;
    }
  }, []);

  const setCustomRange = useCallback((from?: Date, to?: Date) => {
    setDateFrom(from);
    setDateTo(to);
  }, []);

  return {
    dateFrom,
    dateTo,
    applyPreset,
    setCustomRange,
  };
}
