"use server";

import { ActionError, privateAction } from "@/lib/safe-action";
import { stripe } from "@/lib/stripe";
import { updateUserPlan } from "@/server/db/subscription-plan";
import { SubscriptionPlan } from "@prisma/client";
import { z } from "zod";

export const verifyPaymentAction = privateAction
  .schema(
    z.object({
      sessionId: z.string().optional(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { session } = ctx;
    const userId = session.user.id;

    if (session.user.plan === SubscriptionPlan.PAID) {
      return { success: true, message: "Already on paid plan" };
    }

    if (!parsedInput.sessionId) {
      throw new ActionError("No checkout session ID provided");
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(
      parsedInput.sessionId
    );

    if (checkoutSession.metadata?.userId !== userId) {
      throw new ActionError("Checkout session does not belong to this user");
    }

    if (checkoutSession.payment_status !== "paid") {
      throw new ActionError(
        `Payment status is ${checkoutSession.payment_status}`
      );
    }

    await updateUserPlan(
      checkoutSession.customer as string,
      SubscriptionPlan.PAID
    );

    return { success: true, message: "Payment verified successfully" };
  });
