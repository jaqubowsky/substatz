"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  SubscriptionFormValues,
  SubscriptionResponse,
} from "../schemas/subscription";
import { updateSubscription } from "../server/actions";

export function useUpdateSubscription(id: string) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    SubscriptionResponse,
    Error,
    SubscriptionFormValues
  >({
    mutationFn: async (data: SubscriptionFormValues) => {
      return await updateSubscription(id, data);
    },
    onSuccess: (data) => {
      if (!data.success) {
        setError(data.error || "Failed to update subscription");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-summary"] });
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to update subscription");
    },
  });

  const updateSubscriptionFn = async (
    data: SubscriptionFormValues
  ): Promise<boolean> => {
    setError(null);
    const result = await mutation.mutateAsync(data);
    return result.success;
  };

  return {
    updateSubscription: updateSubscriptionFn,
    isLoading: mutation.isPending,
    error,
    reset: () => {
      setError(null);
      mutation.reset();
    },
  };
}
