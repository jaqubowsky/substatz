import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/features/dashboard/lib";
import { Clock } from "lucide-react";

interface TimelineCardProps {
  activeFor: { formatted: string };
  startDate: Date;
  nextPaymentDate: Date;
}

export function TimelineCard({
  activeFor,
  startDate,
  nextPaymentDate,
}: TimelineCardProps) {
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
          <p className="text-sm text-accent-foreground">Active For</p>
          <p className="text-xl font-bold">{activeFor.formatted}</p>
        </div>

        <div>
          <p className="text-sm text-accent-foreground">Start Date</p>
          <p className="text-xl font-bold">
            {formatDate(startDate.toISOString())}
          </p>
        </div>

        <div>
          <p className="text-sm text-accent-foreground">Next Payment</p>
          <p className="text-xl font-bold">
            {formatDate(nextPaymentDate.toISOString())}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
