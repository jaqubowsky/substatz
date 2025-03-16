"use client";

import { Button } from "@/components/ui/button";
import { getBillingPortalUrlAction } from "@/features/settings/server/actions";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ManageBillingButton() {
  const router = useRouter();

  const defaultError =
    "Failed to get billing portal URL. Please try to relogin.";

  const action = useAction(getBillingPortalUrlAction, {
    onSuccess: ({ data }) => {
      if (!data?.url) return toast.error(defaultError);

      router.push(data.url);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || defaultError);
    },
  });

  return (
    <Button onClick={() => action.execute()} disabled={action.isExecuting}>
      {action.isExecuting ? "Redirecting..." : "Manage Billing"}
    </Button>
  );
}
