import { fetchLatestExchangeRates } from "@/lib/currency-rates";
import { upsertCurrencyRates } from "@/server/db/currency-rates";
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
    const expectedToken = process.env.CRON_SECRET;

    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const apiKey = process.env.EXCHANGE_RATES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    const rates = await fetchLatestExchangeRates(apiKey);

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
      },
      { status: 500 }
    );
  }
}
