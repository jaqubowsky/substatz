import { Currency } from "@prisma/client";

export const formatCurrency = (
  amount: number,
  currency: Currency = Currency.USD
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
