"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { exportSubscriptionsAction } from "@/features/settings/server/actions";

export function useExportSubscriptions() {
  const action = useAction(exportSubscriptionsAction, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success("Export completed successfully!");
      }
    },
    onError: (error) => {
      toast.error(
        error.error.serverError ||
          "Failed to export subscriptions. Please try again.",
      );
    },
  });

  return {
    exportSubscriptions: action.execute,
    isExporting: action.isExecuting,
    result: action.result,
  };
}
