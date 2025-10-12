import { prisma } from "@/lib/prisma";
import { BillingCycle, Currency } from "@prisma/client";

export const getSubscriptionsByUserId = async (userId: string) => {
  "use cache";

  return prisma.subscription.findMany({
    where: { userId },
    include: {
      history: {
        where: { effectiveTo: null },
        take: 1,
      },
    },
    orderBy: [{ isCancelled: "asc" }, { name: "asc" }],
  });
};

export const getSubscriptionCountByUserId = async (userId: string) => {
  "use cache";

  return prisma.subscription.count({
    where: { userId },
  });
};

export const getSubscriptionById = async (id: string) => {
  "use cache";

  return prisma.subscription.findUnique({
    where: { id },
  });
};

export async function createSubscription(
  userId: string,
  name: string,
  startDate: Date
) {
  return prisma.subscription.create({
    data: {
      userId,
      name,
      startDate,
      isCancelled: false,
    },
  });
}

export async function updateSubscription(
  subscriptionId: string,
  data: {
    name?: string;
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

export const getSubscriptionHistory = async (subscriptionId: string) => {
  "use cache";

  return prisma.subscriptionHistory.findMany({
    where: { subscriptionId },
    orderBy: [
      { effectiveTo: { sort: "asc", nulls: "first" } },
      { effectiveFrom: "desc" },
    ],
  });
};

export const deleteSubscriptionHistory = async (id: string) => {
  return prisma.subscriptionHistory.delete({
    where: { id },
  });
};

export const addHistoricalPeriod = async (data: {
  subscriptionId: string;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  category: string;
  effectiveFrom: Date;
  effectiveTo: Date | null;
}) => {
  return prisma.subscriptionHistory.create({
    data,
  });
};

export const updateHistoricalPeriod = async (
  id: string,
  data: {
    price?: number;
    currency?: Currency;
    billingCycle?: BillingCycle;
    category?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date | null;
  }
) => {
  return prisma.subscriptionHistory.update({
    where: { id },
    data,
  });
};
