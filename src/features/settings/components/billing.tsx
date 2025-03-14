"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function Billing() {
  const handleManageBilling = () => {
    toast.info("Redirecting to Stripe billing portal...", {
      description:
        "This is a placeholder. In a real app, this would redirect to Stripe.",
    });
    console.log("Redirecting to Stripe billing portal");
  };

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
        <Button onClick={handleManageBilling}>Manage Billing</Button>
      </CardFooter>
    </Card>
  );
}
