import { prisma } from "@/lib/prisma";
import { Provider } from "@prisma/client";
import crypto from "crypto";

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      provider: Provider.CREDENTIALS,
    },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_DAY);

  await prisma.verificationToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  return {
    ...user,
    verificationToken: token,
  };
}

export async function createUserFromOAuth({
  email,
  name,
  image,
  emailVerified,
}: {
  email: string;
  name: string;
  image?: string;
  emailVerified: Date;
}) {
  return prisma.user.create({
    data: {
      email,
      name,
      image,
      emailVerified,
      provider: Provider.GOOGLE,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function verifyUserEmail(token: string) {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!verificationToken) return null;

  const updatedUser = await prisma.user.update({
    where: { id: verificationToken.userId },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return updatedUser;
}

export async function generateNewVerificationToken(email: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  await prisma.verificationToken.deleteMany({
    where: { userId: user.id },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_DAY);

  await prisma.verificationToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  return {
    ...user,
    verificationToken: token,
  };
}

export async function createPasswordResetToken(email: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  await prisma.resetToken.deleteMany({
    where: { userId: user.id },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_HOUR);

  await prisma.resetToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  return {
    ...user,
    resetToken: token,
  };
}

export async function resetUserPassword(token: string, hashedPassword: string) {
  const resetToken = await prisma.resetToken.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!resetToken) return null;

  const updatedUser = await prisma.user.update({
    where: { id: resetToken.userId },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.resetToken.delete({
    where: { id: resetToken.id },
  });

  return updatedUser;
}
