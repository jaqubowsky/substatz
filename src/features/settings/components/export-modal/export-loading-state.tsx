"use client";

import { Loader2 } from "lucide-react";

export function ExportLoadingState() {
  return (
    <div
      className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Generating your export...</span>
    </div>
  );
}

