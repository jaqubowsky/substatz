import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbStatus = await checkDatabaseConnection();

    const envStatus = checkRequiredEnvVars();

    const isHealthy = dbStatus.healthy && envStatus.healthy;

    return NextResponse.json(
      {
        status: isHealthy ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "unknown",
        services: {
          database: dbStatus,
          environment: envStatus,
        },
      },
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      healthy: true,
      message: "Database connection successful",
    };
  } catch (error) {
    console.error("Database health check failed:", error);
    return {
      healthy: false,
      message:
        error instanceof Error ? error.message : "Database connection failed",
    };
  }
}

function checkRequiredEnvVars() {
  const requiredVars = [
    "DATABASE_URL",
    "AUTH_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "EMAIL_SERVER_HOST",
    "EMAIL_SERVER_USER",
    "EMAIL_SERVER_PASSWORD",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  return {
    healthy: missingVars.length === 0,
    message:
      missingVars.length === 0
        ? "All required environment variables are set"
        : `Missing required environment variables: ${missingVars.join(", ")}`,
  };
}
