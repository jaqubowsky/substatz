import { z } from "zod";

export const migrationActionSchema = z.object({
  action: z.enum(["deploy", "status", "reset", "rollback"]),
  migrationName: z.string().optional(),
});

export const migrationRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  checksum: z.string(),
  executedAt: z.date(),
  executionTimeMs: z.number().nullable(),
  success: z.boolean(),
  errorMessage: z.string().nullable(),
});

export const migrationFileSchema = z.object({
  name: z.string(),
  path: z.string(),
  checksum: z.string(),
  sqlContent: z.string(),
  timestamp: z.string(),
  description: z.string(),
});

export const migrationStatusSchema = z.object({
  migrations: z.array(z.object({
    name: z.string(),
    path: z.string(),
    applied: z.boolean(),
    timestamp: z.string(),
    description: z.string(),
    checksum: z.string(),
    sqlContent: z.string(),
  })),
  pendingCount: z.number(),
  appliedCount: z.number(),
  databaseUpToDate: z.boolean(),
  lastMigration: z.string().nullable(),
});

export const migrationResultSchema = z.object({
  success: z.boolean(),
  migrationName: z.string(),
  executionTime: z.number(),
  output: z.string(),
  error: z.string().nullable(),
  warning: z.string().nullable(),
});

export type MigrationAction = z.infer<typeof migrationActionSchema>;
export type MigrationRecord = z.infer<typeof migrationRecordSchema>;
export type MigrationFile = z.infer<typeof migrationFileSchema>;
export type MigrationStatus = z.infer<typeof migrationStatusSchema>;
export type MigrationResult = z.infer<typeof migrationResultSchema>;
