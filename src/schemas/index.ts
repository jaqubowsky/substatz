import { z } from "zod";

const currencies = [
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
] as const;

export const currencyEnum = z.enum(currencies);

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
