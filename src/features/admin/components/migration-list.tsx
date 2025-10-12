import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

interface Migration {
  name: string;
  applied: boolean;
  timestamp: string;
  description: string;
}

interface MigrationListProps {
  migrations: Migration[];
  onExecute?: (action: "deploy" | "status" | "reset") => void;
  isExecuting?: boolean;
}

export function MigrationList({ migrations }: MigrationListProps) {
  return (
    <div className="space-y-2">
      {migrations.map((migration) => (
        <div
          key={migration.name}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            {migration.applied ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm font-medium truncate">
                {migration.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {migration.description.replace(/_/g, " ")}
              </div>
            </div>
          </div>

          <Badge variant={migration.applied ? "default" : "secondary"}>
            {migration.applied ? "Applied" : "Pending"}
          </Badge>
        </div>
      ))}
    </div>
  );
}
