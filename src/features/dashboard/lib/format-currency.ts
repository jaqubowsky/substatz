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

export const exchangeRates: Record<Currency, number> = {
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

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount;

  const amountInUSD = amount / exchangeRates[fromCurrency];

  return amountInUSD * exchangeRates[toCurrency];
};
