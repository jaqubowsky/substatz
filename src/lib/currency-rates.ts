import { Currency } from "@prisma/client";

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
      `${process.env.EXCHANGE_RATES_API_URL}/${apiKey}/latest/USD`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();

    if (data.result !== "success") {
      throw new Error("API request was not successful");
    }

    const currencyMapping: Record<string, Currency> = {
      USD: "USD",
      EUR: "EUR",
      GBP: "GBP",
      JPY: "JPY",
      CAD: "CAD",
      AUD: "AUD",
      CHF: "CHF",
      CNY: "CNY",
      INR: "INR",
      PLN: "PLN",
    };

    const rates: { currency: Currency; rate: number }[] = [
      { currency: "USD", rate: 1 },
    ];

    Object.entries(data.conversion_rates).forEach(([code, rate]) => {
      const currency = currencyMapping[code];
      if (currency && currency !== "USD") {
        rates.push({ currency, rate: rate as number });
      }
    });

    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
}

export const fallbackExchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 151.12,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.9,
  CNY: 7.24,
  INR: 83.36,
  PLN: 3.94,
};
