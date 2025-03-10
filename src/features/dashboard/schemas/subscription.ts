import { z } from "zod";

export const billingCycleEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "BIANNUALLY",
  "ANNUALLY",
]);

export type BillingCycle = z.infer<typeof billingCycleEnum>;

export const subscriptionFormSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  nextPaymentDate: z.string().min(1, "Next payment date is required"),
  isCancelled: z.boolean().optional(),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export const subscriptionActionSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  nextPaymentDate: z.date({
    required_error: "Next payment date is required",
  }),
  isCancelled: z.boolean().optional(),
});

export type SubscriptionActionValues = z.infer<typeof subscriptionActionSchema>;

export interface Subscription {
  id: string;
  name: string;
  price: number;
  category: string;
  billingCycle: string;
  nextPaymentDate: string | Date;
  isCancelled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
}

export interface UpcomingPayment {
  id: string;
  name: string;
  price: number;
  nextPaymentDate: string | Date;
}

export interface CategoryBreakdown {
  [category: string]: number;
}

export interface BaseResponse {
  success: boolean;
  error?: string;
}

export interface SubscriptionResponse extends BaseResponse {
  subscription?: Subscription;
}

export interface SubscriptionsResponse extends BaseResponse {
  subscriptions?: Subscription[];
}

export interface SubscriptionSummaryResponse extends BaseResponse {
  totalMonthly?: number;
  totalYearly?: number;
  upcomingPayments?: UpcomingPayment[];
  categoriesBreakdown?: CategoryBreakdown;
}
