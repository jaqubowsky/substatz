"use server";

import { privateAction } from "@/lib/safe-action";
import * as db from "@/features/dashboard/server/db/subscription";
import { revalidatePath } from "next/cache";
import { addHistoricalPeriodSchema } from "@/features/dashboard/schemas/subscription-history";
import { ActionError } from "@/lib/safe-action";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
      throw new ActionError("End date must be after start date");
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new ActionError("Subscription not found");
    }

    const overlappingPeriods = await prisma.subscriptionHistory.findMany({
      where: {
        subscriptionId,
        OR: [
          {
            AND: [
              { effectiveFrom: { lte: effectiveFrom } },
              {
                OR: [
                  { effectiveTo: null },
                  { effectiveTo: { gt: effectiveFrom } },
                ],
              },
            ],
          },
          effectiveTo
            ? {
                AND: [
                  { effectiveFrom: { lt: effectiveTo } },
                  {
                    OR: [
                      { effectiveTo: null },
                      { effectiveTo: { gt: effectiveTo } },
                    ],
                  },
                ],
              }
            : {},
        ],
      },
    });

    await prisma.$transaction(async (tx) => {
      for (const overlappingPeriod of overlappingPeriods) {
        if (
          overlappingPeriod.effectiveFrom < effectiveFrom &&
          (overlappingPeriod.effectiveTo === null ||
            overlappingPeriod.effectiveTo > effectiveFrom)
        ) {
          const dayBefore = new Date(effectiveFrom);
          dayBefore.setDate(dayBefore.getDate() - 1);

          await tx.subscriptionHistory.update({
            where: { id: overlappingPeriod.id },
            data: {
              effectiveTo: dayBefore,
            },
          });
        } else if (
          effectiveTo &&
          overlappingPeriod.effectiveFrom >= effectiveFrom &&
          overlappingPeriod.effectiveFrom < effectiveTo
        ) {
          if (
            overlappingPeriod.effectiveTo === null ||
            overlappingPeriod.effectiveTo <= effectiveTo
          ) {
            await tx.subscriptionHistory.delete({
              where: { id: overlappingPeriod.id },
            });
          } else {
            const dayAfter = new Date(effectiveTo);
            dayAfter.setDate(dayAfter.getDate() + 1);

            await tx.subscriptionHistory.update({
              where: { id: overlappingPeriod.id },
              data: {
                effectiveFrom: dayAfter,
              },
            });
          }
        }
      }

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
      throw new ActionError("End date must be after start date");
    }

    const existingPeriod = await prisma.subscriptionHistory.findUnique({
      where: { id },
    });

    if (!existingPeriod) {
      throw new ActionError("Period not found");
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: existingPeriod.subscriptionId },
    });

    if (!subscription) {
      throw new ActionError("Subscription not found");
    }

    const allPeriods = await prisma.subscriptionHistory.findMany({
      where: { subscriptionId: existingPeriod.subscriptionId },
    });

    if (
      allPeriods.length === 1 &&
      effectiveTo !== null &&
      effectiveTo !== undefined
    ) {
      throw new ActionError(
        "Cannot set an end date for the only period. The subscription must always have at least one current period."
      );
    }

    if (
      existingPeriod.effectiveTo === null &&
      effectiveTo !== null &&
      effectiveTo !== undefined
    ) {
      const hasOtherCurrentPeriod = allPeriods.some(
        (p) => p.id !== id && p.effectiveTo === null
      );
      if (!hasOtherCurrentPeriod) {
        throw new ActionError(
          "Cannot set an end date for this period as it's the only current period. Please create a new current period first."
        );
      }
    }

    const overlappingPeriods = await prisma.subscriptionHistory.findMany({
      where: {
        subscriptionId: existingPeriod.subscriptionId,
        id: { not: id },
        OR: [
          {
            AND: [
              { effectiveFrom: { lte: effectiveFrom } },
              {
                OR: [
                  { effectiveTo: null },
                  { effectiveTo: { gt: effectiveFrom } },
                ],
              },
            ],
          },
          effectiveTo
            ? {
                AND: [
                  { effectiveFrom: { lt: effectiveTo } },
                  {
                    OR: [
                      { effectiveTo: null },
                      { effectiveTo: { gt: effectiveTo } },
                    ],
                  },
                ],
              }
            : {},
        ],
      },
    });

    await prisma.$transaction(async (tx) => {
      for (const overlappingPeriod of overlappingPeriods) {
        if (
          overlappingPeriod.effectiveFrom < effectiveFrom &&
          (overlappingPeriod.effectiveTo === null ||
            overlappingPeriod.effectiveTo > effectiveFrom)
        ) {
          const dayBefore = new Date(effectiveFrom);
          dayBefore.setDate(dayBefore.getDate() - 1);

          await tx.subscriptionHistory.update({
            where: { id: overlappingPeriod.id },
            data: {
              effectiveTo: dayBefore,
            },
          });
        } else if (
          effectiveTo &&
          overlappingPeriod.effectiveFrom >= effectiveFrom &&
          overlappingPeriod.effectiveFrom < effectiveTo
        ) {
          if (
            overlappingPeriod.effectiveTo === null ||
            overlappingPeriod.effectiveTo <= effectiveTo
          ) {
            await tx.subscriptionHistory.delete({
              where: { id: overlappingPeriod.id },
            });
          } else {
            const dayAfter = new Date(effectiveTo);
            dayAfter.setDate(dayAfter.getDate() + 1);

            await tx.subscriptionHistory.update({
              where: { id: overlappingPeriod.id },
              data: {
                effectiveFrom: dayAfter,
              },
            });
          }
        }
      }

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
      throw new ActionError("Period not found");
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
