"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSpreadsheet, FileText } from "lucide-react";

export type ExportFormat = "excel" | "pdf";

interface ExportFormatSelectorProps {
  value: ExportFormat;
  onValueChange: (value: ExportFormat) => void;
  disabled?: boolean;
}

export function ExportFormatSelector({
  value,
  onValueChange,
  disabled = false,
}: ExportFormatSelectorProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="format-select"
        className="text-sm font-medium leading-none"
      >
        Export Format
      </label>
      <Select
        value={value}
        onValueChange={(val) => onValueChange(val as ExportFormat)}
        disabled={disabled}
      >
        <SelectTrigger id="format-select" aria-label="Select export format">
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="excel">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel (.xlsx)</span>
            </div>
          </SelectItem>
          <SelectItem value="pdf">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>PDF (.pdf)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
