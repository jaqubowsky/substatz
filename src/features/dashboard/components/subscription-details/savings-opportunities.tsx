import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionStats } from "@/features/dashboard/lib";
import { Subscription } from "@prisma/client";
import { Lightbulb } from "lucide-react";
import { SavingsOpportunityCard } from "./savings-opportunity-card";

interface SavingsOpportunitiesProps {
  subscription: Subscription;
  stats: SubscriptionStats;
}

export function SavingsOpportunities({
  subscription,
  stats,
}: SavingsOpportunitiesProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Savings Opportunities
        </CardTitle>
        <CardDescription>
          Ways you might be able to save money on this subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.savingsOpportunities.map((opportunity, index) => (
          <SavingsOpportunityCard
            key={index}
            opportunity={opportunity}
            currency={subscription.currency}
          />
        ))}
      </CardContent>
    </Card>
  );
}
