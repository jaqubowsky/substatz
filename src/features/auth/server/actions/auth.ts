"use server";

import { errors } from "@/lib/errorMessages";
import { ActionError, publicAction } from "@/lib/safe-action";
import { hashPassword, verifyPassword } from "../../lib/auth";
import { loginSchema, registerSchema } from "../../schemas/auth";
import { createUser, getUserByEmail } from "../db";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const registerAction = publicAction
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new ActionError(errors.AUTH.EMAIL_IN_USE.message);

    const hashedPassword = await hashPassword(password);
    const user = await createUser(name, email, hashedPassword);

    return {
      id: user.id,
    };
  });

export const loginAction = publicAction
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const user = await getUserByEmail(email);
    if (!user) throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new ActionError(errors.AUTH.INVALID_CREDENTIALS.message);
    }

    return {
      id: user.id,
      name: user.name || "",
      email: user.email,
      password,
    };
  });
