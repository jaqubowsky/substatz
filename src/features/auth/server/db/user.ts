import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const ONE_DAY = 24 * 60 * 60 * 1000;

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
) {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = new Date(Date.now() + ONE_DAY);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function updateUserLastLogin(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
}

export async function verifyUserEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return null;
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });
}

export async function generateNewVerificationToken(email: string) {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = new Date(Date.now() + ONE_DAY);

  return prisma.user.update({
    where: { email },
    data: {
      verificationToken,
      verificationTokenExpiry,
    },
  });
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
    },
  });
}
