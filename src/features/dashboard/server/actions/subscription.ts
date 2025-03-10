"use server";

import { auth } from "@/lib/auth";
import { BillingCycle } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  subscriptionActionSchema,
  SubscriptionFormValues,
  type SubscriptionResponse,
  type SubscriptionsResponse,
  type SubscriptionSummaryResponse,
} from "../../schemas/subscription";
import * as db from "../db";

export async function getSubscriptions(): Promise<SubscriptionsResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const subscriptions = await db.getSubscriptionsByUserId(session.user.id);
  return {
    success: true,
    subscriptions,
  };
}

export async function addSubscription(
  unsafeData: SubscriptionFormValues
): Promise<SubscriptionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const validationResult = subscriptionActionSchema.safeParse({
    name: unsafeData.name,
    price: parseFloat(unsafeData.price),
    category: unsafeData.category,
    billingCycle: unsafeData.billingCycle,
    nextPaymentDate: new Date(unsafeData.nextPaymentDate),
    isCancelled: unsafeData.isCancelled || false,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid subscription data",
    };
  }

  const validData = validationResult.data;

  const subscription = await db.createSubscription(
    session.user.id,
    validData.name,
    validData.price,
    validData.category,
    validData.billingCycle as BillingCycle,
    validData.nextPaymentDate
  );

  revalidatePath("/dashboard");
  return {
    success: true,
    subscription,
  };
}

export async function updateSubscription(
  id: string,
  unsafeData: SubscriptionFormValues
): Promise<SubscriptionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const subscription = await db.getSubscriptionById(id);

  if (!subscription || subscription.userId !== session.user.id) {
    return {
      success: false,
      error: "Subscription not found",
    };
  }

  const validationResult = subscriptionActionSchema.safeParse({
    name: unsafeData.name,
    price: parseFloat(unsafeData.price),
    category: unsafeData.category,
    billingCycle: unsafeData.billingCycle,
    nextPaymentDate: new Date(unsafeData.nextPaymentDate),
    isCancelled: unsafeData.isCancelled || false,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid subscription data",
    };
  }

  const validData = validationResult.data;

  const updatedSubscription = await db.updateSubscription(id, {
    name: validData.name,
    price: validData.price,
    category: validData.category,
    billingCycle: validData.billingCycle as BillingCycle,
    nextPaymentDate: validData.nextPaymentDate,
    isCancelled: validData.isCancelled,
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    subscription: updatedSubscription,
  };
}

export async function removeSubscription(
  id: string
): Promise<SubscriptionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const subscription = await db.getSubscriptionById(id);

  if (!subscription || subscription.userId !== session.user.id) {
    return {
      success: false,
      error: "Subscription not found",
    };
  }

  await db.deleteSubscription(id);

  revalidatePath("/dashboard");
  return {
    success: true,
  };
}

export async function getSubscriptionSummary(): Promise<SubscriptionSummaryResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const subscriptions = await db.getSubscriptionsByUserId(session.user.id);
  const upcomingPayments = await db.getUpcomingPayments(session.user.id);
  const categoriesBreakdown = await db.getSubscriptionsByCategory(
    session.user.id
  );

  let totalMonthly = 0;

  subscriptions.forEach(
    (subscription: { billingCycle: string; price: number; isCancelled: boolean }) => {
      if (subscription.isCancelled) return;

      switch (subscription.billingCycle) {
        case "MONTHLY":
          totalMonthly += subscription.price;
          break;
        case "QUARTERLY":
          totalMonthly += subscription.price / 3;
          break;
        case "BIANNUALLY":
          totalMonthly += subscription.price / 6;
          break;
        case "ANNUALLY":
          totalMonthly += subscription.price / 12;
          break;
      }
    }
  );

  const totalYearly = totalMonthly * 12;

  return {
    success: true,
    totalMonthly,
    totalYearly,
    upcomingPayments,
    categoriesBreakdown,
  };
}
