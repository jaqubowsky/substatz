"use server";

import { getFirstErrorMessage } from "@/lib/utils";
import { hashPassword, verifyPassword } from "../../lib/auth";
import {
  LoginFormValues,
  RegisterFormValues,
  loginSchema,
  registerSchema,
} from "../../schemas/auth";
import { createUser, getUserByEmail } from "../db";

export async function registerAction(unsafeData: RegisterFormValues) {
  const validationResult = registerSchema.safeParse(unsafeData);

  if (!validationResult.success) {
    return {
      success: false,
      error: getFirstErrorMessage(validationResult.error),
    };
  }

  const validData = validationResult.data;

  const existingUser = await getUserByEmail(validData.email);

  if (existingUser) {
    return {
      success: false,
      error: "User with this email already exists",
    };
  }

  const hashedPassword = await hashPassword(validData.password);

  const user = await createUser(
    validData.name,
    validData.email,
    hashedPassword
  );

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function loginAction(unsafeData: LoginFormValues) {
  const validationResult = loginSchema.safeParse(unsafeData);

  if (!validationResult.success) {
    return {
      success: false,
      error: getFirstErrorMessage(validationResult.error),
    };
  }

  const validData = validationResult.data;

  const user = await getUserByEmail(validData.email);

  if (!user) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  const isValid = await verifyPassword(validData.password, user.password);

  if (!isValid) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
