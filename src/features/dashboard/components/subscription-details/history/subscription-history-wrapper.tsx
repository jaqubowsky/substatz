import { getSubscriptionHistory } from "@/features/dashboard/server/db/subscription";
import { SubscriptionHistory } from "./subscription-history";
import { Subscription } from "@prisma/client";

interface SubscriptionHistoryWrapperProps {
  subscription: Subscription;
}

export const SubscriptionHistoryWrapper = async ({
  subscription,
}: SubscriptionHistoryWrapperProps) => {
  const history = await getSubscriptionHistory(subscription.id);

  return <SubscriptionHistory history={history} />;
};
