import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/server/db/user";
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
    },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ONE_DAY);

  await prisma.verificationToken.create({
    data: {
      identifier: user.id,
      token,
      expires,
    },
  });

  return {
    ...user,
    verificationToken: token,
  };
}

export async function generateNewVerificationToken(email: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  await prisma.verificationToken.deleteMany({
    where: { identifier: user.id },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ONE_DAY);

  await prisma.verificationToken.create({
    data: {
      identifier: user.id,
      token,
      expires,
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

  await prisma.passwordResetToken.deleteMany({
    where: { identifier: user.id },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ONE_HOUR);

  await prisma.passwordResetToken.create({
    data: {
      identifier: user.id,
      token,
      expires,
    },
  });

  return {
    ...user,
    resetToken: token,
  };
}

export async function resetUserPassword(token: string, hashedPassword: string) {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      expires: {
        gt: new Date(),
      },
    },
  });

  if (!resetToken) return null;

  const updatedUser = await prisma.user.update({
    where: { id: resetToken.identifier },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      identifier_token: {
        identifier: resetToken.identifier,
        token: resetToken.token,
      },
    },
  });

  return updatedUser;
}
