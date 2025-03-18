"use server";

import { prisma } from "@/lib/prisma";
import { privateAction } from "@/lib/safe-action";
import { stripe } from "@/lib/stripe";
import { SubscriptionPlan } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

export const verifyPaymentAction = privateAction.action(async ({ ctx }) => {
  const { session } = ctx;
  const userId = session.user.id;

  if (session.user.plan === SubscriptionPlan.PAID) {
    return { success: true, message: "Already on paid plan" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      throw new Error("No Stripe customer ID found for this user");
    }

    const paymentIntents = await stripe.paymentIntents.list({
      customer: user.stripeCustomerId,
      limit: 5,
    });

    const successfulPayments = paymentIntents.data
      .filter(
        (intent) =>
          intent.status === "succeeded" && intent.metadata?.userId === userId
      )
      .sort((a, b) => b.created - a.created);

    const latestSuccessfulPayment = successfulPayments[0];

    if (!latestSuccessfulPayment) {
      throw new Error("No successful payment found");
    }

    return { success: true, message: "Payment verified successfully" };
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: {
        origin: "payment_verification",
      },
    });

    throw new Error(
      error instanceof Error ? error.message : "Failed to verify payment"
    );
  }
});
