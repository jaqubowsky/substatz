import { fallbackExchangeRates } from "@/lib/currency-rates";
import { getCurrencyRates } from "@/server/db/currency-rates";
import { Currency } from "@prisma/client";

export const formatCurrency = (
  amount: number,
  currency: Currency = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const exchangeRates = fallbackExchangeRates;

export async function getLatestExchangeRates(): Promise<
  Record<Currency, number>
> {
  try {
    const dbRates = await getCurrencyRates();

    if (dbRates.length === 0) {
      return fallbackExchangeRates;
    }

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
    console.error("Error fetching currency rates:", error);
    return fallbackExchangeRates;
  }
}

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: Record<Currency, number> = exchangeRates
): number => {
  if (fromCurrency === toCurrency) return amount;

  const amountInUSD = amount / rates[fromCurrency];

  return amountInUSD * rates[toCurrency];
};

export async function convertCurrencyWithLatestRates(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): Promise<number> {
  const rates = await getLatestExchangeRates();
  return convertCurrency(amount, fromCurrency, toCurrency, rates);
}
