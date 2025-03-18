import { auth } from "@/auth";
import * as Sentry from "@sentry/nextjs";
import { createSafeActionClient } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { errors } from "./errorMessages";

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
  if (!session?.user?.id) {
    throw new ActionError(errors.AUTH.UNAUTHORIZED.message);
  }

  return next({ ctx: { session } });
});

export const publicAction = action.use(async ({ next }) => {
  return next();
});
