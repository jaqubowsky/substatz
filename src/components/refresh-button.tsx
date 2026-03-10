"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" className="gap-2" onClick={onClick}>
      <RefreshCw className="h-4 w-4" />
      Refresh
    </Button>
  );
}
