import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard } from "lucide-react";
import { Suspense } from "react";
import { AddSubscriptionButton } from "./add-subscription-button";
import { AnalyticsTab } from "./analytics/analytics-tab";
import { DashboardSummary } from "./dashboard-summary";
import { SubscriptionList } from "./subscription-list";
import { SubscriptionSkeleton } from "./subscription-skeleton";

export const Dashboard = () => {
  return (
    <div className="bg-secondary/30 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Card className="mb-6 border-none bg-transparent shadow-none">
          <CardHeader className="px-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Dashboard
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Manage your subscriptions in one place
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="subscriptions" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                      Your Subscriptions
                    </CardTitle>
                    <AddSubscriptionButton />
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={
                        <div className="space-y-4">
                          <SubscriptionSkeleton />
                          <SubscriptionSkeleton />
                          <SubscriptionSkeleton />
                        </div>
                      }
                    >
                      <SubscriptionList />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="sticky top-8">
                  <CardContent className="pt-6">
                    <Suspense
                      fallback={
                        <>
                          <div className="space-y-6">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-5 w-24 mt-4" />
                            <Skeleton className="h-7 w-28" />
                            <Separator className="my-4" />
                            <Skeleton className="h-5 w-32" />
                            <div className="space-y-2 mt-3">
                              <Skeleton className="h-16 w-full" />
                              <Skeleton className="h-16 w-full" />
                            </div>
                          </div>
                        </>
                      }
                    >
                      <DashboardSummary />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="pt-6">
                <AnalyticsTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
