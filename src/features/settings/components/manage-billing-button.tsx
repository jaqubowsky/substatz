"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ManageBillingButton() {
  const handleManageBilling = () => {
    toast.info("Redirecting to Stripe billing portal...", {
      description:
        "This is a placeholder. In a real app, this would redirect to Stripe.",
    });
    console.log("Redirecting to Stripe billing portal");
  };

  return <Button onClick={handleManageBilling}>Manage Billing</Button>;
}
