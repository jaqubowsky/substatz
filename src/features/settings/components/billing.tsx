import { PurchaseButton } from "@/components/purchase-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuth } from "@/hooks/get-server-auth";
import { SubscriptionPlan } from "@prisma/client";
import { CheckCircle2, Sparkles } from "lucide-react";
import { RefundButton } from "./refund-button";

export async function Billing() {
  const session = await getServerAuth();
  if (!session) return null;

  const isPro = session.user.plan === SubscriptionPlan.PAID;

  const planDetails = {
    free: {
      name: "Free",
      price: "$0",
      billing: "forever",
      badgeVariant: "secondary" as const,
      features: [
        "One subscription",
        "Basic tracking features",
        "Email support",
      ],
    },
    pro: {
      name: "Pro",
      price: "$5",
      billing: "one-time",
      badgeVariant: "default" as const,
      features: [
        "Unlimited subscriptions tracking",
        "Advanced analytics and reports",
        "Priority support",
      ],
    },
  };

  const currentPlan = isPro ? planDetails.pro : planDetails.free;

  return (
    <Card className="overflow-hidden">
      <div className={`${isPro ? "bg-primary/5" : "bg-muted/20"} w-full`}>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <CardTitle className="text-base font-medium">
                  {currentPlan.name} Plan
                </CardTitle>
                {isPro && <Sparkles className="h-4 w-4 text-primary" />}
              </div>
              <CardDescription className="text-sm">
                {isPro
                  ? "Enjoy all premium features and unlimited tracking"
                  : "Basic plan with limited features"}
              </CardDescription>
            </div>
            <Badge
              variant={currentPlan.badgeVariant}
              className={`px-2 py-0.5 text-xs ${
                isPro ? "bg-primary/10 hover:bg-primary/20 text-primary" : ""
              }`}
            >
              Active
            </Badge>
          </div>
        </CardHeader>
      </div>
      <CardContent>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-3xl font-semibold">{currentPlan.price}</span>
          <span className="text-accent-foreground text-sm">
            {currentPlan.billing}
          </span>
        </div>

        <div className="h-px w-full bg-muted/60 my-4"></div>

        <h3 className="font-medium text-sm mb-3">What&apos;s included:</h3>
        <div className="space-y-3">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <CheckCircle2
                className={`h-4 w-4 shrink-0 mt-0.5 ${
                  isPro ? "text-primary" : "text-accent-foreground"
                }`}
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t py-3 bg-muted/5">
        {isPro ? (
          <RefundButton />
        ) : (
          <PurchaseButton>Upgrade to Pro</PurchaseButton>
        )}
      </CardFooter>
    </Card>
  );
}
