import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";

export async function getCurrencyRates() {
  return prisma.currencyRate.findMany();
}

export async function getCurrencyRate(currency: Currency) {
  return prisma.currencyRate.findUnique({
    where: { currency },
  });
}

export async function upsertCurrencyRate(currency: Currency, rate: number) {
  return prisma.currencyRate.upsert({
    where: { currency },
    update: {
      rate,
      updatedAt: new Date(),
    },
    create: {
      currency,
      rate,
    },
  });
}

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
