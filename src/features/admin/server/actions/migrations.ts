"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { adminAction } from "@/lib/safe-action";
import * as Sentry from "@sentry/nextjs";
import { exec } from "child_process";
import { readdir } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { promisify } from "util";
import { z } from "zod";

const execPromise = promisify(exec);

interface Migration {
  name: string;
  applied: boolean;
  timestamp: string;
  description: string;
}

async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function getMigrations() {
  try {
    await checkAdminAuth();

    const migrationsPath = join(process.cwd(), "prisma", "migrations");
    const migrations = await readdir(migrationsPath, { withFileTypes: true });

    const migrationFolders = migrations
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .sort()
      .reverse();

    const appliedMigrations: string[] = [];
    let allUpToDate = false;

    try {
      const { stdout } = await execPromise(
        "npx prisma migrate status --schema=./prisma/schema.prisma"
      );

      if (stdout.includes("Database schema is up to date")) {
        allUpToDate = true;
      } else {
        const lines = stdout.split("\n");

        lines.forEach((line) => {
          const match = line.match(/(\d{14}_[\w-]+)/);
          if (match && !line.toLowerCase().includes("pending")) {
            appliedMigrations.push(match[1]);
          }
        });
      }
    } catch (error) {
      Sentry.captureException(error, {
        level: "warning",
        tags: { origin: "admin_migrations_status" },
      });
    }

    const migrationList: Migration[] = migrationFolders.map((name) => ({
      name,
      applied: allUpToDate || appliedMigrations.includes(name),
      timestamp: name.split("_")[0],
      description: name.split("_").slice(1).join("_"),
    }));

    return { migrations: migrationList };
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: { origin: "admin_migrations_list" },
    });

    throw error;
  }
}

const migrationActionSchema = z.object({
  action: z.enum(["deploy", "status", "reset"]),
});

export const executeMigrationAction = adminAction
  .schema(migrationActionSchema)
  .action(async ({ parsedInput: { action } }) => {
    try {
      if (action === "deploy") {
        const { stdout, stderr } = await execPromise(
          "npx prisma migrate deploy --schema=./prisma/schema.prisma"
        );

        revalidatePath("/admin");

        return {
          success: true,
          output: stdout,
          error: stderr || null,
        };
      } else if (action === "status") {
        const { stdout } = await execPromise(
          "npx prisma migrate status --schema=./prisma/schema.prisma"
        );

        return {
          success: true,
          output: stdout,
        };
      } else if (action === "reset") {
        const { stdout, stderr } = await execPromise(
          "npx prisma migrate reset --force --skip-seed --schema=./prisma/schema.prisma"
        );

        revalidatePath("/admin");

        return {
          success: true,
          output: stdout,
          error: stderr || null,
          warning: "Database has been reset!",
        };
      }

      throw new Error("Invalid action");
    } catch (error) {
      Sentry.captureException(error, {
        level: "error",
        tags: { origin: "admin_migrations_run" },
      });

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      throw new Error(`Failed to execute migration: ${errorMessage}`);
    }
  });
