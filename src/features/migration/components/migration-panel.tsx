"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MigrationList } from "./migration-list";
import { MigrationActions } from "./migration-actions.client";
import { MigrationErrorBoundary } from "./migration-error-boundary";
import { MigrationLoadingState } from "./migration-loading-state";
import { MigrationStatus } from "@/features/migration/schemas/migration";
import { Suspense } from "react";

interface MigrationPanelProps {
  initialStatus: MigrationStatus;
}

function MigrationStatusHeader({ status }: { status: MigrationStatus }) {
  const pendingCount = status.pendingCount;

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {status.appliedCount} applied, {pendingCount} pending
        </p>
        {pendingCount > 0 && (
          <p className="text-xs text-yellow-600 font-medium">
            {pendingCount} pending migration{pendingCount !== 1 ? "s" : ""} need
            to be applied
          </p>
        )}
        {status.databaseUpToDate && (
          <p className="text-xs text-green-600 font-medium">
            Database schema is up to date
          </p>
        )}
      </div>
      <Suspense fallback={<MigrationLoadingState type="actions" />}>
        <MigrationActions pendingCount={pendingCount} />
      </Suspense>
    </div>
  );
}

export function MigrationPanel({ initialStatus }: MigrationPanelProps) {
  return (
    <MigrationErrorBoundary>
      <div className="space-y-6">
        <MigrationStatusHeader status={initialStatus} />

        <Card>
          <CardHeader>
            <CardTitle>Database Migrations</CardTitle>
            <CardDescription>
              View and manage database schema migrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {initialStatus.migrations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No migrations found
              </p>
            ) : (
              <Suspense fallback={<MigrationLoadingState type="list" />}>
                <MigrationList migrations={initialStatus.migrations} />
              </Suspense>
            )}
          </CardContent>
        </Card>
      </div>
    </MigrationErrorBoundary>
  );
}
