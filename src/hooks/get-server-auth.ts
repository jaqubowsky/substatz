"use server";

import { auth } from "@/auth";
import { userDb } from "@/server";
import { cacheLife, cacheTag } from "next/cache";

export const getUserData = async (userId: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("user", `user-${userId}`);

  return userDb.getUserForSession(userId);
};

export async function getServerAuth() {
  const session = await auth();

  const user = session?.user;
  if (!user?.id) return null;

  const dbUser = await getUserData(user.id);
  if (!dbUser) return null;

  return {
    user: {
      ...user,
      ...dbUser,
    },
  };
}
