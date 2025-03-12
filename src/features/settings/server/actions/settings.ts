"use server";

import { hashPassword, verifyPassword } from "@/features/auth/lib/auth";
import { errors } from "@/lib/errorMessages";
import { ActionError, privateAction } from "@/lib/safe-action";
import { changePasswordSchema, updateNameSchema } from "../../schemas/settings";
import * as db from "../db";

export const updateNameAction = privateAction
  .schema(updateNameSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { name } = parsedInput;

    const updatedUser = await db.updateUserName(ctx.session.user.id, name);

    return {
      name: updatedUser.name,
    };
  });

export const changePasswordAction = privateAction
  .schema(changePasswordSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { currentPassword, newPassword } = parsedInput;

    const user = await db.getUserById(ctx.session.user.id);
    if (!user) throw new ActionError(errors.USER.NOT_FOUND.message);

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) throw new ActionError(errors.USER.INVALID_PASSWORD.message);

    const hashedPassword = await hashPassword(newPassword);
    await db.updateUserPassword(ctx.session.user.id, hashedPassword);
  });

export const deleteAccountAction = privateAction.action(async ({ ctx }) => {
  const { user } = ctx.session;

  await db.deleteUser(user.id);
});
