"use server";

import { updateCurrencySchema } from "@/features/settings/schemas/currency";
import { changePasswordSchema } from "@/features/settings/schemas/settings";
import * as db from "@/features/settings/server/db";
import { updateUserCurrency } from "@/features/settings/server/db/user";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { errors } from "@/lib/errorMessages";
import { ActionError, privateAction } from "@/lib/safe-action";
import { Provider } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

export const changePasswordAction = privateAction
  .schema(changePasswordSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { currentPassword, newPassword } = parsedInput;

    const user = await db.getUserById(ctx.session.user.id);
    if (!user) throw new ActionError(errors.USER.NOT_FOUND.message);

    if (ctx.session.user.provider === Provider.GOOGLE) {
      throw new ActionError(errors.USER.GOOGLE_PROVIDER.message);
    }

    if (!user.password) throw new ActionError(errors.USER.NO_PASSWORD.message);

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) throw new ActionError(errors.USER.INVALID_PASSWORD.message);

    const hashedPassword = await hashPassword(newPassword);
    await db.updateUserPassword(ctx.session.user.id, hashedPassword);
  });

export const deleteAccountAction = privateAction.action(async ({ ctx }) => {
  const { user } = ctx.session;

  await db.deleteUser(user.id);
});
