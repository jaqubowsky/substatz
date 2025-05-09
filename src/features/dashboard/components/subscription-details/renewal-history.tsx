import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingCycle } from "@prisma/client";
import { History, Repeat } from "lucide-react";

interface RenewalHistoryProps {
  renewalCount: number;
  billingCycle: BillingCycle;
}

export function RenewalHistory({
  renewalCount,
  billingCycle,
}: RenewalHistoryProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Renewal History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-accent-foreground">Renewal Count</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold">{renewalCount}</p>
              <Badge variant="outline" className="flex items-center gap-1 mt-1">
                <Repeat className="h-3 w-3" />
                {billingCycle.toLowerCase()}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-accent-foreground">Billing Cycle</p>
            <p className="text-xl font-bold">
              {billingCycle.charAt(0) + billingCycle.slice(1).toLowerCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
