import { prisma } from "@/lib/prisma";
import { BillingCycle, Subscription } from "@prisma/client";
import { calculateNextPaymentDate } from "../../lib/calculate-next-payment-date";

export async function getSubscriptionsByUserId(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
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
  startDate: Date
) {
  return prisma.subscription.create({
    data: {
      userId,
      name,
      price,
      category,
      billingCycle,
      startDate,
      isCancelled: false,
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
    startDate?: Date;
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
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      isCancelled: false,
    },
  });

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + days);

  const upcomingPayments = subscriptions
    .map((subscription) => {
      const nextPaymentDate = calculateNextPaymentDate(
        subscription.startDate,
        subscription.billingCycle
      );

      return {
        ...subscription,
        nextPaymentDate,
      };
    })
    .filter((subscription) => {
      return (
        subscription.nextPaymentDate >= today &&
        subscription.nextPaymentDate <= endDate
      );
    })
    .sort((a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime());

  return upcomingPayments;
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
