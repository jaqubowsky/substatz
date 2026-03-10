import { z } from "zod";
import { currencyEnum } from "@/schemas";

export const updateCurrencySchema = z.object({
  defaultCurrency: currencyEnum,
});

export type UpdateCurrencyValues = z.infer<typeof updateCurrencySchema>;
