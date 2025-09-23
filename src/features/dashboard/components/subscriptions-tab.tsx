import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddSubscriptionButton } from "./add-subscription-button";
import { SubscriptionList } from "./subscription-details/subscription-list";
import { DashboardSummary } from "./summary/dashboard-summary";

export const SubscriptionsTab = async () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-2">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Your Subscriptions
            </CardTitle>
            <AddSubscriptionButton />
          </CardHeader>
          <CardContent>
            <SubscriptionList />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="sticky top-8">
          <CardContent className="pt-6">
            <DashboardSummary />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
