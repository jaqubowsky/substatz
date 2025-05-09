"use server";

import {
  addSubscriptionSchema,
  editSubscriptionSchema,
} from "@/features/dashboard/schemas/subscription";
import * as db from "@/features/dashboard/server/db/subscription";
import { errors } from "@/lib/errorMessages";
import { ActionError, privateAction } from "@/lib/safe-action";
import { SubscriptionPlan } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { z } from "zod";

export const addSubscriptionAction = privateAction
  .schema(addSubscriptionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { name, price, currency, category, billingCycle, startDate } =
      parsedInput;

    const isFree = ctx.session.user.plan !== SubscriptionPlan.PAID;

    if (isFree) {
      const userSubscriptions = await db.getSubscriptionCountByUserId(
        ctx.session.user.id
      );

      if (userSubscriptions >= 1) {
        throw new ActionError(
          "Free users can only create one subscription. Upgrade to the paid plan for unlimited subscriptions."
        );
      }
    }

    const subscription = await db.createSubscription(
      ctx.session.user.id,
      name,
      price,
      currency,
      category,
      billingCycle,
      new Date(startDate)
    );

    revalidatePath("/dashboard");

    return subscription;
  });

export const updateSubscriptionAction = privateAction
  .schema(editSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const {
      id,
      name,
      price,
      currency,
      category,
      billingCycle,
      startDate,
      isCancelled,
    } = parsedInput;
    if (!id) throw new ActionError(errors.SUBSCRIPTION.NO_SUBSCRIPTION.message);

    const subscription = await db.updateSubscription(id, {
      name,
      price,
      currency,
      category,
      billingCycle,
      startDate: new Date(startDate),
      isCancelled,
    });

    revalidatePath("/dashboard");

    return subscription;
  });

export const removeSubscriptionAction = privateAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    const { user } = ctx.session;

    const { id } = parsedInput;
    if (!id) throw new ActionError(errors.SUBSCRIPTION.NO_SUBSCRIPTION.message);

    const subscription = await db.getSubscriptionById(id);
    if (!subscription) {
      throw new ActionError(errors.SUBSCRIPTION.NO_SUBSCRIPTION.message);
    }

    if (subscription.userId !== user.id) {
      throw new ActionError(errors.SUBSCRIPTION.PERMISSION_ERROR.message);
    }

    await db.deleteSubscription(id);

    revalidatePath("/dashboard");

    return { success: true };
  });
