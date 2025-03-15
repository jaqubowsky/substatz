"use server";

import { signIn } from "@/auth";
import { errors } from "@/lib/errorMessages";
import { ActionError, publicAction } from "@/lib/safe-action";
import { Provider } from "@prisma/client";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../lib/auth";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../../lib/email";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../../schemas/auth";
import {
  createPasswordResetToken,
  createUser,
  generateNewVerificationToken,
  getUserByEmail,
  resetUserPassword,
  verifyUserEmail,
} from "../db/user";
export const registerAction = publicAction
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new ActionError(errors.AUTH.EMAIL_IN_USE.message);

    const hashedPassword = await hashPassword(password);
    const result = await createUser(name, email, hashedPassword);

    try {
      if (!result.verificationToken) return;

      await sendVerificationEmail(email, name, result.verificationToken);
    } catch {
      throw new ActionError(errors.AUTH.VERIFICATION_EMAIL_ERROR.message);
    }

    return {
      success: true,
      message: "Account created successfully!",
    };
  });

export const loginAction = publicAction
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const user = await getUserByEmail(email);
    if (!user) throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);

    const isValid = await verifyPassword(password, user.password || "");
    if (!isValid) {
      throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);
    }

    if (!user.emailVerified) {
      throw new ActionError(errors.AUTH.EMAIL_NOT_VERIFIED.message);
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);
    }

    return { success: true };
  });

export const googleLoginAction = publicAction.action(async () => {
  const result = await signIn("google", {
    redirect: false,
    callbackUrl: "/dashboard",
  });

  if (result?.error) {
    throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);
  }

  return { success: true, url: result };
});

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

    await sendWelcomeEmail(user.email, user.name);

    return {
      success: true,
      message: "Email verified successfully!",
    };
  });

export const resendVerificationAction = publicAction
  .schema(emailSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const user = await getUserByEmail(email);
    if (!user) throw new ActionError(errors.AUTH.USER_NOT_FOUND.message);

    if (user.emailVerified) {
      return {
        success: true,
        message: "Email already verified.",
      };
    }

    const result = await generateNewVerificationToken(email);
    if (!result || !result.verificationToken) {
      throw new ActionError(errors.GENERAL.SERVER_ERROR.message);
    }

    try {
      await sendVerificationEmail(
        result.email,
        result.name,
        result.verificationToken
      );
    } catch {
      throw new ActionError(errors.AUTH.VERIFICATION_EMAIL_ERROR.message);
    }

    return {
      success: true,
      message: "Verification email sent!",
    };
  });

export const forgotPasswordAction = publicAction
  .schema(emailSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const user = await getUserByEmail(email);
    if (!user) {
      return {
        success: true,
        message:
          "If your email is registered, you will receive a password reset link.",
      };
    }

    if (user.provider !== Provider.CREDENTIALS) {
      return {
        success: true,
        message:
          "If your email is registered, you will receive a password reset link.",
      };
    }

    const result = await createPasswordResetToken(email);
    if (!result || !result.resetToken) {
      throw new ActionError(errors.GENERAL.SERVER_ERROR.message);
    }

    try {
      await sendPasswordResetEmail(
        result.email,
        result.name,
        result.resetToken
      );
    } catch {
      throw new ActionError(errors.AUTH.PASSWORD_RESET_EMAIL_ERROR.message);
    }

    return {
      success: true,
      message:
        "If your email is registered, you will receive a password reset link.",
    };
  });

export const resetPasswordAction = publicAction
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    const { token, password } = parsedInput;

    const hashedPassword = await hashPassword(password);
    const user = await resetUserPassword(token, hashedPassword);

    if (!user) {
      throw new ActionError(errors.AUTH.RESET_TOKEN_INVALID.message);
    }

    return {
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    };
  });
