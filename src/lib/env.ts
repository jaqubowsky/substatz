import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  isServer: typeof window === "undefined",

  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_PRICE_ID: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.string().min(1),
    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    EMAIL_FROM: z.string(),
    CRON_SECRET: z.string().min(32),
    EXCHANGE_RATES_API_KEY: z.string().min(1),
    EXCHANGE_RATES_API_URL: z.string().url(),
    STRIPE_API_VER: z.string().min(1),
    ADMIN_EMAIL: z.string().email(),
  },

  shared: {
    BASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    SENTRY_DSN: z.string().min(1),
  },

  experimental__runtimeEnv: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
});
