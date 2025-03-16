import { z } from "zod";

export const currencyEnum = z.enum([
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "PLN",
]);
export type CurrencyType = z.infer<typeof currencyEnum>;

export const currencySymbols: Record<CurrencyType, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  CNY: "¥",
  INR: "₹",
  PLN: "zł",
};
