"use client";

import { startTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deployMigrations } from "@/features/migration/server/actions/migrations";
import { MigrationResult } from "@/features/migration/schemas/migration";

interface MigrationState {
  isDeploying: boolean;
  statusOutput: string;
  showOutput: boolean;
  lastResult: MigrationResult | null;
}

type MigrationAction =
  | { type: "START_DEPLOY" }
  | { type: "COMPLETE_SUCCESS"; result: MigrationResult; output: string }
  | { type: "COMPLETE_ERROR"; error: string }
  | { type: "CLEAR_OUTPUT" }
  | { type: "SHOW_OUTPUT"; output: string }
  | { type: "HIDE_OUTPUT" };

const initialState: MigrationState = {
  isDeploying: false,
  statusOutput: "",
  showOutput: false,
  lastResult: null,
};

function migrationReducer(
  state: MigrationState,
  action: MigrationAction
): MigrationState {
  switch (action.type) {
    case "START_DEPLOY":
      return {
        ...state,
        isDeploying: true,
        statusOutput: "",
        showOutput: false,
      };
    case "COMPLETE_SUCCESS":
      return {
        ...state,
        isDeploying: false,
        statusOutput: action.output,
        showOutput: true,
        lastResult: action.result,
      };
    case "COMPLETE_ERROR":
      return {
        ...state,
        isDeploying: false,
        statusOutput: action.error,
        showOutput: true,
        lastResult: null,
      };
    case "CLEAR_OUTPUT":
      return {
        ...state,
        statusOutput: "",
        showOutput: false,
      };
    case "SHOW_OUTPUT":
      return {
        ...state,
        statusOutput: action.output,
        showOutput: true,
      };
    case "HIDE_OUTPUT":
      return {
        ...state,
        showOutput: false,
      };
    default:
      return state;
  }
}

export function useMigrationState() {
  const router = useRouter();
  const [state, dispatch] = useOptimistic(initialState, migrationReducer);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleDeploy = async () => {
    startTransition(() => {
      dispatch({ type: "START_DEPLOY" });
    });

    try {
      const result = await deployMigrations({ action: "deploy" });

      if (result?.data?.data) {
        const { displayResult, successfulMigrations } = result.data.data;
        const output =
          displayResult?.error ||
          displayResult?.output ||
          "Migration completed";

        startTransition(() => {
          dispatch({
            type: "COMPLETE_SUCCESS",
            result: displayResult || {
              success: true,
              migrationName: "unknown",
              executionTime: 0,
              output,
              error: null,
              warning: null,
            },
            output,
          });
        });

        if (displayResult?.warning) {
          toast.warning(displayResult.warning);
        } else if (result.data.success) {
          toast.success(
            successfulMigrations > 0
              ? `Successfully applied ${successfulMigrations} migration${
                  successfulMigrations > 1 ? "s" : ""
                }`
              : "Migration operation completed"
          );
        }

        if (result.data.data.totalMigrations > 0) {
          handleRefresh();
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to execute migration";
      toast.error(errorMessage);
      startTransition(() => {
        dispatch({ type: "COMPLETE_ERROR", error: errorMessage });
      });
    }
  };

  const clearOutput = () => {
    startTransition(() => {
      dispatch({ type: "CLEAR_OUTPUT" });
    });
  };

  const showOutput = (output: string) => {
    startTransition(() => {
      dispatch({ type: "SHOW_OUTPUT", output });
    });
  };

  const hideOutput = () => {
    startTransition(() => {
      dispatch({ type: "HIDE_OUTPUT" });
    });
  };

  return {
    ...state,
    isExecuting: state.isDeploying,
    handleDeploy,
    handleRefresh,
    clearOutput,
    showOutput,
    hideOutput,
  };
}
