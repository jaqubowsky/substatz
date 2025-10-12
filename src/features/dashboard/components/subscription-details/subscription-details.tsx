import { Badge } from "@/components/ui/badge";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateSubscriptionStats } from "@/features/dashboard/lib";
import { generateSavingsOpportunities } from "@/features/dashboard/lib/savings-opportunities";
import { Tag } from "lucide-react";
import { FinancialSummary } from "./financial-summary";
import { RenewalHistory } from "./renewal-history";
import { SavingsOpportunities } from "./savings-opportunities";
import { TimelineCard } from "./timeline-card";
import {
  SubscriptionWithCurrentValues,
  getCurrentValues,
} from "@/features/dashboard/lib/subscription-utils";

interface SubscriptionDetailsProps {
  subscription: SubscriptionWithCurrentValues;
}

export async function SubscriptionDetails({
  subscription,
}: SubscriptionDetailsProps) {
  const currentValues = getCurrentValues(subscription);
  const stats = await calculateSubscriptionStats(subscription);
  const savingsOpportunities = generateSavingsOpportunities({
    ...subscription,
    ...currentValues,
  });

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
          {currentValues.category}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <FinancialSummary
          price={currentValues.price}
          currency={currentValues.currency}
          totalSpent={stats.totalSpent}
          averageCostPerMonth={stats.averageCostPerMonth}
          billingCycle={currentValues.billingCycle}
        />
        <TimelineCard
          activeFor={stats.activeFor}
          startDate={subscription.startDate}
          nextPaymentDate={stats.nextPaymentDate}
        />
      </div>

      <RenewalHistory
        renewalCount={stats.renewalCount}
        billingCycle={currentValues.billingCycle}
      />
      <SavingsOpportunities
        savingsOpportunities={savingsOpportunities}
        currency={currentValues.currency}
      />
    </>
  );
}
