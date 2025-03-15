import { prisma } from "@/lib/prisma";
import { privateAction } from "@/lib/safe-action";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";
import { SubscriptionPlan } from "@prisma/client";

export const createCheckoutSessionAction = privateAction.action(
  async ({ ctx }) => {
    const { session } = ctx;
    const userId = session.user.id;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    if (dbUser.plan === SubscriptionPlan.PAID) {
      throw new Error("You already have a paid subscription");
    }

    let customerId = dbUser.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name,
        metadata: {
          userId: dbUser.id,
        },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
      });
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
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: dbUser.id,
      },
    });

    return { url: checkoutSession.url };
  }
);
