"use server";

import { adminAction, ActionError } from "@/lib/safe-action";
import { errors } from "@/lib/errorMessages";
import { revalidatePath } from "next/cache";
import { MigrationEngine } from "@/features/migration/server/lib/migration-engine";
import { migrationActionSchema } from "@/features/migration/schemas/migration";
import * as Sentry from "@sentry/nextjs";

export const deployMigrations = adminAction
  .schema(migrationActionSchema.pick({ action: true }))
  .action(async ({ parsedInput: { action } }) => {
    if (action !== "deploy") {
      throw new ActionError(errors.GENERAL.VALIDATION_ERROR.message);
    }

    const results = await MigrationEngine.deployMigrations();

    revalidatePath("/admin");

    const displayResult =
      results.length > 0 ? results[results.length - 1] : null;

    return {
      success: results.every((r) => r.success),
      data: {
        results,
        displayResult,
        totalMigrations: results.length,
        successfulMigrations: results.filter((r) => r.success).length,
        failedMigrations: results.filter((r) => !r.success).length,
      },
    };
  });

export const rollbackMigration = adminAction
  .schema(migrationActionSchema.pick({ action: true, migrationName: true }))
  .action(async ({ parsedInput: { action, migrationName } }) => {
    if (action !== "rollback") {
      throw new ActionError(errors.GENERAL.VALIDATION_ERROR.message);
    }

    if (!migrationName) {
      throw new ActionError(errors.GENERAL.VALIDATION_ERROR.message);
    }

    Sentry.addBreadcrumb({
      message: "Rollback attempted",
      level: "info",
      data: { migrationName },
      category: "migration",
    });

    throw new ActionError(errors.MIGRATION.ROLLBACK_NOT_SUPPORTED.message);
  });

export const getMigrationStatusAction = adminAction
  .schema(migrationActionSchema.pick({ action: true }))
  .action(async ({ parsedInput: { action } }) => {
    if (action !== "status") {
      throw new ActionError(errors.GENERAL.VALIDATION_ERROR.message);
    }

    const status = await MigrationEngine.getStatus();
    return {
      success: true,
      data: status,
    };
  });
