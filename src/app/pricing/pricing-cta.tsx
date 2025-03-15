"use client";

import { Button } from "@/components/ui/button";
import { createCheckoutSessionAction } from "@/server/actions/subscription-plan";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PricingCTA() {
  const router = useRouter();

  const defaultError = "Failed to start checkout process. Please try again.";

  const action = useAction(createCheckoutSessionAction, {
    onSuccess: ({ data }) => {
      if (data?.url) return router.push(data.url);

      toast.error(defaultError);
    },
    onError: (error) => {
      toast.error(error.error.serverError || defaultError);
    },
  });

  return (
    <Button
      onClick={() => action.execute()}
      className="w-full"
      disabled={action.isExecuting}
    >
      {action.isExecuting ? "Processing..." : "Upgrade Now"}
    </Button>
  );
}
