import { Paywall } from "@/components/paywall";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSubscriptionButton } from "./add-subscription-button";
import { AnalyticsTab } from "./analytics";
import { PaymentVerification } from "./payment-verification";
import { SubscriptionList } from "./subscription-list";
import { DashboardSummary } from "./summary/dashboard-summary";

export const Dashboard = async () => {
  return (
    <div className="container mx-auto py-6 px-4 h-full">
      <PaymentVerification />

      <Tabs defaultValue="subscriptions">
        <TabsList className="mb-6">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
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
        </TabsContent>

        <TabsContent value="analytics">
          <Paywall>
            <Card>
              <CardContent className="pt-6">
                <AnalyticsTab />
              </CardContent>
            </Card>
          </Paywall>
        </TabsContent>
      </Tabs>
    </div>
  );
};
