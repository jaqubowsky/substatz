"use server";

import { auth } from "@/lib/auth";
import { BillingCycle } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  subscriptionFormSchema,
  SubscriptionFormValues,
  type SubscriptionResponse,
  type SubscriptionsResponse,
  type SubscriptionSummaryResponse,
} from "../../schemas/subscription";
import * as db from "../db/subscription";

export async function getSubscriptions(): Promise<SubscriptionsResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to view subscriptions",
      };
    }

    const subscriptions = await db.getSubscriptionsByUserId(session.user.id);

    return {
      success: true,
      subscriptions,
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return {
      success: false,
      error: "Failed to fetch subscriptions",
    };
  }
}

export async function addSubscription(
  unsafeData: SubscriptionFormValues
): Promise<SubscriptionResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to add a subscription",
      };
    }

    const result = subscriptionFormSchema.safeParse(unsafeData);

    if (!result.success) {
      return {
        success: false,
        error: "Invalid subscription data",
      };
    }

    const { name, price, category, billingCycle, startDate } = result.data;

    const subscription = await db.createSubscription(
      session.user.id,
      name,
      parseFloat(price),
      category,
      billingCycle as BillingCycle,
      new Date(startDate)
    );

    revalidatePath("/dashboard");

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error("Error adding subscription:", error);
    return {
      success: false,
      error: "Failed to add subscription",
    };
  }
}

export async function updateSubscription(
  id: string,
  unsafeData: SubscriptionFormValues
): Promise<SubscriptionResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to update a subscription",
      };
    }

    const subscription = await db.getSubscriptionById(id);

    if (!subscription) {
      return {
        success: false,
        error: "Subscription not found",
      };
    }

    if (subscription.userId !== session.user.id) {
      return {
        success: false,
        error: "You do not have permission to update this subscription",
      };
    }

    const result = subscriptionFormSchema.safeParse(unsafeData);

    if (!result.success) {
      return {
        success: false,
        error: "Invalid subscription data",
      };
    }

    const { name, price, category, billingCycle, startDate, isCancelled } =
      result.data;

    const updatedSubscription = await db.updateSubscription(id, {
      name,
      price: parseFloat(price),
      category,
      billingCycle: billingCycle as BillingCycle,
      startDate: new Date(startDate),
      isCancelled,
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      subscription: updatedSubscription,
    };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return {
      success: false,
      error: "Failed to update subscription",
    };
  }
}

export async function removeSubscription(
  id: string
): Promise<SubscriptionResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete a subscription",
      };
    }

    const subscription = await db.getSubscriptionById(id);

    if (!subscription) {
      return {
        success: false,
        error: "Subscription not found",
      };
    }

    if (subscription.userId !== session.user.id) {
      return {
        success: false,
        error: "You do not have permission to delete this subscription",
      };
    }

    await db.deleteSubscription(id);

    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return {
      success: false,
      error: "Failed to delete subscription",
    };
  }
}

export async function getSubscriptionSummary(): Promise<SubscriptionSummaryResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to view subscription summary",
      };
    }

    const subscriptions = await db.getSubscriptionsByUserId(session.user.id);
    const upcomingPayments = await db.getUpcomingPayments(session.user.id);
    const categoriesBreakdown = await db.getSubscriptionsByCategory(
      session.user.id
    );

    let totalMonthly = 0;
    let totalYearly = 0;

    subscriptions.forEach((subscription) => {
      if (subscription.isCancelled) return;

      const price = subscription.price;

      switch (subscription.billingCycle) {
        case "MONTHLY":
          totalMonthly += price;
          totalYearly += price * 12;
          break;
        case "QUARTERLY":
          totalMonthly += price / 3;
          totalYearly += price * 4;
          break;
        case "BIANNUALLY":
          totalMonthly += price / 6;
          totalYearly += price * 2;
          break;
        case "ANNUALLY":
          totalMonthly += price / 12;
          totalYearly += price;
          break;
      }
    });

    return {
      success: true,
      totalMonthly,
      totalYearly,
      upcomingPayments,
      categoriesBreakdown,
    };
  } catch (error) {
    console.error("Error fetching subscription summary:", error);
    return {
      success: false,
      error: "Failed to fetch subscription summary",
    };
  }
}
