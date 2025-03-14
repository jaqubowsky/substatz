"use client";

import { Currency } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type UpdateSessionData = {
  defaultCurrency: Currency;
};

export function useClientAuth() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  console.log(user, "user");

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.push("/login");
  }, [router]);

  const update = useCallback(
    async (data: UpdateSessionData) => {
      await updateSession({
        user: {
          ...session?.user,
          ...data,
        },
      });
      router.refresh();
    },
    [updateSession, session, router]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    update,
  };
}
