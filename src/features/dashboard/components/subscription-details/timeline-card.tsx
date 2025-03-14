import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@prisma/client";
import { Clock } from "lucide-react";
import { formatDate } from "../../lib/format-date";
import { SubscriptionStats } from "../../lib/subscription-stats";

interface TimelineCardProps {
  subscription: Subscription;
  stats: SubscriptionStats;
}

export function TimelineCard({ subscription, stats }: TimelineCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Active For</p>
          <p className="text-xl font-bold">{stats.activeFor.formatted}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Start Date</p>
          <p className="text-xl font-bold">
            {formatDate(subscription.startDate.toISOString())}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Next Payment</p>
          <p className="text-xl font-bold">
            {formatDate(stats.nextPaymentDate.toISOString())}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
