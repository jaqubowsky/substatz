import { z } from "zod";

export const billingCycleEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "BIANNUALLY",
  "ANNUALLY",
]);

export type BillingCycle = z.infer<typeof billingCycleEnum>;

export const subscriptionFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  startDate: z.string().min(1, "Start date is required"),
  isCancelled: z.boolean().optional().default(false),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export const subscriptionActionSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  billingCycle: billingCycleEnum,
  startDate: z.date({
    required_error: "Start date is required",
  }),
  isCancelled: z.boolean().optional(),
});

export type SubscriptionActionValues = z.infer<typeof subscriptionActionSchema>;

export interface Subscription {
  id: string;
  name: string;
  price: number;
  category: string;
  billingCycle: BillingCycle;
  startDate: string | Date;
  isCancelled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
}

export interface UpcomingPayment extends Subscription {
  nextPaymentDate: Date;
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
