"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { executeMigrationAction } from "@/features/admin";
import { AlertTriangle, Play, RefreshCw, XCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MigrationList } from "./migration-list";

interface Migration {
  name: string;
  applied: boolean;
  timestamp: string;
  description: string;
}

interface MigrationPanelProps {
  initialMigrations: Migration[];
}

export function MigrationPanel({ initialMigrations }: MigrationPanelProps) {
  const [statusOutput, setStatusOutput] = useState<string>("");
  const [showOutput, setShowOutput] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const { execute, isExecuting } = useAction(executeMigrationAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setStatusOutput(data.output);
        setShowOutput(true);

        if (data.warning) {
          toast.warning(data.warning);
        } else {
          toast.success("Migration executed successfully");
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

  async function handleRefresh() {
    setIsRefreshing(true);
    toast.loading("Refreshing migration list...", { id: "refresh" });

    try {
      router.refresh();

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Migration list refreshed", { id: "refresh" });
    } catch {
      toast.error("Failed to refresh", { id: "refresh" });
    } finally {
      setIsRefreshing(false);
    }
  }

  function executeMigration(action: "deploy" | "status" | "reset") {
    if (action === "reset") {
      setShowResetConfirm(true);
      return;
    }

    setShowOutput(false);
    execute({ action });
  }

  function handleResetConfirm() {
    setShowResetConfirm(false);
    setShowOutput(false);
    execute({ action: "reset" });
  }

  const pendingCount = initialMigrations.filter((m) => !m.applied).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          {pendingCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {pendingCount} pending migration{pendingCount !== 1 ? "s" : ""}{" "}
              need to be applied
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <Button
              onClick={() => executeMigration("deploy")}
              disabled={isExecuting}
              variant="default"
              size="sm"
            >
              <Play className="mr-2 h-4 w-4" />
              Deploy All Migrations
            </Button>
          )}

          <Button
            onClick={handleRefresh}
            disabled={isExecuting || isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={() => executeMigration("reset")}
            disabled={isExecuting}
            variant="destructive"
            size="sm"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reset Database
          </Button>
        </div>
      </div>

      {showOutput && statusOutput && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Command Output
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOutput(false)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              {statusOutput}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Database Migrations</CardTitle>
          <CardDescription>
            Click on a migration to view details or execute actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialMigrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No migrations found
            </p>
          ) : (
            <MigrationList migrations={initialMigrations} />
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        onConfirm={handleResetConfirm}
        title="Reset Database?"
        description={
          <>
            This action will <strong>permanently delete all data</strong> and
            reset the database to a clean state.
            <br />
            <br />
            <span className="text-destructive font-semibold">
              This cannot be undone!
            </span>
          </>
        }
        icon={<AlertTriangle className="h-12 w-12 text-destructive" />}
        variant="destructive"
        confirmText="Reset Database"
        cancelText="Cancel"
        isProcessing={isExecuting}
        processingText="Resetting..."
      />
    </div>
  );
}
