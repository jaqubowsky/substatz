import { formatCurrency } from "@/features/dashboard/lib/format-currency";
import { OpportunityType } from "@/features/dashboard/lib/savings-opportunities";
import { Currency } from "@prisma/client";
import { Sparkles } from "lucide-react";

export interface SavingsOpportunity {
  type: OpportunityType;
  title: string;
  description: string;
  potentialSavings: number | null;
}

interface SavingsOpportunityCardProps {
  opportunity: SavingsOpportunity;
  currency: Currency;
}

export function SavingsOpportunityCard({
  opportunity,
  currency,
}: SavingsOpportunityCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="mt-0.5">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{opportunity.title}</h4>
        <p className="text-sm text-accent-foreground">
          {opportunity.description}
        </p>
        {opportunity.potentialSavings && (
          <p className="text-sm font-medium text-primary mt-1">
            Potential savings:{" "}
            {formatCurrency(opportunity.potentialSavings, currency)}/year
          </p>
        )}
      </div>
    </div>
  );
}
