"use server";

import { privateAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { updateCurrencySchema } from "../../schemas/currency";
import { updateUserCurrency } from "../db/user";

export const updateCurrencyAction = privateAction
  .schema(updateCurrencySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { defaultCurrency } = parsedInput;
    const { user } = ctx.session;

    await updateUserCurrency(user.id, defaultCurrency);

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return { success: true };
  });
