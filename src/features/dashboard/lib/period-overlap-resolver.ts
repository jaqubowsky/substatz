import { prisma } from "@/lib/prisma";
import { SubscriptionHistory } from "@prisma/client";
import { calculateDayBefore, calculateDayAfter } from "./period-date-utils";

export interface PeriodInput {
  effectiveFrom: Date;
  effectiveTo: Date | null;
}

export async function findOverlappingPeriods(
  subscriptionId: string,
  period: PeriodInput,
  excludeId?: string
): Promise<SubscriptionHistory[]> {
  const { effectiveFrom, effectiveTo } = period;

  return prisma.subscriptionHistory.findMany({
    where: {
      subscriptionId,
      ...(excludeId && { id: { not: excludeId } }),
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
        ...(effectiveTo
          ? [
              {
                AND: [
                  { effectiveFrom: { lt: effectiveTo } },
                  {
                    OR: [
                      { effectiveTo: null },
                      { effectiveTo: { gt: effectiveTo } },
                    ],
                  },
                ],
              },
            ]
          : []),
      ],
    },
  });
}

export async function resolveOverlaps(
  tx: Omit<
    typeof prisma,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  overlappingPeriods: SubscriptionHistory[],
  newPeriod: PeriodInput
): Promise<void> {
  const { effectiveFrom, effectiveTo } = newPeriod;

  for (const overlappingPeriod of overlappingPeriods) {
    if (
      overlappingPeriod.effectiveFrom < effectiveFrom &&
      (overlappingPeriod.effectiveTo === null ||
        overlappingPeriod.effectiveTo > effectiveFrom)
    ) {
      await tx.subscriptionHistory.update({
        where: { id: overlappingPeriod.id },
        data: {
          effectiveTo: calculateDayBefore(effectiveFrom),
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
        await tx.subscriptionHistory.update({
          where: { id: overlappingPeriod.id },
          data: {
            effectiveFrom: calculateDayAfter(effectiveTo),
          },
        });
      }
    }
  }
}

export async function validateCurrentPeriodExists(
  subscriptionId: string,
  periodId: string | null,
  newEffectiveTo: Date | null | undefined
): Promise<void> {
  if (newEffectiveTo === null || newEffectiveTo === undefined) {
    return;
  }

  const allPeriods = await prisma.subscriptionHistory.findMany({
    where: { subscriptionId },
  });

  if (allPeriods.length === 1) {
    throw new Error(
      "Cannot set an end date for the only period. The subscription must always have at least one current period."
    );
  }

  if (periodId) {
    const existingPeriod = allPeriods.find((p) => p.id === periodId);
    if (existingPeriod?.effectiveTo === null) {
      const hasOtherCurrentPeriod = allPeriods.some(
        (p) => p.id !== periodId && p.effectiveTo === null
      );
      if (!hasOtherCurrentPeriod) {
        throw new Error(
          "Cannot set an end date for this period as it's the only current period. Please create a new current period first."
        );
      }
    }
  }
}
