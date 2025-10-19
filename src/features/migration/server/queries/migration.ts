"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { MigrationEngine } from "@/features/migration/server/lib/migration-engine";
import * as dbOperations from "@/features/migration/server/db/migration";
import { MigrationStatus } from "@/features/migration/schemas/migration";

export async function getMigrationStatus(): Promise<MigrationStatus> {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized: Admin access required");
  }

  return await MigrationEngine.getStatus();
}

export async function getMigrationHistory() {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized: Admin access required");
  }

  const appliedMigrations = await dbOperations.getAppliedMigrations();

  return {
    appliedMigrations,
    totalApplied: appliedMigrations.length,
    lastMigration:
      appliedMigrations[appliedMigrations.length - 1]?.name || null,
  };
}
