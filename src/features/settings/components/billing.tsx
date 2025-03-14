"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ManageBillingButton } from "./manage-billing-button";

export function Billing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Plan</CardTitle>
        <CardDescription>You are currently on the Premium plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$9.99</div>
        <p className="text-sm text-muted-foreground">One-time payment</p>
      </CardContent>
      <CardFooter>
        <ManageBillingButton />
      </CardFooter>
    </Card>
  );
}
