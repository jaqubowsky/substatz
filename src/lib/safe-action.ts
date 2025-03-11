import { getServerAuth } from "@/server";
import { createSafeActionClient } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { errors } from "./errorMessages";

export class ActionError extends Error {}

export const action = createSafeActionClient({
  validationAdapter: zodAdapter(),

  handleServerError: (e) => {
    if (e instanceof ActionError) return e.message;

    console.error("Server action error:", e);
    return errors.GENERAL.SERVER_ERROR.message;
  },
});

export const privateAction = action.use(async ({ next }) => {
  const session = await getServerAuth();
  if (!session?.user?.id) {
    throw new ActionError(errors.AUTH.UNAUTHORIZED.message);
  }

  return next({ ctx: { session } });
});

export const publicAction = action.use(async ({ next }) => {
  return next();
});
