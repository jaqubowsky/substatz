import { fetchLatestExchangeRates } from "@/lib/currency-rates";
import { upsertCurrencyRates } from "@/server/db/currency-rates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error(
        "Missing or invalid authorization header for currency rates cron job"
      );
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const expectedToken = process.env.CRON_SECRET;

    if (!expectedToken) {
      console.error("CRON_SECRET is not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error: Missing cron secret" },
        { status: 500 }
      );
    }

    if (token !== expectedToken) {
      console.error("Invalid token provided for currency rates cron job");
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const apiKey = process.env.EXCHANGE_RATES_API_KEY;

    if (!apiKey) {
      console.error(
        "EXCHANGE_RATES_API_KEY is not set in environment variables"
      );
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    console.log("Fetching latest exchange rates...");
    const rates = await fetchLatestExchangeRates(apiKey);

    if (!rates || rates.length === 0) {
      console.error("No exchange rates returned from API");
      return NextResponse.json(
        { error: "Failed to fetch exchange rates" },
        { status: 500 }
      );
    }

    console.log(`Updating ${rates.length} currency rates in database...`);
    await upsertCurrencyRates(rates);

    return NextResponse.json({
      success: true,
      message: "Currency rates updated successfully",
      updatedAt: new Date().toISOString(),
      count: rates.length,
    });
  } catch (error) {
    console.error("Error updating currency rates:", error);

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
