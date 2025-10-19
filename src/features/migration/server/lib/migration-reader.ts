import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { MigrationFile } from "@/features/migration/schemas/migration";
import { generateChecksum } from "@/features/migration/utils/generate-checksum";

export class MigrationReader {
  private static readonly MIGRATIONS_PATH = join(
    process.cwd(),
    "prisma",
    "migrations"
  );

  static async getMigrationFiles(): Promise<MigrationFile[]> {
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

  static async readMigrationSql(filePath: string): Promise<string> {
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

  static splitSqlStatements(sql: string): string[] {
    return sql
      .split(/;\s*\n/)
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith("--"))
      .map((stmt) => (stmt.endsWith(";") ? stmt : `${stmt};`));
  }
}
