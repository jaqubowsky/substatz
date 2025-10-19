import { MigrationFile, MigrationResult } from "@/features/migration/schemas/migration";
import * as dbOperations from "@/features/migration/server/db/migration";
import { MigrationReader } from "@/features/migration/server/lib/migration-reader";
import * as Sentry from "@sentry/nextjs";

export class MigrationExecutor {
  static async executeMigration(
    migration: MigrationFile
  ): Promise<MigrationResult> {
    const startTime = Date.now();

    try {
      const migrationSql = await MigrationReader.readMigrationSql(migration.path);
      const statements = MigrationReader.splitSqlStatements(migrationSql);

      await dbOperations.executeMigrationSql(statements);

      const executionTime = Date.now() - startTime;

      await dbOperations.recordMigration(
        migration.name,
        migration.checksum,
        executionTime
      );

      return {
        success: true,
        migrationName: migration.name,
        executionTime,
        output: `Successfully applied migration: ${migration.name}`,
        error: null,
        warning: null,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await dbOperations.recordFailedMigration(
        migration.name,
        migration.checksum,
        errorMessage
      );

      Sentry.captureException(error, {
        level: "error",
        tags: { origin: "migration_engine_execute", migration: migration.name },
        extra: { executionTime },
      });

      return {
        success: false,
        migrationName: migration.name,
        executionTime,
        output: "",
        error: `Failed to apply migration ${migration.name}: ${errorMessage}`,
        warning: null,
      };
    }
  }
}
