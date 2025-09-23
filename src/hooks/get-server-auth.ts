"use server";

import { auth } from "@/auth";
import { userDb } from "@/server";

export const getUserData = async (userId: string) => {
  "use cache";

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
