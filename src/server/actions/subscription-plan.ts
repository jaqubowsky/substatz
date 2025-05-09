"use server";

import { env } from "@/lib/env";
import { errors } from "@/lib/errorMessages";
import { ActionError, privateAction } from "@/lib/safe-action";
import { stripe } from "@/lib/stripe";
import {
  getUserWithPlan,
  updateStripeCustomerId,
} from "@/server/db/subscription-plan";
import { SubscriptionPlan } from "@prisma/client";

export const createCheckoutSessionAction = privateAction.action(
  async ({ ctx }) => {
    const { session } = ctx;
    const userId = session.user.id;

    const user = await getUserWithPlan(userId);
    let customerId = user?.stripeCustomerId || null;

    if (user?.plan === SubscriptionPlan.PAID) {
      throw new ActionError(errors.SUBSCRIPTION.ALREADY_PAID.message);
    }

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
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&status=cancelled`,
      metadata: {
        userId,
      },
      tax_id_collection: {
        enabled: true,
      },
      customer_update: {
        name: "auto",
        address: "auto",
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
