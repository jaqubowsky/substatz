import { Badge } from "@/components/ui/badge";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateSubscriptionStats } from "@/features/dashboard/lib";
import { generateSavingsOpportunities } from "@/features/dashboard/lib/savings-opportunities";
import { Subscription } from "@prisma/client";
import { Tag } from "lucide-react";
import { FinancialSummary } from "./financial-summary";
import { RenewalHistory } from "./renewal-history";
import { SavingsOpportunities } from "./savings-opportunities";
import { TimelineCard } from "./timeline-card";

interface SubscriptionDetailsProps {
  subscription: Subscription;
}

export function SubscriptionDetails({
  subscription,
}: SubscriptionDetailsProps) {
  const stats = calculateSubscriptionStats(subscription);
  const savingsOpportunities = generateSavingsOpportunities(subscription);

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
        <FinancialSummary
          price={subscription.price}
          currency={subscription.currency}
          totalSpent={stats.totalSpent}
          averageCostPerMonth={stats.averageCostPerMonth}
          billingCycle={subscription.billingCycle}
        />
        <TimelineCard
          activeFor={stats.activeFor}
          startDate={subscription.startDate}
          nextPaymentDate={stats.nextPaymentDate}
        />
      </div>

      <RenewalHistory
        renewalCount={stats.renewalCount}
        billingCycle={subscription.billingCycle}
      />
      <SavingsOpportunities
        savingsOpportunities={savingsOpportunities}
        currency={subscription.currency}
      />
    </>
  );
}
