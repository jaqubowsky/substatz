import { auth } from "@/auth";
import { calculateAnnualCost, calculateMonthlyCost } from "@/lib/billing-utils";
import { Currency } from "@prisma/client";
import { calculateNextPaymentDate } from "../../lib/calculate-next-payment-date";
import { convertCurrency } from "../../lib/format-currency";
import { CategoryBreakdown, UpcomingPayment } from "../../schemas/subscription";
import * as db from "../db/subscription";

export interface SubscriptionSummary {
  totalMonthly: number;
  totalYearly: number;
  upcomingPayments: UpcomingPayment[];
  categoriesBreakdown: CategoryBreakdown;
}

export const getSubscriptions = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User not found");

  return await db.getSubscriptionsByUserId(session.user.id);
};

export const getSubscriptionSummary = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User not found");

  const subscriptions = await db.getSubscriptionsByUserId(session.user.id);

  let totalMonthly = 0;
  let totalYearly = 0;

  const categoriesBreakdown: Record<string, number> = {};

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7);

  const upcomingPayments = [];

  for (const subscription of subscriptions) {
    if (!subscription.isCancelled) {
      const price = convertCurrency(
        subscription.price,
        subscription.currency,
        session.user.defaultCurrency || Currency.USD
      );

      totalMonthly += calculateMonthlyCost(price, subscription.billingCycle);
      totalYearly += calculateAnnualCost(price, subscription.billingCycle);

      if (categoriesBreakdown[subscription.category]) {
        categoriesBreakdown[subscription.category] += price;
      } else {
        categoriesBreakdown[subscription.category] = price;
      }

      const nextPaymentDate = calculateNextPaymentDate(
        subscription.startDate,
        subscription.billingCycle
      );

      if (nextPaymentDate >= today && nextPaymentDate <= endDate) {
        upcomingPayments.push({
          ...subscription,
          nextPaymentDate,
        });
      }
    }
  }

  upcomingPayments.sort(
    (a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime()
  );

  return {
    totalMonthly,
    totalYearly,
    upcomingPayments,
    categoriesBreakdown,
  };
};
