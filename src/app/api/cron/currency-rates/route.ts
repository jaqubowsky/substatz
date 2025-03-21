import { fetchLatestExchangeRates } from "@/lib/currency-rates";
import { env } from "@/lib/env";
import { authRateLimiter, getIp } from "@/lib/rate-limit";
import { upsertCurrencyRates } from "@/server/db/currency-rates";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    const ip = await getIp();
    const identifier = `cron:${ip}`;

    const { success } = await authRateLimiter.limit(identifier);

    if (!success) {
      throw new Error("Too many requests");
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];

    if (token !== env.CRON_SECRET) {
      throw new Error("Unauthorized: Invalid token");
    }

    const apiKey = env.EXCHANGE_RATES_API_KEY;

    if (!apiKey) {
      throw new Error("Server configuration error: Missing API key");
    }

    const rates = await fetchLatestExchangeRates(apiKey);

    if (!rates || rates.length === 0) {
      throw new Error("Failed to fetch exchange rates");
    }

    await upsertCurrencyRates(rates);

    return NextResponse.json({
      success: true,
      message: "Currency rates updated successfully",
      updatedAt: new Date().toISOString(),
      count: rates.length,
    });
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: {
        origin: "cron_currency_rates",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to update currency rates.",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
