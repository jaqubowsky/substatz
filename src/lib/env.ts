import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Authentication
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),

  // OAuth providers
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  // Email
  EMAIL_SERVER_HOST: z.string().min(1),
  EMAIL_SERVER_PORT: z.string().min(1),
  EMAIL_SERVER_USER: z.string().min(1),
  EMAIL_SERVER_PASSWORD: z.string().min(1),
  EMAIL_FROM: z.string().email(),

  // CRON
  CRON_SECRET: z.string().min(32),

  // Exchange Rates API
  EXCHANGE_RATES_API_KEY: z.string().min(1),
  EXCHANGE_RATES_API_URL: z.string().url(),

  // Runtime environment
  NODE_ENV: z.enum(["development", "test", "production"]),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
});

/**
 * Client-side environment variables
 */
const clientEnv: {
  [K in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[K];
} = {
  NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV as
    | "development"
    | "test"
    | "production",
};

/**
 * Type-validate and parse the client environment variables.
 */
const _clientEnv = clientSchema.safeParse(clientEnv);

if (!_clientEnv.success) {
  console.error(
    "❌ Invalid client environment variables:\n",
    ...formatZodError(_clientEnv.error.format())
  );
  throw new Error("Invalid client environment variables");
}

/**
 * Type-validate and parse the server environment variables.
 * If variables are invalid, CI/testing will fail and not allow code to be built/deployed.
 * This ensures server-side env vars are properly defined.
 */
const _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error(
    "❌ Invalid server environment variables:\n",
    ...formatZodError(_serverEnv.error.format())
  );
  throw new Error("Invalid server environment variables");
}

/**
 * Format Zod validation errors into a readable format
 */
function formatZodError(
  errors: z.ZodFormattedError<Map<string, string>, string>
): string[] {
  return Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
      return undefined;
    })
    .filter((item): item is string => Boolean(item));
}

/**
 * Server-side environment variables
 * Should ONLY be imported in server components or server actions
 */
export const env = _serverEnv.data;

/**
 * Client-side environment variables that are safe to expose
 */
export const publicEnv = _clientEnv.data;

// Only import env in server components or server actions
// import { env } from "@/lib/env";

// publicEnv is safe to use anywhere
// import { publicEnv } from "@/lib/env";
