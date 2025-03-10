"use server";

import { hashPassword, verifyPassword } from "@/features/auth/lib/auth";
import { auth } from "@/lib/auth";
import { getFirstErrorMessage } from "@/lib/utils";
import {
  ChangePasswordFormValues,
  UpdateNameFormValues,
  changePasswordSchema,
  updateNameSchema,
} from "../../schemas/settings";
import * as db from "../db";

export async function updateNameAction(unsafeData: UpdateNameFormValues) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to update your name",
      };
    }

    const validationResult = updateNameSchema.safeParse(unsafeData);

    if (!validationResult.success) {
      return {
        success: false,
        error: getFirstErrorMessage(validationResult.error),
      };
    }

    const validData = validationResult.data;
    const updatedUser = await db.updateUserName(
      session.user.id,
      validData.name
    );

    return {
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to update name",
    };
  }
}

export async function changePasswordAction(
  unsafeData: ChangePasswordFormValues
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to change your password",
      };
    }

    const validationResult = changePasswordSchema.safeParse(unsafeData);

    if (!validationResult.success) {
      return {
        success: false,
        error: getFirstErrorMessage(validationResult.error),
      };
    }

    const validData = validationResult.data;
    const user = await db.getUserById(session.user.id);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const isValid = await verifyPassword(
      validData.currentPassword,
      user.password
    );

    if (!isValid) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    const hashedPassword = await hashPassword(validData.newPassword);
    await db.updateUserPassword(session.user.id, hashedPassword);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to change password",
    };
  }
}

export async function deleteAccountAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete your account",
      };
    }

    await db.deleteUser(session.user.id);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete account",
    };
  }
}
