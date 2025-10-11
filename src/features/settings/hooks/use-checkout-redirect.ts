"use client";

import { createCheckoutSessionAction } from "@/server/actions/subscription-plan";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

export function useCheckoutRedirect() {
  const action = useAction(createCheckoutSessionAction, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        toast.info("Redirecting to checkout...");
        window.location.href = data.url;
      } else {
        toast.error("Failed to redirect to checkout. Please try again.");
      }
    },
    onError: (error) => {
      toast.error(
        error.error.serverError ||
          "Failed to redirect to checkout. Please try again."
      );
    },
  });

  return {
    redirectToCheckout: action.execute,
    isRedirecting: action.isExecuting,
  };
}
