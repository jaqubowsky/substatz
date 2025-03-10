"use client";

import { useQuery } from "@tanstack/react-query";
import {
  SubscriptionSummaryResponse,
  UpcomingPayment,
} from "../schemas/subscription";
import { getSubscriptionSummary } from "../server/actions";

export function useSubscriptionSummary() {
  const query = useQuery<SubscriptionSummaryResponse>({
    queryKey: ["subscription-summary"],
    queryFn: async () => {
      return await getSubscriptionSummary();
    },
  });

  return {
    totalMonthly: query.data?.totalMonthly || 0,
    totalYearly: query.data?.totalYearly || 0,
    upcomingPayments: (query.data?.upcomingPayments || []).map((payment) => ({
      ...payment,
      nextPaymentDate:
        payment.nextPaymentDate instanceof Date
          ? payment.nextPaymentDate.toISOString()
          : payment.nextPaymentDate,
    })) as UpcomingPayment[],
    categoriesBreakdown: query.data?.categoriesBreakdown || {},
    isLoading: query.isPending,
    error: !query.data?.success ? query.data?.error : query.error?.message,
    refetch: query.refetch,
  };
}
