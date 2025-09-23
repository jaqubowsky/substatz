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

export const getUserByEmail = async (email: string) => {
  "use cache";

  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserById = async (id: string) => {
  "use cache";

  return prisma.user.findUnique({
    where: { id },
  });
};

export const getUserForSession = async (id: string) => {
  "use cache";

  return prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      image: true,
      plan: true,
      defaultCurrency: true,
    },
  });
};
