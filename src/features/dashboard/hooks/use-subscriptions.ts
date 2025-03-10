"use client";

import { useQuery } from "@tanstack/react-query";
import { Subscription, SubscriptionsResponse } from "../schemas/subscription";
import { getSubscriptions } from "../server/actions";

export function useSubscriptions() {
  const query = useQuery<SubscriptionsResponse>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      return await getSubscriptions();
    },
  });

  return {
    subscriptions: (query.data?.subscriptions || []) as Subscription[],
    isLoading: query.isPending,
    error: !query.data?.success ? query.data?.error : query.error?.message,
    refetch: query.refetch,
  };
}
