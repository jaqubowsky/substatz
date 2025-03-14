import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/dashboard/lib/format-currency";
import { Currency } from "@prisma/client";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface SavingsOpportunity {
  type: "annual_discount" | "alternative_service" | "usage_analysis";
  title: string;
  description: string;
  potentialSavings: number | null;
}

interface SavingsOpportunityCardProps {
  opportunity: SavingsOpportunity;
  currency: Currency;
  onClick?: () => void;
}

export function SavingsOpportunityCard({
  opportunity,
  currency,
  onClick,
}: SavingsOpportunityCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="mt-0.5">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{opportunity.title}</h4>
        <p className="text-sm text-muted-foreground">
          {opportunity.description}
        </p>
        {opportunity.potentialSavings && (
          <p className="text-sm font-medium text-primary mt-1">
            Potential savings:{" "}
            {formatCurrency(opportunity.potentialSavings, currency)}/year
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={onClick}
      >
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
