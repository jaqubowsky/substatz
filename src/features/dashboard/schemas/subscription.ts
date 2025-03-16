import { currencyEnum } from "@/schemas";
import { Subscription } from "@prisma/client";
import { z } from "zod";

export const billingCycleEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "BIANNUALLY",
  "ANNUALLY",
]);

export type BillingCycle = z.infer<typeof billingCycleEnum>;

export const editSubscriptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  currency: currencyEnum.default("USD"),
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  startDate: z.coerce.date(),
  isCancelled: z.boolean().optional().default(false),
  notes: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

export type EditSubscriptionValues = z.infer<typeof editSubscriptionSchema>;

export const addSubscriptionSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  currency: currencyEnum.default("USD"),
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  startDate: z.coerce.date(),
  isCancelled: z.boolean().optional().default(false),
  notes: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

export type AddSubscriptionValues = z.infer<typeof addSubscriptionSchema>;

export interface UpcomingPayment extends Subscription {
  nextPaymentDate: Date;
}

export interface CategoryBreakdown {
  [category: string]: number;
}
