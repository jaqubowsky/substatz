"use server";

import { prisma } from "@/lib/prisma";
import { privateAction } from "@/lib/safe-action";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";
import { updateStripeCustomerId } from "@/server/db/subscription-plan";
import { SubscriptionPlan } from "@prisma/client";

export const createCheckoutSessionAction = privateAction.action(
  async ({ ctx }) => {
    const { session } = ctx;
    const userId = session.user.id;

    const userPlan = session.user.plan;
    if (userPlan === SubscriptionPlan.PAID) {
      throw new Error("You already have a paid subscription");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });
    let customerId = user?.stripeCustomerId || null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || "",
        metadata: {
          userId,
        },
      });

      customerId = customer.id;

      await updateStripeCustomerId(userId, customerId);
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.AUTH_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.AUTH_URL}/pricing?payment=cancelled`,
      metadata: {
        userId,
      },
      payment_intent_data: {
        metadata: {
          userId,
        },
      },
    });

    return { url: checkoutSession.url };
  }
);
