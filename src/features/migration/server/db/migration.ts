import { prisma } from "@/lib/prisma";

export interface MigrationRecord {
  id: string;
  name: string;
  checksum: string;
  executedAt: Date;
  executionTimeMs: number | null;
  success: boolean;
  errorMessage: string | null;
}

export async function getAppliedMigrations(): Promise<MigrationRecord[]> {
  const migrations = await prisma.migration.findMany({
    orderBy: { executedAt: "asc" },
  });

  return migrations.map((record) => ({
    id: record.id,
    name: record.name,
    checksum: record.checksum,
    executedAt: new Date(record.executedAt),
    executionTimeMs: record.executionTimeMs,
    success: record.success,
    errorMessage: record.errorMessage,
  }));
}

export async function isMigrationApplied(
  migrationName: string
): Promise<boolean> {
  const migration = await prisma.migration.findFirst({
    where: {
      name: migrationName,
      success: true,
    },
  });
  return !!migration;
}

export async function recordMigration(
  migrationName: string,
  checksum: string,
  executionTimeMs: number
): Promise<void> {
  await prisma.migration.create({
    data: {
      name: migrationName,
      checksum,
      executionTimeMs,
      success: true,
    },
  });
}

export async function recordFailedMigration(
  migrationName: string,
  checksum: string,
  errorMessage: string
): Promise<void> {
  await prisma.migration.create({
    data: {
      name: migrationName,
      checksum,
      errorMessage,
      success: false,
    },
  });
}

export async function removeMigrationRecord(
  migrationName: string
): Promise<void> {
  await prisma.migration.delete({
    where: { name: migrationName },
  });
}

export async function clearAllMigrationRecords(): Promise<void> {
  await prisma.migration.deleteMany({});
}

export async function executeMigrationSql(
  sqlStatements: string[]
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        await tx.$executeRawUnsafe(statement);
      }
    }
  });
}

export async function getUserTables(): Promise<Array<{ TABLE_NAME: string }>> {
  return await prisma.$queryRaw`
    SELECT TABLE_NAME
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_TYPE = 'BASE TABLE'
    AND TABLE_NAME NOT LIKE '\\_%'
    AND TABLE_NAME NOT IN ('_migrations', '_migration_lock', 'Migration', 'MigrationLock')
  `;
}

export async function dropTable(tableName: string): Promise<void> {
  const validTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
  if (!validTableName) {
    throw new Error("Invalid table name");
  }
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS \`${validTableName}\``);
}

export async function acquireMigrationLock(): Promise<void> {
  try {
    await prisma.migrationLock.create({
      data: {
        lockedAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    return;
  } catch (error) {
    const existingLock = await prisma.migrationLock.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!existingLock || existingLock.expiresAt < new Date()) {
      await prisma.migrationLock.deleteMany();
      return await acquireMigrationLock();
    }

    throw new Error(
      "Migration lock is currently active. Please wait and try again."
    );
  }
}

export async function releaseMigrationLock(): Promise<void> {
  await prisma.migrationLock.deleteMany();
}

export async function setForeignKeyChecks(enabled: boolean): Promise<void> {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = ${enabled ? 1 : 0}`;
}
