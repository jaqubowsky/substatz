import { currencyEnum } from "@/schemas";
import { z } from "zod";

export const updateCurrencySchema = z.object({
  defaultCurrency: currencyEnum,
});

export type UpdateCurrencyValues = z.infer<typeof updateCurrencySchema>;
