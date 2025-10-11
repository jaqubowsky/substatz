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

import { exportSubscriptionSchema } from "@/features/settings/schemas/export";
import { getFilteredSubscriptions } from "@/features/settings/server/db/export";
import {
  generateExcelFile,
  generatePdfFile,
} from "@/features/settings/server/export-utils";
import { SubscriptionPlan } from "@prisma/client";

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

export const exportSubscriptionsAction = privateAction
  .schema(exportSubscriptionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { dateFrom, dateTo, format } = parsedInput;
    const { user } = ctx.session;

    if (user.plan !== SubscriptionPlan.PAID) {
      throw new ActionError(errors.SUBSCRIPTION.EXPORT_PREMIUM_ONLY.message);
    }

    const subscriptions = await getFilteredSubscriptions(
      user.id,
      dateFrom,
      dateTo
    );

    if (subscriptions.length === 0) {
      throw new ActionError(
        errors.SUBSCRIPTION.NO_SUBSCRIPTIONS_TO_EXPORT.message
      );
    }

    let fileData: string;
    let mimeType: string;
    let fileExtension: string;

    try {
      if (format === "excel") {
        fileData = await generateExcelFile(subscriptions);
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileExtension = "xlsx";
      } else {
        fileData = await generatePdfFile(subscriptions);
        mimeType = "application/pdf";
        fileExtension = "pdf";
      }
    } catch {
      throw new ActionError(
        errors.SUBSCRIPTION.EXPORT_GENERATION_FAILED.message
      );
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const filename = `substatz-subscriptions-${currentDate}.${fileExtension}`;

    return {
      success: true,
      fileData,
      filename,
      mimeType,
    };
  });
