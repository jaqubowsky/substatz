"use client";

import { useMigrationState } from "./use-migration-state";

export function useDeployMigrations() {
  const {
    isExecuting,
    statusOutput,
    handleDeploy,
    handleRefresh,
  } = useMigrationState();

  return {
    isExecuting,
    statusOutput,
    handleDeploy,
    handleRefresh,
  };
}
