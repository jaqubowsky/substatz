import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  calculateNextPaymentDate,
  formatCurrency,
  formatDate,
} from "@/features/dashboard/lib";
import { Subscription } from "@prisma/client";
import { Calendar, CreditCard, Tag } from "lucide-react";
import { SubscriptionDetailsButton } from "./subscription-details-button";
import { SubscriptionCardActions } from "./subscription-card-actions";
import dynamic from "next/dynamic";

interface SubscriptionCardProps {
  subscription: Subscription;
}

const DynamicSubscriptionDetails = dynamic(() =>
  import("./subscription-details").then((mod) => mod.SubscriptionDetails)
);

const getStatusBadge = (subscription: Subscription, nextPaymentDate: Date) => {
  if (subscription.isCancelled) {
    return <Badge variant="destructive">Cancelled</Badge>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const paymentDate = new Date(nextPaymentDate);
  paymentDate.setHours(0, 0, 0, 0);

  const daysUntilPayment = Math.ceil(
    (paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntilPayment < 0) {
    return <Badge variant="destructive">Overdue</Badge>;
  }

  if (daysUntilPayment === 0) {
    return <Badge variant="destructive">Due today</Badge>;
  }

  if (daysUntilPayment <= 3) {
    return <Badge variant="destructive">Due soon</Badge>;
  }

  if (daysUntilPayment <= 7) {
    return <Badge variant="secondary">Upcoming</Badge>;
  }

  return null;
};

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const nextPaymentDate = calculateNextPaymentDate(
    new Date(subscription.startDate),
    subscription.billingCycle
  );

  const formattedDate = formatDate(nextPaymentDate.toISOString());
  const statusBadge = getStatusBadge(subscription, nextPaymentDate);

  return (
    <Card className="hover:border-primary/50 transition-all hover:shadow-md group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {subscription.name}
            </h3>
            {statusBadge}
          </div>
          <div className="flex items-center gap-1">
            <SubscriptionDetailsButton>
              <DynamicSubscriptionDetails subscription={subscription} />
            </SubscriptionDetailsButton>
            <SubscriptionCardActions subscription={subscription} />
          </div>
        </div>
        <div className="flex items-center text-accent-foreground text-sm">
          <Tag className="h-3.5 w-3.5 mr-1" />
          {subscription.category}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-accent-foreground flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Next payment
            </p>
            <p className="font-medium text-foreground">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(subscription.price, subscription.currency)}
            </p>
            <p className="text-sm text-accent-foreground flex items-center justify-end">
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              {subscription.billingCycle.charAt(0) +
                subscription.billingCycle.slice(1).toLowerCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
