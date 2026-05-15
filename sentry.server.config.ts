// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

Sentry.init({
  dsn: env.SENTRY_DSN,

  enabled: env.NODE_ENV === "production",

  // Disable import-in-the-middle ESM loader hooks: Turbopack standalone
  // builds emit unresolvable hashed external specifiers for it, which
  // crashes the instrumentation hook (every route -> 500). Error
  // reporting still works; only ESM auto-tracing instrumentation is off.
  registerEsmLoaderHooks: false,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  environment: env.NODE_ENV,
});
