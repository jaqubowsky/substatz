import { env } from "@/lib/env";
import { Currency } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

export async function fetchLatestExchangeRates(
  apiKey: string
): Promise<{ currency: Currency; rate: number }[]> {
  try {
    const response = await fetch(
      `${env.EXCHANGE_RATES_API_URL}/${apiKey}/latest/USD`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();

    if (data.result !== "success") {
      throw new Error("API request was not successful");
    }

    const rates: { currency: Currency; rate: number }[] = [
      { currency: Currency.USD, rate: 1 },
    ];

    Object.entries(data.conversion_rates).forEach(([code, rate]) => {
      const currency = Currency[code as keyof typeof Currency];
      if (!currency || currency === Currency.USD) {
        return;
      }

      rates.push({ currency, rate });
    });

    return rates;
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: {
        origin: "fetch_latest_exchange_rates",
      },
    });

    throw error;
  }
}
