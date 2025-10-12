import { prisma } from "@/lib/prisma";
import { Subscription, BillingCycle, Currency } from "@prisma/client";
import { EditSubscriptionValues } from "@/features/dashboard/schemas/subscription";

function hasTrackedChanges(
  originalValues: {
    price: number;
    currency: Currency;
    billingCycle: BillingCycle;
    category: string;
  },
  updated: EditSubscriptionValues
): boolean {
  return (
    originalValues.price !== updated.price ||
    originalValues.currency !== updated.currency ||
    originalValues.billingCycle !== updated.billingCycle ||
    originalValues.category !== updated.category
  );
}

export async function createInitialHistory(data: {
  id: string;
  startDate: Date;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  category: string;
}) {
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId: data.id,
      price: data.price,
      currency: data.currency,
      billingCycle: data.billingCycle,
      category: data.category,
      effectiveFrom: data.startDate,
      effectiveTo: null,
    },
  });
}

export async function trackSubscriptionChanges(
  subscriptionId: string,
  updatedData: EditSubscriptionValues
) {
  const currentValues = await getCurrentSubscriptionValues(subscriptionId);

  if (!currentValues) {
    throw new Error(`Subscription ${subscriptionId} has no current period in history`);
  }

  if (!hasTrackedChanges(currentValues, updatedData)) {
    return;
  }

  const now = new Date();

  await prisma.subscriptionHistory.updateMany({
    where: {
      subscriptionId,
      effectiveTo: null,
    },
    data: {
      effectiveTo: now,
    },
  });

  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId,
      price: updatedData.price,
      currency: updatedData.currency,
      billingCycle: updatedData.billingCycle,
      category: updatedData.category,
      effectiveFrom: now,
      effectiveTo: null,
    },
  });
}

export async function getHistoricalValuesAt(
  subscriptionId: string,
  date: Date
) {
  const historyRecord = await prisma.subscriptionHistory.findFirst({
    where: {
      subscriptionId,
      effectiveFrom: {
        lte: date,
      },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: date } }],
    },
    orderBy: {
      effectiveFrom: "desc",
    },
  });

  return historyRecord;
}

export async function getHistoryPeriodsInRange(
  subscriptionId: string,
  startDate: Date,
  endDate: Date
) {
  const historyRecords = await prisma.subscriptionHistory.findMany({
    where: {
      subscriptionId,
      OR: [
        {
          effectiveFrom: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          AND: [
            { effectiveFrom: { lte: startDate } },
            {
              OR: [{ effectiveTo: null }, { effectiveTo: { gte: startDate } }],
            },
          ],
        },
      ],
    },
    orderBy: {
      effectiveFrom: "asc",
    },
  });

  return historyRecords;
}

export async function getCurrentSubscriptionValues(subscriptionId: string) {
  const currentPeriod = await prisma.subscriptionHistory.findFirst({
    where: {
      subscriptionId,
      effectiveTo: null,
    },
    orderBy: {
      effectiveFrom: "desc",
    },
  });

  return currentPeriod;
}

export async function getSubscriptionWithCurrentValues(subscriptionId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) {
    return null;
  }

  const currentValues = await getCurrentSubscriptionValues(subscriptionId);

  if (!currentValues) {
    throw new Error(`Subscription ${subscriptionId} has no current period in history`);
  }

  return {
    ...subscription,
    price: currentValues.price,
    currency: currentValues.currency,
    billingCycle: currentValues.billingCycle,
    category: currentValues.category,
  };
}
