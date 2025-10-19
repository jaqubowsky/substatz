"use client";

import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useMigrationState } from "@/features/migration/hooks/use-migration-state";
import { MigrationOutput } from "./migration-output";

interface MigrationActionsProps {
  pendingCount: number;
}

export function MigrationActions({ pendingCount }: MigrationActionsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isExecuting, statusOutput, handleDeploy, handleRefresh, hideOutput } =
    useMigrationState();

  async function handleRefreshClick() {
    setIsRefreshing(true);
    handleRefresh();
    setIsRefreshing(false);
  }

  return (
    <>
      <div className="flex gap-2">
        {pendingCount > 0 && (
          <Button
            onClick={handleDeploy}
            disabled={isExecuting}
            variant="default"
            size="sm"
            className="relative"
          >
            <Play className="mr-2 h-4 w-4" />
            Deploy All
            {isExecuting && (
              <span className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </span>
            )}
          </Button>
        )}

        <Button
          onClick={handleRefreshClick}
          disabled={isExecuting || isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <MigrationOutput
        output={statusOutput}
        onClose={hideOutput}
        isVisible={statusOutput !== ""}
      />
    </>
  );
}
