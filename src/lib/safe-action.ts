import { auth } from "@/auth";
import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { createSafeActionClient } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { errors } from "./errorMessages";
import { getIp, publicApiRateLimiter, rateLimit } from "./rate-limit";

export class ActionError extends Error {}

export const action = createSafeActionClient({
  validationAdapter: zodAdapter(),

  handleServerError: (e) => {
    if (e instanceof ActionError) return e.message;

    Sentry.captureException(e, {
      level: "error",
      tags: {
        origin: "server_action",
      },
    });

    return errors.GENERAL.SERVER_ERROR.message;
  },
});

export const privateAction = action.use(async ({ next }) => {
  const session = await auth();
  const ip = await getIp();

  if (!ip) {
    throw new ActionError(errors.GENERAL.RATE_LIMIT.message);
  }

  const { success } = await rateLimit(ip, publicApiRateLimiter);

  if (!success) {
    throw new ActionError(errors.GENERAL.RATE_LIMIT.message);
  }

  if (!session?.user?.id) {
    throw new ActionError(errors.AUTH.UNAUTHORIZED.message);
  }

  return next({ ctx: { session } });
});

export const publicAction = action.use(async ({ next }) => {
  const ip = await getIp();

  if (!ip) {
    throw new ActionError(errors.GENERAL.RATE_LIMIT.message);
  }

  const { success } = await rateLimit(ip, publicApiRateLimiter);

  if (!success) {
    throw new ActionError(errors.GENERAL.RATE_LIMIT.message);
  }

  return next();
});

export const publicActionWithLimiter = (limiter: Ratelimit, customIdentifier?: string) =>
  action.use(async ({ next }) => {
    const ip = await getIp();

    if (!ip) {
      throw new ActionError(errors.GENERAL.RATE_LIMIT.message);
    }

    const identifier = identifier ? `${identifier}:${ip}` : ip;
    const { success } = await rateLimit(identifier, limiter);

    if (!success) {
      throw new ActionError(errors.GENERAL.RATE_LIMIT.message);
    }

    return next();
  });
