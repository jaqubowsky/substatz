import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/features/dashboard/lib";
import { UpcomingPayment } from "@/features/dashboard/schemas/subscription";
import { Currency } from "@prisma/client";
import { Calendar } from "lucide-react";

interface UpcomingPaymentsListProps {
  upcomingPayments: UpcomingPayment[];
  defaultCurrency: Currency;
}

export function UpcomingPaymentsList({
  upcomingPayments,
  defaultCurrency,
}: UpcomingPaymentsListProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-accent-foreground mb-3 flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        Upcoming Payments
      </h3>
      <ul className="space-y-3">
        {upcomingPayments.map((payment) => (
          <Card key={payment.id} className="bg-secondary/50 border-none">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{payment.name}</p>
                  <p className="text-xs text-accent-foreground">
                    {formatDate(payment.nextPaymentDate.toISOString())}
                  </p>
                </div>
                <span className="font-semibold text-foreground">
                  {formatCurrency(payment.price, defaultCurrency)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
}
