import { prisma } from "@/lib/prisma";

export async function verifyUserEmail(token: string) {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token,
      expires: {
        gt: new Date(),
      },
    },
  });

  if (!verificationToken) return null;

  const updatedUser = await prisma.user.update({
    where: { id: verificationToken.identifier },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      },
    },
  });

  return updatedUser;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
