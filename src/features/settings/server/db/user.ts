import { cacheLife, cacheTag } from "next/cache";
import type { Currency } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateUserPassword(
  userId: string,
  hashedPassword: string,
) {
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export const getUserById = async (userId: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("user", `user-${userId}`);

  return prisma.user.findUnique({
    where: { id: userId },
  });
};

export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}

export async function updateUserCurrency(
  userId: string,
  defaultCurrency: Currency,
) {
  return prisma.user.update({
    where: { id: userId },
    data: { defaultCurrency },
  });
}
