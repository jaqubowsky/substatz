import { z } from "zod";
import { currencyEnum } from "../../dashboard/schemas/subscription";

export const updateCurrencySchema = z.object({
  defaultCurrency: currencyEnum,
});

export type UpdateCurrencyValues = z.infer<typeof updateCurrencySchema>;
