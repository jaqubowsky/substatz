import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionPlan } from "@prisma/client";
import { Check } from "lucide-react";
import Link from "next/link";
import { PricingCTA } from "./pricing-cta";

export default async function PricingPage() {
  const session = await auth();

  const isLoggedIn = !!session?.user;
  const userPlan = session?.user?.plan || SubscriptionPlan.FREE;

  return (
    <div className="container max-w-6xl px-4 py-12 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          One-time payment, lifetime access. No recurring fees or hidden costs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Basic subscription tracking</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">Forever</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Track 1 subscription</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Basic dashboard</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Limited analytics preview</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Email notifications</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {!isLoggedIn ? (
              <Button asChild className="w-full">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            ) : userPlan === "FREE" ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button disabled className="w-full">
                Downgrade Not Available
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="border-2 border-primary relative">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
            Popular
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Lifetime</CardTitle>
            <CardDescription>Complete subscription management</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$5</span>
              <span className="text-muted-foreground ml-2">
                One-time payment
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Unlimited subscriptions</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Full analytics dashboard</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Spending insights and reports</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Advanced notifications</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Lifetime updates</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {!isLoggedIn ? (
              <Button asChild className="w-full">
                <Link href="/auth/register?plan=paid">Get Started</Link>
              </Button>
            ) : userPlan === "PAID" ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <PricingCTA />
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          You're Wasting Money on Unused Subscriptions
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          The average person spends over $200 annually on subscriptions they
          don't use. For just $5 (one-time), SubscriptEase will help you track
          and manage all your subscriptions, potentially saving you hundreds of
          dollars every year.
        </p>
        <div className="p-6 bg-muted rounded-lg">
          <p className="text-lg font-medium">
            "I was paying for 3 streaming services I barely used. SubscriptEase
            helped me identify and cancel them, saving me over $40 every month!"
            - Sarah T.
          </p>
        </div>
      </div>
    </div>
  );
}
