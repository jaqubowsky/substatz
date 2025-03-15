import { Currency, SubscriptionPlan } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      email: string;
      id: string;
      plan: SubscriptionPlan;
      defaultCurrency: Currency;
      provider: "google" | "credentials";
    } & DefaultSession["user"];
  }

  interface User {
    plan: SubscriptionPlan;
    defaultCurrency: Currency;
    provider: "google" | "credentials";
  }
}
