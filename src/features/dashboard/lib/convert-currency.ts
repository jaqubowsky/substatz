import type { Currency } from "@/generated/prisma/client";

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: Record<Currency, number>,
): number => {
  if (fromCurrency === toCurrency) return amount;

  const amountInUSD = amount / rates[fromCurrency];

  return amountInUSD * rates[toCurrency];
};
