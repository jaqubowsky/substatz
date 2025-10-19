"use client";

import { deployMigrations } from "@/features/migration/server/actions/migrations";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function useDeployMigrations() {
  const [statusOutput, setStatusOutput] = useState<string>("");
  const [showOutput, setShowOutput] = useState(false);
  const router = useRouter();

  const { execute, isExecuting } = useAction(deployMigrations, {
    onSuccess: ({ data }) => {
      if (data?.data) {
        if (data.data.displayResult) {
          setStatusOutput(
            data.data.displayResult.error ||
              data.data.displayResult.output ||
              "Migration completed"
          );
          setShowOutput(true);
        }

        if (data.data.displayResult?.warning) {
          toast.warning(data.data.displayResult.warning);
        } else if (data.success) {
          toast.success(
            data.data?.successfulMigrations > 0
              ? `Successfully applied ${
                  data.data.successfulMigrations
                } migration${data.data.successfulMigrations > 1 ? "s" : ""}`
              : "Migration operation completed"
          );
        }

        if (data.data?.totalMigrations > 0) {
          handleRefresh();
        }
      }
    },
    onError: ({ error }) => {
      const errorMessage = error.serverError || "Failed to execute migration";
      toast.error(errorMessage);
      setStatusOutput(errorMessage);
      setShowOutput(true);
    },
  });

  function handleRefresh() {
    router.refresh();
  }

  function handleDeploy() {
    setStatusOutput("");
    execute({ action: "deploy" });
  }

  return {
    execute,
    isExecuting,
    statusOutput,
    showOutput,
    setShowOutput,
    handleDeploy,
    handleRefresh,
  };
}
