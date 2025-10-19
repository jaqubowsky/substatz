import { readdir, readFile } from "fs/promises";
import { join } from "path";
import * as dbOperations from "@/features/migration/server/db/migration";
import {
  MigrationFile,
  MigrationStatus,
  MigrationResult,
} from "@/features/migration/schemas/migration";
import * as Sentry from "@sentry/nextjs";
import { generateChecksum } from "@/features/migration/utils/generate-checksum";

export class MigrationEngine {
  private static readonly MIGRATIONS_PATH = join(
    process.cwd(),
    "prisma",
    "migrations"
  );

  static async getStatus(): Promise<MigrationStatus> {
    const [migrationFiles, appliedMigrations] = await Promise.all([
      this.getMigrationFiles(),
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
        const result = await this.executeMigration(migration);
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

  private static async executeMigration(
    migration: MigrationFile
  ): Promise<MigrationResult> {
    const startTime = Date.now();

    try {
      const migrationSql = await this.readMigrationSql(migration.path);
      const statements = this.splitSqlStatements(migrationSql);

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

  static async resetDatabase(): Promise<MigrationResult> {
    const startTime = Date.now();

    try {
      await dbOperations.acquireMigrationLock();
    } catch (error) {
      throw error;
    }

    try {
      const tables = await dbOperations.getUserTables();

      await dbOperations.setForeignKeyChecks(false);

      for (const table of tables) {
        await dbOperations.dropTable(table.TABLE_NAME);
      }

      await dbOperations.setForeignKeyChecks(true);

      await dbOperations.clearAllMigrationRecords();

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        migrationName: "database_reset",
        executionTime,
        output: `Database reset successfully. Dropped ${tables.length} tables.`,
        error: null,
        warning:
          "All data has been permanently deleted. This cannot be undone.",
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      Sentry.captureException(error, {
        level: "error",
        tags: { origin: "migration_engine_reset" },
      });

      return {
        success: false,
        migrationName: "database_reset",
        executionTime,
        output: "",
        error: `Failed to reset database: ${errorMessage}`,
        warning: null,
      };
    } finally {
      await dbOperations.releaseMigrationLock();
    }
  }

  private static async getMigrationFiles(): Promise<MigrationFile[]> {
    try {
      const entries = await readdir(this.MIGRATIONS_PATH, {
        withFileTypes: true,
      });
      const migrationDirs = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
        .reverse();

      const migrationFiles: MigrationFile[] = [];

      for (const dir of migrationDirs) {
        const migrationPath = join(this.MIGRATIONS_PATH, dir);
        const migrationSqlPath = join(migrationPath, "migration.sql");

        try {
          const sqlContent = await readFile(migrationSqlPath, "utf-8");
          const checksum = generateChecksum(sqlContent);

          const [timestamp, ...descriptionParts] = dir.split("_");
          const description = descriptionParts.join("_");

          migrationFiles.push({
            name: dir,
            path: migrationSqlPath,
            checksum,
            sqlContent,
            timestamp,
            description: description || "No description",
          });
        } catch (error) {
          console.warn(`Failed to read migration ${dir}:`, error);
        }
      }

      return migrationFiles.sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
      );
    } catch (error) {
      throw new Error(
        `Failed to read migration files: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private static async readMigrationSql(filePath: string): Promise<string> {
    try {
      return await readFile(filePath, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to read migration SQL from ${filePath}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private static splitSqlStatements(sql: string): string[] {
    const statements = sql
      .split(/;\s*\n/)
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith("--"))
      .map((stmt) => (stmt.endsWith(";") ? stmt : `${stmt};`));

    return statements;
  }
}
