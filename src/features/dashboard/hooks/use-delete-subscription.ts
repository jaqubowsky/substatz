"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SubscriptionResponse } from "../schemas/subscription";
import { removeSubscription } from "../server/actions";

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<SubscriptionResponse, Error, string>({
    mutationFn: async (id: string) => {
      return await removeSubscription(id);
    },
    onSuccess: (data) => {
      if (!data.success) {
        setError(data.error || "Failed to delete subscription");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-summary"] });
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to delete subscription");
    },
  });

  const deleteSubscriptionFn = async (id: string): Promise<boolean> => {
    setError(null);
    const result = await mutation.mutateAsync(id);
    return result.success;
  };

  return {
    deleteSubscription: deleteSubscriptionFn,
    isDeleting: mutation.isPending,
    error,
    reset: () => {
      setError(null);
      mutation.reset();
    },
  };
}
