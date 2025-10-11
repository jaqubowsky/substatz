"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
  useDatePresets,
  useExportSubscriptions,
} from "@/features/settings/hooks";
import { downloadFile } from "@/features/settings/utils/file-download";
import { DatePresetButtons } from "./date-preset-buttons";
import {
  ExportFormatSelector,
  type ExportFormat,
} from "./export-format-selector";
import { ExportLoadingState } from "./export-loading-state";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { dateFrom, dateTo, applyPreset, setCustomRange } = useDatePresets();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("excel");
  const { exportSubscriptions, isExporting, result } = useExportSubscriptions();

  useEffect(() => {
    if (result.data) {
      const { fileData, filename, mimeType } = result.data;
      downloadFile(fileData, filename, mimeType);
      onOpenChange(false);
    }
  }, [result.data, onOpenChange]);

  const handleExport = () => {
    exportSubscriptions({
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      format: selectedFormat,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Export Subscriptions</DialogTitle>
          <DialogDescription>
            Export your subscription data to Excel or PDF format. You can filter
            by date range or export all your subscriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <DatePresetButtons
            onPresetClick={applyPreset}
            disabled={isExporting}
          />

          <div className="space-y-3">
            <label className="text-sm font-medium leading-none">
              Custom Date Range
            </label>
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              onSelect={(range) => setCustomRange(range?.from, range?.to)}
              disabled={isExporting}
            />
          </div>

          <ExportFormatSelector
            value={selectedFormat}
            onValueChange={setSelectedFormat}
            disabled={isExporting}
          />

          {isExporting && <ExportLoadingState />}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className={cn(isExporting && "cursor-not-allowed")}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
