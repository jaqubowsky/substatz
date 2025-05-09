import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Currency } from "@prisma/client";
import { Lightbulb } from "lucide-react";
import {
  SavingsOpportunity,
  SavingsOpportunityCard,
} from "./savings-opportunity-card";
interface SavingsOpportunitiesProps {
  savingsOpportunities: SavingsOpportunity[];
  currency: Currency;
}

export function SavingsOpportunities({
  savingsOpportunities,
  currency,
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
        {savingsOpportunities.map((opportunity, index) => (
          <SavingsOpportunityCard
            key={index}
            opportunity={opportunity}
            currency={currency}
          />
        ))}
      </CardContent>
    </Card>
  );
}
