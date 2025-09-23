import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";

export async function updateUserPassword(
  userId: string,
  hashedPassword: string
) {
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export const getUserById = async (userId: string) => {
  "use cache";

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
  defaultCurrency: Currency
) {
  return prisma.user.update({
    where: { id: userId },
    data: { defaultCurrency },
  });
}
