"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSubscriptionButton } from "./add-subscription-button";
import { AnalyticsTab } from "./analytics-tab";
import { DashboardSummary } from "./dashboard-summary";
import { SubscriptionList } from "./subscription-list";

export const Dashboard = () => {
  return (
    <div className="bg-secondary/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscriptions in one place
          </p>
        </div>

        <Tabs defaultValue="subscriptions" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      Your Subscriptions
                    </h2>
                    <AddSubscriptionButton />
                  </div>
                  <SubscriptionList />
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-lg shadow-sm p-6 sticky top-8">
                  <DashboardSummary />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <AnalyticsTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
