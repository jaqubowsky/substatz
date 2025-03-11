import { getServerAuth } from "@/server";
import { CategoryBreakdown, UpcomingPayment } from "../../schemas/subscription";
import * as db from "../db/subscription";

export interface SubscriptionSummary {
  totalMonthly: number;
  totalYearly: number;
  upcomingPayments: UpcomingPayment[];
  categoriesBreakdown: CategoryBreakdown;
}

export const getSubscriptions = async () => {
  const session = await getServerAuth();
  if (!session?.user?.id) throw new Error("User not found");

  return await db.getSubscriptionsByUserId(session.user.id);
};

export const getSubscriptionSummary = async () => {
  const session = await getServerAuth();
  if (!session?.user?.id) throw new Error("User not found");

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
    totalMonthly,
    totalYearly,
    upcomingPayments,
    categoriesBreakdown,
  };
};
