import { z } from "zod";

import { errors } from "@/lib/errorMessages";
import { ActionError, publicAction } from "@/lib/safe-action";

import { sendWelcomeEmail } from "@/lib/email";
import { verifyUserEmail } from "@/server/db/user";

export const verifyEmailAction = publicAction
  .schema(z.object({ token: z.string() }))
  .action(async ({ parsedInput }) => {
    const { token } = parsedInput;

    if (!token) {
      return {
        success: false,
        error: errors.AUTH.VERIFICATION_TOKEN_INVALID.message,
      };
    }

    const user = await verifyUserEmail(token);
    if (!user) {
      throw new ActionError(errors.AUTH.VERIFICATION_TOKEN_EXPIRED.message);
    }

    if (user.email && user.name) {
      await sendWelcomeEmail(user.email, user.name);
    }

    return {
      success: true,
      message: "Email verified successfully!",
    };
  });
