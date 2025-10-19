import * as dbOperations from "@/features/migration/server/db/migration";
import {
  MigrationStatus,
  MigrationResult,
} from "@/features/migration/schemas/migration";
import { MigrationReader } from "@/features/migration/server/lib/migration-reader";
import { MigrationExecutor } from "@/features/migration/server/lib/migration-executor";

export class MigrationEngine {
  static async getStatus(): Promise<MigrationStatus> {
    const [migrationFiles, appliedMigrations] = await Promise.all([
      MigrationReader.getMigrationFiles(),
      dbOperations.getAppliedMigrations(),
    ]);

    const appliedNames = new Set(appliedMigrations.map((m) => m.name));

    const migrations = migrationFiles.map((file) => ({
      name: file.name,
      path: file.path,
      checksum: file.checksum,
      sqlContent: file.sqlContent,
      timestamp: file.timestamp,
      description: file.description,
      applied: appliedNames.has(file.name),
    }));

    const pendingCount = migrations.filter((m) => !m.applied).length;
    const appliedCount = migrations.filter((m) => m.applied).length;
    const databaseUpToDate = pendingCount === 0;
    const lastMigration =
      appliedMigrations[appliedMigrations.length - 1]?.name || null;

    return {
      migrations,
      pendingCount,
      appliedCount,
      databaseUpToDate,
      lastMigration,
    };
  }

  static async deployMigrations(): Promise<MigrationResult[]> {
    try {
      await dbOperations.acquireMigrationLock();
    } catch (error) {
      throw error;
    }

    try {
      const status = await this.getStatus();
      const pendingMigrations = status.migrations.filter((m) => !m.applied);

      if (pendingMigrations.length === 0) {
        return [
          {
            success: true,
            migrationName: "none",
            executionTime: 0,
            output: "No pending migrations to deploy.",
            error: null,
            warning: null,
          },
        ];
      }

      const results: MigrationResult[] = [];

      for (const migration of pendingMigrations) {
        const result = await MigrationExecutor.executeMigration(migration);
        results.push(result);

        if (!result.success) {
          break;
        }
      }

      return results;
    } finally {
      await dbOperations.releaseMigrationLock();
    }
  }
}
