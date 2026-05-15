import * as Sentry from "@sentry/nextjs";

export async function register() {
  // A throw here makes Next treat the instrumentation hook as fatal and
  // returns 500 for every route. Sentry server SDK init can fail in
  // bundled standalone builds (e.g. @sentry/nextjs OpenTelemetry loader
  // issues), so never let it take the whole app down.
  try {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  } catch (error) {
    console.error("Sentry instrumentation failed to load:", error);
  }
}

export const onRequestError = Sentry.captureRequestError;
