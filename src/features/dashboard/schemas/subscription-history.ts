import { z } from "zod";

export const addHistoricalPeriodSchema = z.object({
  subscriptionId: z.string(),
  price: z.number().positive(),
  currency: z.enum([
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
  ]),
  billingCycle: z.enum(["MONTHLY", "QUARTERLY", "BIANNUALLY", "ANNUALLY"]),
  category: z.string().min(1),
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
});
