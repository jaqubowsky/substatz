import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { BillingCycle, Currency } from "@prisma/client";

export const getSubscriptionsByUserId = cache(async (userId: string) => {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: [{ isCancelled: "asc" }, { name: "asc" }],
  });
});

export const getSubscriptionCountByUserId = cache(async (userId: string) => {
  return prisma.subscription.count({
    where: { userId },
  });
});

export const getSubscriptionById = cache(async (id: string) => {
  return prisma.subscription.findUnique({
    where: { id },
  });
});

export async function createSubscription(
  userId: string,
  name: string,
  price: number,
  currency: Currency,
  category: string,
  billingCycle: BillingCycle,
  startDate: Date
) {
  return prisma.subscription.create({
    data: {
      userId,
      name,
      price,
      currency,
      category,
      billingCycle,
      startDate,
      isCancelled: false,
    },
  });
}

export async function updateSubscription(
  subscriptionId: string,
  data: {
    name?: string;
    price?: number;
    currency?: Currency;
    category?: string;
    billingCycle?: BillingCycle;
    startDate?: Date;
    isCancelled?: boolean;
  }
) {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data,
  });
}

export async function deleteSubscription(id: string) {
  return prisma.subscription.delete({
    where: { id },
  });
}
