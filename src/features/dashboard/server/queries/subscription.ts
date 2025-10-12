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

    const currentPeriod = subscription.history[0];
    if (!currentPeriod) continue;

    const convertedPrice = convertCurrency(
      currentPeriod.price,
      currentPeriod.currency,
      defaultCurrency,
      rates
    );

    totalMonthly += calculateMonthlyCost(
      convertedPrice,
      currentPeriod.billingCycle
    );
    totalYearly += calculateAnnualCost(
      convertedPrice,
      currentPeriod.billingCycle
    );

    if (categoriesBreakdown[currentPeriod.category]) {
      categoriesBreakdown[currentPeriod.category] += convertedPrice;
    } else {
      categoriesBreakdown[currentPeriod.category] = convertedPrice;
    }

    const nextPaymentDate = calculateNextPaymentDate(
      new Date(subscription.startDate),
      currentPeriod.billingCycle
    );

    if (nextPaymentDate >= today && nextPaymentDate <= endDate) {
      upcomingPayments.push({
        ...subscription,
        price: convertedPrice,
        currency: currentPeriod.currency,
        billingCycle: currentPeriod.billingCycle,
        category: currentPeriod.category,
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
