"use client";

import { SubscriptionPlan } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type SubscriptionPlan = "FREE" | "PAID";

export interface SubscriptionPlanState {
  isPaid: boolean | null;
  plan: SubscriptionPlan | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useSubscriptionPlan(): SubscriptionPlanState {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const isPaid = plan === SubscriptionPlan.PAID;
  const isLoading = status === "loading";

  useEffect(() => {
    if (isLoading) return;

    if (status === "unauthenticated") {
      setPlan(SubscriptionPlan.FREE);
      return;
    }

    setPlan(session?.user?.plan || SubscriptionPlan.FREE);
  }, [session, status, isLoading]);

  const refresh = async () => {
    await update();
    router.refresh();
  };

  return { isPaid, isLoading, plan, refresh };
}
