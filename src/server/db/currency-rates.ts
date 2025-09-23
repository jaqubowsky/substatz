import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";

export const getCurrencyRates = async () => {
  "use cache";

  return prisma.currencyRate.findMany();
};

export async function upsertCurrencyRates(
  rates: { currency: Currency; rate: number }[]
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
    })
  );

  return prisma.$transaction(transactions);
}
