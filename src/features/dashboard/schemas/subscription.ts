import { currencyEnum } from "@/schemas";
import { z } from "zod";

import { SubscriptionWithFinancials } from "@/features/dashboard/lib/subscription-utils";

export const billingCycleEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "BIANNUALLY",
  "ANNUALLY",
]);

export type BillingCycle = z.infer<typeof billingCycleEnum>;

export const editSubscriptionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  currency: currencyEnum,
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  startDate: z.coerce.date(),
  isCancelled: z.boolean(),
});

export type EditSubscriptionValues = z.infer<typeof editSubscriptionSchema>;

export const addSubscriptionSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  currency: currencyEnum,
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  startDate: z.coerce.date(),
  isCancelled: z.boolean(),
});

export type AddSubscriptionValues = z.infer<typeof addSubscriptionSchema>;

export interface UpcomingPayment extends SubscriptionWithFinancials {
  nextPaymentDate: Date;
}

export const SUB_CATEGORIES = [
  "Entertainment",
  "Productivity",
  "Utilities",
  "Health & Fitness",
  "Education",
  "Food & Drink",
  "Shopping",
  "Other",
];
export interface CategoryBreakdown {
  [category: string]: number;
}
