"use server";

import { privateAction } from "@/lib/safe-action";
import * as db from "@/features/dashboard/server/db/subscription";
import { revalidatePath } from "next/cache";
import { addHistoricalPeriodSchema } from "@/features/dashboard/schemas/subscription-history";
import { ActionError } from "@/lib/safe-action";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  findOverlappingPeriods,
  resolveOverlaps,
  validateCurrentPeriodExists,
} from "@/features/dashboard/lib/period-overlap-resolver";

export const addHistoricalPeriodAction = privateAction
  .schema(addHistoricalPeriodSchema)
  .action(async ({ parsedInput }) => {
    const {
      subscriptionId,
      price,
      currency,
      billingCycle,
      category,
      effectiveFrom,
      effectiveTo,
    } = parsedInput;

    if (effectiveTo && effectiveTo <= effectiveFrom) {
      throw new ActionError(
        "End date must be after start date. Please check your date range."
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new ActionError(
        `Subscription not found. It may have been deleted. Please refresh the page.`
      );
    }

    const overlappingPeriods = await findOverlappingPeriods(subscriptionId, {
      effectiveFrom,
      effectiveTo: effectiveTo ?? null,
    });

    await prisma.$transaction(async (tx) => {
      await resolveOverlaps(tx, overlappingPeriods, {
        effectiveFrom,
        effectiveTo: effectiveTo ?? null,
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId,
          price,
          currency,
          billingCycle,
          category,
          effectiveFrom,
          effectiveTo: effectiveTo || null,
        },
      });

      if (effectiveFrom < subscription.startDate) {
        await tx.subscription.update({
          where: { id: subscriptionId },
          data: {
            startDate: effectiveFrom,
          },
        });
      }
    });

    revalidatePath("/dashboard");

    return { success: true };
  });

export const updateHistoricalPeriodAction = privateAction
  .schema(
    addHistoricalPeriodSchema.extend({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const {
      id,
      price,
      currency,
      billingCycle,
      category,
      effectiveFrom,
      effectiveTo,
    } = parsedInput;

    if (effectiveTo && effectiveTo <= effectiveFrom) {
      throw new ActionError(
        "End date must be after start date. Please check your date range."
      );
    }

    const existingPeriod = await prisma.subscriptionHistory.findUnique({
      where: { id },
    });

    if (!existingPeriod) {
      throw new ActionError(
        `Historical period not found. It may have been deleted. Please refresh the page.`
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: existingPeriod.subscriptionId },
    });

    if (!subscription) {
      throw new ActionError(
        `Subscription not found. It may have been deleted. Please refresh the page.`
      );
    }

    await validateCurrentPeriodExists(
      existingPeriod.subscriptionId,
      id,
      effectiveTo
    );

    const overlappingPeriods = await findOverlappingPeriods(
      existingPeriod.subscriptionId,
      {
        effectiveFrom,
        effectiveTo: effectiveTo ?? null,
      },
      id
    );

    await prisma.$transaction(async (tx) => {
      await resolveOverlaps(tx, overlappingPeriods, {
        effectiveFrom,
        effectiveTo: effectiveTo ?? null,
      });

      await tx.subscriptionHistory.update({
        where: { id },
        data: {
          price,
          currency,
          billingCycle,
          category,
          effectiveFrom,
          effectiveTo: effectiveTo || null,
        },
      });

      // Update subscription start date if this period starts earlier
      if (effectiveFrom < subscription.startDate) {
        await tx.subscription.update({
          where: { id: existingPeriod.subscriptionId },
          data: {
            startDate: effectiveFrom,
          },
        });
      }
    });

    revalidatePath("/dashboard");

    return { success: true };
  });

export const deleteHistoricalPeriodAction = privateAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

    const period = await prisma.subscriptionHistory.findUnique({
      where: { id },
    });

    if (!period) {
      throw new ActionError(
        `Historical period not found. It may have already been deleted. Please refresh the page.`
      );
    }

    const allPeriods = await prisma.subscriptionHistory.findMany({
      where: { subscriptionId: period.subscriptionId },
    });

    if (allPeriods.length === 1) {
      throw new ActionError(
        "Cannot delete the only period. A subscription must always have at least one period."
      );
    }

    if (period.effectiveTo === null) {
      const hasOtherCurrentPeriod = allPeriods.some(
        (p) => p.id !== id && p.effectiveTo === null
      );
      if (!hasOtherCurrentPeriod) {
        throw new ActionError(
          "Cannot delete this period as it's the only current period. Please create a new current period first."
        );
      }
    }

    await db.deleteSubscriptionHistory(id);
    revalidatePath("/dashboard");

    return { success: true };
  });
