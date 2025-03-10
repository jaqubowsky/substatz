import { prisma } from "@/lib/prisma";
import { BillingCycle, Subscription } from "@prisma/client";

export async function getSubscriptionsByUserId(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: { nextPaymentDate: "asc" },
  });
}

export async function getSubscriptionById(id: string) {
  return prisma.subscription.findUnique({
    where: { id },
  });
}

export async function createSubscription(
  userId: string,
  name: string,
  price: number,
  category: string,
  billingCycle: BillingCycle,
  nextPaymentDate: Date
) {
  return prisma.subscription.create({
    data: {
      userId,
      name,
      price,
      category,
      billingCycle,
      nextPaymentDate,
    },
  });
}

export async function updateSubscription(
  id: string,
  data: {
    name?: string;
    price?: number;
    category?: string;
    billingCycle?: BillingCycle;
    nextPaymentDate?: Date;
    isCancelled?: boolean;
  }
) {
  return prisma.subscription.update({
    where: { id },
    data,
  });
}

export async function deleteSubscription(id: string) {
  return prisma.subscription.delete({
    where: { id },
  });
}

export async function getUpcomingPayments(userId: string, days: number = 30) {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + days);

  return prisma.subscription.findMany({
    where: {
      userId,
      nextPaymentDate: {
        gte: today,
        lte: endDate,
      },
      isCancelled: false,
    },
    orderBy: {
      nextPaymentDate: "asc",
    },
  });
}

export async function getSubscriptionsByCategory(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId, isCancelled: false },
  });

  const categories: Record<string, number> = {};

  subscriptions.forEach((subscription: Subscription) => {
    if (categories[subscription.category]) {
      categories[subscription.category] += subscription.price;
    } else {
      categories[subscription.category] = subscription.price;
    }
  });

  return categories;
}
