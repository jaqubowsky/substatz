"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  SubscriptionFormValues,
  SubscriptionResponse,
} from "../schemas/subscription";
import { addSubscription } from "../server/actions";

export function useAddSubscription() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    SubscriptionResponse,
    Error,
    SubscriptionFormValues
  >({
    mutationFn: async (data: SubscriptionFormValues) => {
      return await addSubscription(data);
    },
    onSuccess: (data) => {
      if (!data.success) {
        setError(data.error || "Failed to add subscription");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-summary"] });
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to add subscription");
    },
  });

  const addSubscriptionFn = async (
    data: SubscriptionFormValues
  ): Promise<boolean> => {
    setError(null);
    const result = await mutation.mutateAsync(data);
    return result.success;
  };

  return {
    addSubscription: addSubscriptionFn,
    isLoading: mutation.isPending,
    error,
    reset: () => {
      setError(null);
      mutation.reset();
    },
  };
}
