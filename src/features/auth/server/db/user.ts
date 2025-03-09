import { prisma } from "@/lib/prisma";

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
) {
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
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
