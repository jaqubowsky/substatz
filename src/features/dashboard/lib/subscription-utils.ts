import {
  Subscription,
  SubscriptionHistory,
  BillingCycle,
  Currency,
} from "@prisma/client";

export type SubscriptionWithCurrentValues = Subscription & {
  history: SubscriptionHistory[];
};

export type SubscriptionWithFinancials = Subscription & {
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  category: string;
};

export function getCurrentValues(subscription: SubscriptionWithCurrentValues) {
  const currentPeriod = subscription.history[0];
  if (!currentPeriod) {
    throw new Error(
      `Subscription "${subscription.name}" (ID: ${subscription.id}) has no current pricing period. This is a data integrity issue - every subscription must have at least one active period.`
    );
  }

  return {
    price: currentPeriod.price,
    currency: currentPeriod.currency,
    billingCycle: currentPeriod.billingCycle,
    category: currentPeriod.category,
  };
}

export function toSubscriptionWithFinancials(
  subscription: SubscriptionWithCurrentValues
): SubscriptionWithFinancials {
  return {
    ...subscription,
    ...getCurrentValues(subscription),
  };
}
