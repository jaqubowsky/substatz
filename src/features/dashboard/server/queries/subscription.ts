import { calculateNextPaymentDate } from "@/features/dashboard/lib/calculate-next-payment-date";
import { convertCurrency } from "@/features/dashboard/lib/convert-currency";
import {
  CategoryBreakdown,
  UpcomingPayment,
} from "@/features/dashboard/schemas/subscription";
import * as db from "@/features/dashboard/server/db/subscription";
import { calculateAnnualCost, calculateMonthlyCost } from "@/lib/billing-utils";
import { Currency } from "@prisma/client";
import { getLatestExchangeRates } from "./rates";

export interface SubscriptionSummary {
  totalMonthly: number;
  totalYearly: number;
  upcomingPayments: UpcomingPayment[];
  categoriesBreakdown: CategoryBreakdown;
}

export const getSubscriptions = async (userId: string) => {
  "use cache";

  return db.getSubscriptionsByUserId(userId);
};

export const getSubscriptionSummary = async (
  userId: string,
  defaultCurrency: Currency
) => {
  "use cache";

  const subscriptions = await getSubscriptions(userId);
  const rates = await getLatestExchangeRates();

  let totalMonthly = 0;
  let totalYearly = 0;

  const categoriesBreakdown: Record<string, number> = {};

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7);

  const upcomingPayments = [];

  for (const subscription of subscriptions) {
    if (subscription.isCancelled) continue;

    const convertedPrice = convertCurrency(
      subscription.price,
      subscription.currency,
      defaultCurrency,
      rates
    );

    totalMonthly += calculateMonthlyCost(
      convertedPrice,
      subscription.billingCycle
    );
    totalYearly += calculateAnnualCost(
      convertedPrice,
      subscription.billingCycle
    );

    if (categoriesBreakdown[subscription.category]) {
      categoriesBreakdown[subscription.category] += convertedPrice;
    } else {
      categoriesBreakdown[subscription.category] = convertedPrice;
    }

    const nextPaymentDate = calculateNextPaymentDate(
      new Date(subscription.startDate),
      subscription.billingCycle
    );

    if (nextPaymentDate >= today && nextPaymentDate <= endDate) {
      upcomingPayments.push({
        ...subscription,
        price: convertedPrice,
        nextPaymentDate,
      });
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
