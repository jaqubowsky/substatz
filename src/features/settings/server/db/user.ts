import { prisma } from "@/lib/prisma";

export async function updateUserName(userId: string, name: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { name },
  });
}

export async function updateUserPassword(
  userId: string,
  hashedPassword: string
) {
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}
