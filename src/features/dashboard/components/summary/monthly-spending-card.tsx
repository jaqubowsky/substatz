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
import { CreditCard, HelpCircle } from "lucide-react";

interface MonthlySpendingCardProps {
  totalMonthly: number;
  defaultCurrency: Currency;
}

export function MonthlySpendingCard({
  totalMonthly,
  defaultCurrency,
}: MonthlySpendingCardProps) {
  return (
    <Card className="bg-primary/10 border-none">
      <CardHeader className="pb-2 pt-4">
        <CardDescription className="flex items-center text-muted-foreground">
          <CreditCard className="h-4 w-4 mr-1 text-primary" />
          Monthly Spending
          <HoverCard>
            <HoverCardTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 ml-1 cursor-help text-muted-foreground/70" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Monthly Spending</h4>
                <p className="text-sm">
                  The total amount you spend on subscriptions each month. This
                  includes monthly subscriptions and prorated amounts for
                  quarterly, biannual, and annual subscriptions.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-primary">
          {formatCurrency(totalMonthly, defaultCurrency)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
