import { Badge } from "@/components/ui/badge";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Subscription } from "@prisma/client";
import { Tag } from "lucide-react";
import { calculateSubscriptionStats } from "../../lib/subscription-stats";
import { FinancialSummary } from "./financial-summary";
import { RenewalHistory } from "./renewal-history";
import { SavingsOpportunities } from "./savings-opportunities";
import { TimelineCard } from "./timeline-card";

interface SubscriptionDetailsContentProps {
  subscription: Subscription;
}

export function SubscriptionDetailsContent({
  subscription,
}: SubscriptionDetailsContentProps) {
  const stats = calculateSubscriptionStats(subscription);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <span>{subscription.name}</span>
          {subscription.isCancelled && (
            <Badge variant="destructive">Cancelled</Badge>
          )}
        </DialogTitle>
        <DialogDescription className="flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" />
          {subscription.category}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <FinancialSummary subscription={subscription} stats={stats} />
        <TimelineCard subscription={subscription} stats={stats} />
      </div>

      <RenewalHistory subscription={subscription} stats={stats} />
      <SavingsOpportunities subscription={subscription} stats={stats} />
    </>
  );
}
