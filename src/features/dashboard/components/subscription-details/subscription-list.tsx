import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getSubscriptions } from "@/features/dashboard/server/queries";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { LoadingSubscriptionList } from "./loading-subscription-list";
import { SubscriptionCard } from "./subscription-card";
import { getServerAuth } from "@/hooks/get-server-auth";
import { SubscriptionWithCurrentValues } from "@/features/dashboard/lib/subscription-utils";

const SubscriptionListContent = async () => {
  const session = await getServerAuth();
  if (!session) throw new Error("User not found");

  const subscriptions = await getSubscriptions(session.user.id);

  if (subscriptions.length === 0) {
    return (
      <Card className="bg-accent/10 border-dashed">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <PlusCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold mb-2">
              No subscriptions yet
            </CardTitle>
            <CardDescription className="mb-6 max-w-md mx-auto">
              Add your first subscription to start tracking your expenses and
              get insights about your spending.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 max-h-[900px]">
      {subscriptions.map((subscription: SubscriptionWithCurrentValues) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
};

export const SubscriptionList = () => {
  return (
    <ErrorBoundaryWrapper componentName="Subscription List">
      <Suspense fallback={<LoadingSubscriptionList />}>
        <SubscriptionListContent />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
};
