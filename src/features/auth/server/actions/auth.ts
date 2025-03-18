"use server";

import { signIn } from "@/auth";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas";
import {
  createPasswordResetToken,
  createUser,
  generateNewVerificationToken,
  resetUserPassword,
} from "@/features/auth/server/db/user";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { errors } from "@/lib/errorMessages";
import { ActionError, publicAction } from "@/lib/safe-action";

import { userDb } from "@/server";
import { getUserByEmail } from "@/server/db/user";

export const registerAction = publicAction
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const existingUser = await userDb.getUserByEmail(email);
    if (existingUser) throw new ActionError(errors.AUTH.EMAIL_IN_USE.message);

    const hashedPassword = await hashPassword(password);

    const result = await createUser(name, email, hashedPassword);
    if (!result.verificationToken) return;

    await sendVerificationEmail(email, name, result.verificationToken);

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

    const emailResult = await sendVerificationEmail(
      result.email,
      result.name,
      result.verificationToken
    );

    if (!emailResult?.success) {
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

    const result = await createPasswordResetToken(email);
    if (!result || !result.resetToken) {
      throw new ActionError(errors.GENERAL.SERVER_ERROR.message);
    }

    const emailResult = await sendPasswordResetEmail(
      result.email,
      result.name,
      result.resetToken
    );

    if (!emailResult?.success) {
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
