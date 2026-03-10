import type { Currency } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const getCurrencyRates = async () => {
  "use cache";

  return prisma.currencyRate.findMany();
};

export async function upsertCurrencyRates(
  rates: { currency: Currency; rate: number }[],
) {
  const transactions = rates.map(({ currency, rate }) =>
    prisma.currencyRate.upsert({
      where: { currency },
      update: {
        rate,
        updatedAt: new Date(),
      },
      create: {
        currency,
        rate,
      },
    }),
  );

  return prisma.$transaction(transactions);
}
