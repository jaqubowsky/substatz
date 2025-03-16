import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatCurrency } from "@/features/dashboard/lib";
import { Currency } from "@prisma/client";
import { DollarSign, HelpCircle } from "lucide-react";

interface YearlySpendingCardProps {
  totalYearly: number;
  defaultCurrency: Currency;
}

export function YearlySpendingCard({
  totalYearly,
  defaultCurrency,
}: YearlySpendingCardProps) {
  return (
    <Card className="bg-primary/5 border-none">
      <CardHeader className="pb-2 pt-4">
        <CardDescription className="flex items-center text-muted-foreground">
          <DollarSign className="h-4 w-4 mr-1" />
          Yearly Spending
          <HoverCard>
            <HoverCardTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 ml-1 cursor-help text-muted-foreground/70" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Yearly Spending</h4>
                <p className="text-sm">
                  The total amount you spend on subscriptions each year. This is
                  calculated based on your current subscriptions and their
                  billing cycles.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardDescription>
        <CardTitle className="text-2xl font-bold text-foreground">
          {formatCurrency(totalYearly, defaultCurrency)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
