import { getServerAuth } from "@/hooks/get-server-auth";
import * as Sentry from "@sentry/nextjs";
import { createSafeActionClient } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { errors } from "./errorMessages";
import { getIp, publicApiRateLimiter, RateLimiter } from "./rate-limit";

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
  const session = await getServerAuth();
  if (!session) throw new ActionError(errors.AUTH.UNAUTHORIZED.message);

  const ip = await getIp();
  if (!ip) throw new ActionError(errors.GENERAL.RATE_LIMIT.message);

  const { success } = await publicApiRateLimiter.limit(ip);
  if (!success) throw new ActionError(errors.GENERAL.RATE_LIMIT.message);

  return next({ ctx: { session } });
});

export const publicAction = action.use(async ({ next }) => {
  const ip = await getIp();
  if (!ip) throw new ActionError(errors.GENERAL.RATE_LIMIT.message);

  const { success } = await publicApiRateLimiter.limit(ip);
  if (!success) throw new ActionError(errors.GENERAL.RATE_LIMIT.message);

  return next();
});

export const publicActionWithLimiter = (
  limiter: RateLimiter,
  customIdentifier?: string
) =>
  action.use(async ({ next }) => {
    const ip = await getIp();
    if (!ip) throw new ActionError(errors.GENERAL.RATE_LIMIT.message);

    const identifier = customIdentifier ? `${customIdentifier}:${ip}` : ip;

    const { success } = await limiter.limit(identifier);
    if (!success) throw new ActionError(errors.GENERAL.RATE_LIMIT.message);

    return next();
  });
