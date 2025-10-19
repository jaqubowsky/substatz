"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, FileText } from "lucide-react";
import { memo, useMemo } from "react";

interface Migration {
  name: string;
  applied: boolean;
  timestamp: string;
  description: string;
}

interface MigrationListProps {
  migrations: Migration[];
}

function formatDate(timestamp: string): string {
  try {
    const date = new Date(timestamp.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6'));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
}

const MigrationItem = memo(({ migration }: { migration: Migration }) => {
  const formattedDate = useMemo(() => formatDate(migration.timestamp), [migration.timestamp]);

  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {migration.applied ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {migration.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {migration.description || "No description"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formattedDate}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge
              variant={migration.applied ? "default" : "secondary"}
              className={
                migration.applied
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }
            >
              {migration.applied ? "Applied" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MigrationItem.displayName = "MigrationItem";

export const MigrationList = memo(({ migrations }: MigrationListProps) => {
  const isEmpty = useMemo(() => migrations.length === 0, [migrations.length]);

  if (isEmpty) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No migrations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {migrations.map((migration) => (
        <MigrationItem key={migration.name} migration={migration} />
      ))}
    </div>
  );
});

MigrationList.displayName = "MigrationList";
