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
    include: {
      accounts: true,
    },
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

export async function getUserByAccount(
  provider: string,
  providerAccountId: string
) {
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: {
      user: true,
    },
  });

  return account?.user ?? null;
}

export async function linkAccount(
  userId: string,
  provider: string,
  providerAccountId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: number
) {
  return prisma.account.create({
    data: {
      userId,
      provider,
      providerAccountId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      type: "oauth",
    },
  });
}
