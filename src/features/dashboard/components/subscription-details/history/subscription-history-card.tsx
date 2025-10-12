"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionHistory } from "@prisma/client";
import { formatCurrency, formatDate } from "@/features/dashboard/lib";
import { Pencil, Trash2 } from "lucide-react";

interface SubscriptionHistoryCardProps {
  history: SubscriptionHistory;
  onEdit: (history: SubscriptionHistory) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionHistoryCard = ({
  history,
  onEdit,
  onDelete,
}: SubscriptionHistoryCardProps) => {
  const startDate = formatDate(history.effectiveFrom.toISOString());
  const endDate = history.effectiveTo
    ? formatDate(history.effectiveTo.toISOString())
    : "Present";

  const isCurrentPeriod = !history.effectiveTo;

  return (
    <Card className={isCurrentPeriod ? "border-primary" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {startDate} → {endDate}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isCurrentPeriod && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(history)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(history.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Price:</span>
            <p className="font-semibold">
              {formatCurrency(history.price, history.currency)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Billing:</span>
            <p className="font-semibold">
              {history.billingCycle.charAt(0) +
                history.billingCycle.slice(1).toLowerCase()}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Category:</span>
            <p className="font-semibold">{history.category}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
