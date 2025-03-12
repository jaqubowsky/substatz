"use server";

import { errors } from "@/lib/errorMessages";
import { ActionError, publicAction } from "@/lib/safe-action";
import { User } from "@prisma/client";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../lib/auth";
import { sendVerificationEmail, sendWelcomeEmail } from "../../lib/email";
import { emailSchema, loginSchema, registerSchema } from "../../schemas/auth";
import {
  createUser,
  generateNewVerificationToken,
  getUserByEmail,
  verifyUserEmail,
} from "../db/user";

export const registerAction = publicAction
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new ActionError(errors.AUTH.EMAIL_IN_USE.message);

    const hashedPassword = await hashPassword(password);
    const user = await createUser(name, email, hashedPassword);

    try {
      if (!user.verificationToken) return;

      await sendVerificationEmail(email, name, user.verificationToken);
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
    const user = (await getUserByEmail(email)) as User;
    if (!user) throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);

    const isValid = await verifyPassword(password, user.password || "");
    if (!isValid) {
      throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);
    }

    if (!user.emailVerified) {
      throw new ActionError(errors.AUTH.EMAIL_NOT_VERIFIED.message);
    }

    return { success: true };
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

    const updatedUser = await generateNewVerificationToken(email);
    if (!updatedUser.verificationToken) {
      throw new ActionError(errors.GENERAL.SERVER_ERROR.message);
    }

    try {
      await sendVerificationEmail(
        updatedUser.email,
        updatedUser.name,
        updatedUser.verificationToken
      );
    } catch {
      throw new ActionError(errors.AUTH.VERIFICATION_EMAIL_ERROR.message);
    }

    return {
      success: true,
      message: "Verification email sent!",
    };
  });
