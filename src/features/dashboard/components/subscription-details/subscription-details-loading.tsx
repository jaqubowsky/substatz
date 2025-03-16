import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function SubscriptionDetailsLoading() {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="pt-6 pb-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
}
