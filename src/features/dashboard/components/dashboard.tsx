import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTab } from "./analytics/analytics-tab";
import { PaymentVerification } from "./payment-verification";
import { SubscriptionsTab } from "./subscriptions-tab";

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
          <SubscriptionsTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
