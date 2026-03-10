"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { createCheckoutSessionAction } from "@/server/actions/subscription-plan";

export function PurchaseButton({ children, className, ...props }: ButtonProps) {
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
      className={cn(className)}
      disabled={action.isExecuting}
      {...props}
    >
      {action.isExecuting ? "Processing..." : children}
    </Button>
  );
}
