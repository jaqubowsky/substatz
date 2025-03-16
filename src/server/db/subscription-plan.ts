import { prisma } from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";

export async function updateUserPlan(
  customerId: string,
  plan: SubscriptionPlan
) {
  return await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: { plan },
  });
}

export async function updateStripeCustomerId(
  userId: string,
  stripeCustomerId: string
) {
  return await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId },
  });
}
