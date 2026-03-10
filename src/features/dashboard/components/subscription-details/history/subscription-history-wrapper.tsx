import { getSubscriptionHistory } from "@/features/dashboard/server/db/subscription";
import type { Subscription } from "@/generated/prisma/client";
import { SubscriptionHistory } from "./subscription-history";

interface SubscriptionHistoryWrapperProps {
  subscription: Subscription;
}

export const SubscriptionHistoryWrapper = async ({
  subscription,
}: SubscriptionHistoryWrapperProps) => {
  const history = await getSubscriptionHistory(subscription.id);

  return <SubscriptionHistory history={history} />;
};
