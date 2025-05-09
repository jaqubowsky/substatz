import { getCurrencyRates } from "@/server/db/currency-rates";
import { Currency } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

export const fallbackExchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 151.12,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.9,
  CNY: 7.24,
  INR: 83.36,
  PLN: 3.94,
};

export async function getLatestExchangeRates(): Promise<
  Record<Currency, number>
> {
  try {
    const dbRates = await getCurrencyRates();
    if (dbRates.length === 0) return fallbackExchangeRates;

    const rates: Partial<Record<Currency, number>> = {};

    dbRates.forEach((rate) => {
      rates[rate.currency] = rate.rate;
    });

    rates.USD = 1;

    Object.keys(fallbackExchangeRates).forEach((currency) => {
      if (!rates[currency as Currency]) {
        rates[currency as Currency] =
          fallbackExchangeRates[currency as Currency];
      }
    });

    return rates as Record<Currency, number>;
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: {
        origin: "getLatestExchangeRates",
      },
    });

    return fallbackExchangeRates;
  }
}
