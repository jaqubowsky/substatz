import { fetchLatestExchangeRates } from "@/lib/currency-rates";
import { env } from "@/lib/env";
import { upsertCurrencyRates } from "@/server/db/currency-rates";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const expectedToken = env.CRON_SECRET;

    if (!expectedToken) {
      return NextResponse.json(
        { error: "Server configuration error: Missing cron secret" },
        { status: 500 }
      );
    }

    if (token !== expectedToken) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const apiKey = env.EXCHANGE_RATES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    const rates = await fetchLatestExchangeRates(apiKey);

    if (!rates || rates.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch exchange rates" },
        { status: 500 }
      );
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
        error: "Failed to update currency rates",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
