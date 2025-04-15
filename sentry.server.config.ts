// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from "@/lib/env";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: env.SENTRY_DSN,

  enabled: env.NODE_ENV === "production",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  environment: env.NODE_ENV,
});
