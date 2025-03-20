"use server";

import { errors } from "@/lib/errorMessages";
import { ActionError, privateAction } from "@/lib/safe-action";
import { stripe } from "@/lib/stripe";
import { updateUserPlan } from "@/server/db/subscription-plan";
import { SubscriptionPlan } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
      throw new ActionError(
        errors.SUBSCRIPTION.CHECKOUT_SESSION_NOT_FOUND.message
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(
      parsedInput.sessionId
    );

    if (checkoutSession.metadata?.userId !== userId) {
      throw new ActionError(
        errors.SUBSCRIPTION.CHECKOUT_SESSION_NOT_BELONG_TO_USER.message
      );
    }

    if (checkoutSession.payment_status !== "paid") {
      throw new ActionError(
        errors.SUBSCRIPTION.PAYMENT_STATUS_IS.message.replace(
          "{{status}}",
          checkoutSession.payment_status
        )
      );
    }

    await updateUserPlan(
      checkoutSession.customer as string,
      SubscriptionPlan.PAID
    );

    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return { success: true, message: "Payment verified successfully" };
  });
